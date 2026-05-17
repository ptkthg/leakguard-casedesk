// Generate public/logo.png (512x512) for portfolio/GitHub
const fs = require('fs'), path = require('path'), zlib = require('zlib')

function crc32(buf) {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF]
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const tb = Buffer.from(type)
  const cb = Buffer.alloc(4); cb.writeUInt32BE(crc32(Buffer.concat([tb, data])))
  return Buffer.concat([len, tb, data, cb])
}

function makePNG(size) {
  const sig = Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])
  const ihdrD = Buffer.alloc(13)
  ihdrD.writeUInt32BE(size, 0); ihdrD.writeUInt32BE(size, 4)
  ihdrD[8] = 8; ihdrD[9] = 2

  const rows = []
  const cx = size / 2, cy = size / 2

  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3); row[0] = 0
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx*dx + dy*dy)
      const r2 = size * 0.46, r1 = size * 0.42

      // Rounded square background
      const rx = Math.abs(x - cx) / (size * 0.44)
      const ry = Math.abs(y - cy) / (size * 0.44)
      const inBg = (rx ** 6 + ry ** 6) < 1

      let R = 0x08, G = 0x08, B = 0x0E

      if (inBg) {
        R = 0x0E; G = 0x0E; B = 0x18

        // Purple glow ring
        if (dist < r2 && dist > r1) { R = 0x7C; G = 0x3A; B = 0xED }

        // Shield body
        const sh = dist < r1 * 0.85 && y < cy + size * 0.3 && y > cy - size * 0.35
        if (sh) { R = 0x13; G = 0x13; B = 0x1F }

        // Lock body rect
        const lx2 = Math.abs(x - cx), ly2 = y - cy
        if (lx2 < size * 0.10 && ly2 > size * 0.04 && ly2 < size * 0.22) {
          R = 0x7C; G = 0x3A; B = 0xED
        }
        // Lock shackle
        if (lx2 > size * 0.05 && lx2 < size * 0.11 && ly2 > -size * 0.08 && ly2 < size * 0.04) {
          R = 0xA7; G = 0x8B; B = 0xFA
        }
        // Keyhole
        if (dist < size * 0.04 && ly2 > size * 0.07 && ly2 < size * 0.18) {
          R = 0x08; G = 0x08; B = 0x0E
        }
      }

      row[1 + x*3] = R; row[2 + x*3] = G; row[3 + x*3] = B
    }
    rows.push(row)
  }

  const idat = chunk('IDAT', zlib.deflateSync(Buffer.concat(rows)))
  return Buffer.concat([sig, chunk('IHDR', ihdrD), idat, chunk('IEND', Buffer.alloc(0))])
}

fs.writeFileSync(path.join(__dirname, '../public/logo.png'), makePNG(512))
console.log('public/logo.png created (512x512)')
