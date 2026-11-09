export interface CustomSoundMeta {
  id: string;
  name: string;
  fileName: string;
  sizeBytes: number;
  dateAdded: number;
  durationApprox?: string;
}

const DB_NAME = 'AqimAsSalah_AudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_sounds';

class CustomAudioStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private objectUrls: Map<string, string> = new Map();

  private getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !('indexedDB' in window)) {
          reject(new Error('IndexedDB is not supported in this browser.'));
          return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    }
    return this.dbPromise;
  }

  /**
   * Saves an uploaded audio file from the user's phone into IndexedDB
   */
  public async saveAudio(file: File, customName?: string): Promise<CustomSoundMeta> {
    const db = await this.getDB();
    const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanName = (customName && customName.trim()) || file.name.replace(/\.[^/.]+$/, '');

    const record = {
      id,
      name: cleanName,
      fileName: file.name,
      blob: file,
      sizeBytes: file.size,
      dateAdded: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(record);

      request.onsuccess = () => {
        resolve({
          id,
          name: cleanName,
          fileName: file.name,
          sizeBytes: file.size,
          dateAdded: record.dateAdded,
        });
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Retrieves list of all custom sounds metadata stored on the device
   */
  public async getAllSounds(): Promise<CustomSoundMeta[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result || [];
          const list: CustomSoundMeta[] = results.map((item: {
            id: string;
            name: string;
            fileName: string;
            sizeBytes: number;
            dateAdded: number;
          }) => ({
            id: item.id,
            name: item.name,
            fileName: item.fileName,
            sizeBytes: item.sizeBytes,
            dateAdded: item.dateAdded,
          }));
          resolve(list);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * Retrieves the audio Blob for playback
   */
  public async getSoundBlob(id: string): Promise<Blob | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result && request.result.blob) {
          resolve(request.result.blob);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Returns a playable Object URL for the custom sound
   */
  public async getSoundUrl(id: string): Promise<string | null> {
    if (this.objectUrls.has(id)) {
      return this.objectUrls.get(id)!;
    }

    const blob = await this.getSoundBlob(id);
    if (!blob) return null;

    const url = URL.createObjectURL(blob);
    this.objectUrls.set(id, url);
    return url;
  }

  /**
   * Deletes a custom sound from the phone
   */
  public async deleteSound(id: string): Promise<boolean> {
    const db = await this.getDB();

    // Revoke object URL
    if (this.objectUrls.has(id)) {
      try {
        URL.revokeObjectURL(this.objectUrls.get(id)!);
      } catch {
        // ignore
      }
      this.objectUrls.delete(id);
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}

export const customAudioStorage = new CustomAudioStorage();
