// Run on macOS: swift scripts/generate-favicon.swift
// Render the SVG source into a multi-resolution ICO; no website build step.
import AppKit

let root = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
guard let source = NSImage(contentsOf: root.appendingPathComponent("favicon.svg")) else {
    fatalError("Cannot read favicon.svg")
}

let sizes = [16, 32, 48, 64, 128, 256]
let images: [Data] = sizes.map { size in
    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true,
        isPlanar: false, colorSpaceName: .deviceRGB,
        bytesPerRow: size * 4, bitsPerPixel: 32
    ), let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
        fatalError("Cannot render favicon at \(size)px")
    }
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.imageInterpolation = .high
    source.draw(in: NSRect(x: 0, y: 0, width: size, height: size),
                from: .zero, operation: .copy, fraction: 1)
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()
    guard let png = bitmap.representation(using: .png, properties: [:]) else {
        fatalError("Cannot encode favicon at \(size)px")
    }
    return png
}

var ico = Data()
func appendLE<T: FixedWidthInteger>(_ value: T) {
    var littleEndian = value.littleEndian
    withUnsafeBytes(of: &littleEndian) { ico.append(contentsOf: $0) }
}

appendLE(UInt16(0))
appendLE(UInt16(1))
appendLE(UInt16(sizes.count))
var offset = 6 + sizes.count * 16
for (size, png) in zip(sizes, images) {
    ico.append(contentsOf: [UInt8(size == 256 ? 0 : size), UInt8(size == 256 ? 0 : size), 0, 0])
    appendLE(UInt16(1))
    appendLE(UInt16(32))
    appendLE(UInt32(png.count))
    appendLE(UInt32(offset))
    offset += png.count
}
for png in images { ico.append(png) }
try ico.write(to: root.appendingPathComponent("favicon.ico"))
print("Generated favicon.ico: \(sizes.map(String.init).joined(separator: ", "))px")
