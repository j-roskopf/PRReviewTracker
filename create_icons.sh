#!/bin/bash
# Create simple SVG icons and convert to PNG

# Create SVG icon
cat > icon.svg << 'SVGEOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#grad)"/>
  <!-- Large PRT text centered -->
  <text x="64" y="85" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle">PRT</text>
</svg>
SVGEOF

# Check if rsvg-convert is available (best for SVG gradients)
if command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w 16 -h 16 icon.svg -o icon16.png
    rsvg-convert -w 48 -h 48 icon.svg -o icon48.png
    rsvg-convert -w 128 -h 128 icon.svg -o icon128.png
    echo "Icons created successfully using rsvg-convert"
# Check if ImageMagick is available
elif command -v magick &> /dev/null; then
    magick -density 300 icon.svg -colorspace sRGB -resize 16x16 icon16.png
    magick -density 300 icon.svg -colorspace sRGB -resize 48x48 icon48.png
    magick -density 300 icon.svg -colorspace sRGB -resize 128x128 icon128.png
    echo "Icons created successfully using ImageMagick"
elif command -v convert &> /dev/null; then
    convert icon.svg -resize 16x16 icon16.png
    convert icon.svg -resize 48x48 icon48.png
    convert icon.svg -resize 128x128 icon128.png
    echo "Icons created successfully using ImageMagick (legacy convert)"
elif command -v sips &> /dev/null; then
    # Use macOS sips as fallback
    qlmanage -t -s 16 -o . icon.svg 2>/dev/null && mv icon.svg.png icon16.png
    qlmanage -t -s 48 -o . icon.svg 2>/dev/null && mv icon.svg.png icon48.png
    qlmanage -t -s 128 -o . icon.svg 2>/dev/null && mv icon.svg.png icon128.png
    echo "Icons created successfully using sips"
else
    echo "Warning: Neither ImageMagick nor sips available. Creating placeholder icons."
    # Create simple placeholder PNGs (1x1 pixel, will be stretched)
    printf '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90\x77\x53\xde\x00\x00\x00\x0c\x49\x44\x41\x54\x08\xd7\x63\xf8\xcf\xc0\x00\x00\x03\x01\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > icon16.png
    cp icon16.png icon48.png
    cp icon16.png icon128.png
fi
