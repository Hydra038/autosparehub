# Favicon Setup Instructions

## Quick Setup (Recommended)

Use an online tool to convert the SVG to PNG:

1. Go to: https://favicon.io/favicon-converter/
2. Upload `public/favicon.svg`
3. Download the generated package
4. Extract these files to `public/`:
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `favicon.ico`
   - `apple-touch-icon.png`

## Alternative: Use ImageMagick (if installed)

```bash
# Convert SVG to different PNG sizes
magick public/favicon.svg -resize 16x16 public/favicon-16x16.png
magick public/favicon.svg -resize 32x32 public/favicon-32x32.png
magick public/favicon.svg -resize 48x48 public/favicon-48x48.png
magick public/favicon.svg -resize 180x180 public/apple-touch-icon.png

# Create ICO file (Windows)
magick public/favicon-16x16.png public/favicon-32x32.png public/favicon.ico
```

## Update Next.js Metadata

Add to your `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}
```

## Files Needed in `/public`

- ✅ `favicon.svg` (already created)
- ✅ `logo.svg` (already created)
- ⏳ `favicon-16x16.png` (need to create)
- ⏳ `favicon-32x32.png` (need to create)
- ⏳ `favicon-48x48.png` (optional, need to create)
- ⏳ `apple-touch-icon.png` (need to create)
- ⏳ `favicon.ico` (need to create)

## Current Status

✅ SVG favicon and logo created
⏳ PNG versions - Use favicon.io converter (easiest method)
