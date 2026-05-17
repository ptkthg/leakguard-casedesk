// Generate a minimal valid 256x256 purple PNG icon for Electron
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

function createPNG(size) {
  // PNG signature
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])

  // IHDR chunk
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)     // width
  ihdrData.writeUInt32BE(size, 4)     // height
  ihdrData[8] = 8                      // bit depth
  ihdrData[9] = 2                      // color type: RGB
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0
  const ihdr = makeChunk('IHDR', ihdrData)

  // Build raw pixel data (size x size RGB pixels)
  // Background: #08080E, accent circle: #7C3AED
  const rawRows = []
  const cx = size / 2, cy = size / 2, r = size * 0.38

  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3)
    row[0] = 0 // filter type: None
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      let r_c, g_c, b_c
      if (dist < r) {
        // Purple circle
        r_c = 0x7C; g_c = 0x3A; b_c = 0xED
        // Inner lighter area
        if (dist < r * 0.6) { r_c = 0x13; g_c = 0x13; b_c = 0x1F }
        // Lock body rect
        const lx = Math.abs(x - cx), ly = y - cy
        if (lx < size * 0.12 && ly > size * 0.02 && ly < size * 0.2) {
          r_c = 0x7C; g_c = 0x3A; b_c = 0xED
        }
        // Shackle arc
        if (ly < size * 0.02 && ly > -size * 0.1 && lx > size * 0.04 && lx < size * 0.14) {
          r_c = 0xA7; g_c = 0x8B; b_c = 0xFA
        }
      } else {
        r_c = 0x08; g_c = 0x08; b_c = 0x0E
      }
      row[1 + x * 3] = r_c
      row[2 + x * 3] = g_c
      row[3 + x * 3] = b_c
    }
    rawRows.push(row)
  }
  const raw = Buffer.concat(rawRows)
  const compressed = zlib.deflateSync(raw)
  const idat = makeChunk('IDAT', compressed)
  const iend = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, ihdr, idat, iend])
}

function crc32(buf) {
  let crc = 0xFFFFFFFF
  const table = makeCRCTable()
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF]
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function makeCRCTable() {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }
  return table
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeB = Buffer.from(type)
  const crcInput = Buffer.concat([typeB, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(crcInput))
  return Buffer.concat([len, typeB, data, crc])
}

const outDir = path.join(__dirname)
fs.writeFileSync(path.join(outDir, 'icon.png'), createPNG(256))
console.log('icon.png created (256x256)')
