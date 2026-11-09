import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal pure-Node PNG writer using zlib
function createPng(width, height, getPixelRGBA) {
  // 8-byte PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: 13 bytes
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);   // bit depth: 8
  ihdrData.writeUInt8(6, 9);   // color type: 6 (RGBA)
  ihdrData.writeUInt8(0, 10);  // compression method: 0
  ihdrData.writeUInt8(0, 11);  // filter method: 0
  ihdrData.writeUInt8(0, 12);  // interlace method: 0
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Scanlines: each row has 1 filter byte (0 = None) followed by width * 4 bytes (RGBA)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData.writeUInt8(0, rowOffset); // filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixelRGBA(x, y, width, height);
      rawData.writeUInt8(r, pixelOffset);
      rawData.writeUInt8(g, pixelOffset + 1);
      rawData.writeUInt8(b, pixelOffset + 2);
      rawData.writeUInt8(a, pixelOffset + 3);
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 calculation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// Render Islamic crescent & mosque silhouette
function renderIslamicIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;

  // Background: Deep Emerald green gradient (#042f2e to #065f46)
  // Distance from center for radial gradient
  const cx = 0.5;
  const cy = 0.5;
  const dist = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);

  // Base background emerald
  let r = Math.round(4 + (1 - dist) * 12);
  let g = Math.round(55 + (1 - dist) * 45);
  let b = Math.round(46 + (1 - dist) * 35);
  let a = 255;

  // Safe area for maskable vs rounded app icon
  if (!isMaskable) {
    // Soft squircle corner for standard icons
    const radius = 0.22;
    const qx = Math.max(0, Math.abs(nx - 0.5) - (0.5 - radius));
    const qy = Math.max(0, Math.abs(ny - 0.5) - (0.5 - radius));
    const cornerDist = Math.sqrt(qx * qx + qy * qy);
    if (cornerDist > radius) {
      return [0, 0, 0, 0]; // transparent outside squircle
    }
  }

  // Golden Crescent Moon
  // Moon outer circle center (0.48, 0.45), radius 0.22
  const dOuter = Math.sqrt((nx - 0.48) ** 2 + (ny - 0.45) ** 2);
  // Moon inner cutout circle center (0.54, 0.42), radius 0.18
  const dInner = Math.sqrt((nx - 0.54) ** 2 + (ny - 0.42) ** 2);

  const inCrescent = dOuter <= 0.22 && dInner >= 0.17;

  // Star at (0.64, 0.38), radius 0.04
  const dStar = Math.sqrt((nx - 0.63) ** 2 + (ny - 0.38) ** 2);
  const inStar = dStar <= 0.04;

  // Mosque Dome silhouette at bottom (ny >= 0.65)
  // Dome peak around nx=0.5, y=0.58
  const domeDx = Math.abs(nx - 0.5);
  const domeCurve = 0.62 + (domeDx * domeDx) * 1.5;
  const inDome = ny >= domeCurve && ny <= 0.82 && domeDx <= 0.32;

  // Minaret spires left and right
  const inLeftMinaret = Math.abs(nx - 0.22) <= 0.03 && ny >= 0.52 && ny <= 0.85;
  const inRightMinaret = Math.abs(nx - 0.78) <= 0.03 && ny >= 0.52 && ny <= 0.85;

  // Minaret top cones
  const inLeftCone = Math.abs(nx - 0.22) <= (0.52 - ny) * 0.5 && ny >= 0.46 && ny < 0.52;
  const inRightCone = Math.abs(nx - 0.78) <= (0.52 - ny) * 0.5 && ny >= 0.46 && ny < 0.52;

  // Gold color (#fbbf24 to #f59e0b)
  if (inCrescent || inStar) {
    return [251, 191, 36, 255]; // Golden Amber
  }

  // Mosque silhouette: Soft warm white / gold tint
  if (inDome || inLeftMinaret || inRightMinaret || inLeftCone || inRightCone) {
    return [254, 243, 199, 240]; // Amber light
  }

  // Subtle decorative border inside icon
  if (!isMaskable && dist > 0.43 && dist < 0.45) {
    return [217, 119, 6, 120]; // Subtle gold ring
  }

  return [r, g, b, a];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate 192x192 PNG
const png192 = createPng(192, 192, (x, y, w, h) => renderIslamicIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
console.log('Created public/pwa-192x192.png');

// 2. Generate 512x512 PNG
const png512 = createPng(512, 512, (x, y, w, h) => renderIslamicIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
console.log('Created public/pwa-512x512.png');

// 3. Generate 512x512 Maskable PNG (full bleed background with 15% safe margin)
const pngMaskable512 = createPng(512, 512, (x, y, w, h) => renderIslamicIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable512);
console.log('Created public/pwa-maskable-512x512.png');

// 4. Generate 180x180 Apple Touch Icon PNG (required for iOS Safari)
const pngApple = createPng(180, 180, (x, y, w, h) => renderIslamicIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);
console.log('Created public/apple-touch-icon.png');
