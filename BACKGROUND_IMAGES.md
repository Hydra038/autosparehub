# 🖼️ Hero Background Images - Quick Reference

## Current Image
The homepage now uses a **bright, professional auto repair shop** background without blue overlay.

**Current URL**:
```
https://images.unsplash.com/photo-1632823470565-682d4e24fbb7?q=80&w=2000&auto=format&fit=crop
```

**Current styling**: Bright image with subtle dark overlay for text contrast (no color tint).

---

## Alternative Bright Images (Copy & Paste)

### 🔧 Bright Mechanic Workshop Images

#### Option 1: Bright Modern Workshop (Current)
```jsx
src="https://images.unsplash.com/photo-1632823470565-682d4e24fbb7?q=80&w=2000&auto=format&fit=crop"
```
Well-lit modern auto repair shop with cars and tools, very bright and professional.

#### Option 2: Clean Bright Garage
```jsx
src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=2000&auto=format&fit=crop"
```
Spacious, well-lit garage with hydraulic lifts, bright and clean.

#### Option 3: Bright Workshop with Natural Light
```jsx
src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2000&auto=format&fit=crop"
```
Workshop with large windows, natural lighting, bright and airy.

#### Option 4: Bright Mechanic Working
```jsx
src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2000&auto=format&fit=crop"
```
Close-up of mechanic's hands in bright lighting, professional and clear.

---

### 🚗 Car Images

#### Option 5: Engine Bay Close-up
```jsx
src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop"
```
Professional shot of clean engine bay, shows technical detail.

#### Option 6: Car on Lift
```jsx
src="https://images.unsplash.com/photo-1615906655593-ad0386982a0f?q=80&w=2000&auto=format&fit=crop"
```
Car elevated on hydraulic lift in modern garage.

#### Option 7: Classic Car Engine
```jsx
src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop"
```
Beautiful classic car engine, chrome details visible.

#### Option 8: Modern Sports Car
```jsx
src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop"
```
Sleek modern sports car, blue color, clean background.

---

### 🏭 Warehouse/Parts Images

#### Option 9: Parts Warehouse
```jsx
src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2000&auto=format&fit=crop"
```
Large automotive parts warehouse with organized shelves.

#### Option 10: Brake Discs Close-up
```jsx
src="https://images.unsplash.com/photo-1625047508968-236e84618d6d?q=80&w=2000&auto=format&fit=crop"
```
Professional shot of brake discs, shows product quality.

---

## How to Change Background

### Step 1: Open the File
```powershell
code app/page.tsx
```

### Step 2: Find the Image Component (around line 56)
Look for:
```jsx
<Image
  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3..."
  alt="Auto mechanic workshop"
  fill
  className="object-cover opacity-40"
  priority
/>
```

### Step 3: Replace the URL
Copy one of the URLs above and replace the `src` value.

### Step 4: Update the Alt Text (Optional)
Change `alt="Auto mechanic workshop"` to match your new image.

### Step 5: Save and Refresh
The page will auto-reload with the new background!

---

## Customization Options

### Adjust Image Brightness
In `app/page.tsx`, find:
```jsx
className="object-cover brightness-75"
```

Change brightness values (0-200):
- `brightness-50` - Darker image (50%)
- `brightness-75` - **Current setting** (slightly dimmed)
- `brightness-90` - Almost full brightness
- `brightness-100` - Full brightness (default)
- `brightness-110` - Slightly brighter
- `brightness-125` - Much brighter

### Adjust Overlay Color & Darkness
Find the gradient overlay:
```jsx
<div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
```

**Current**: Black overlay with no color tint (clean, neutral look)

Try different overlays:
- `from-black/40 to-black/20` - Lighter overlay (more image visible)
- `from-black/50 to-black/30` - **Current setting** (balanced)
- `from-black/60 to-black/40` - Darker overlay (better text contrast)
- `from-gray-900/50 to-gray-800/30` - Dark gray (softer than black)
- `from-slate-900/50 to-slate-800/30` - Slate (professional)

**Remove overlay completely**:
```jsx
<div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
```
Or just delete the entire overlay div!

### Add Back Blue Tint (if desired)
```jsx
<div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-800/30" />
```

---

## Using Your Own Images

### Option 1: Upload to Supabase Storage
1. Upload image to `product-images` bucket in Supabase
2. Get public URL
3. Use in `src` attribute

### Option 2: Place in Public Folder
1. Create `/public/images/` folder
2. Add your image: `hero-bg.jpg`
3. Use: `src="/images/hero-bg.jpg"`
4. Remove `fill` prop, add `width` and `height`

---

## Image Best Practices

### Recommended Specifications
- **Resolution**: 2000px wide minimum
- **Format**: JPG (for photos)
- **File Size**: Under 500KB for fast loading
- **Aspect Ratio**: 16:9 or wider (panoramic)
- **Subject**: Slightly blurred background works best
- **Contrast**: Darker images work better with white text

### SEO Tips
- Always include descriptive `alt` text
- Use `priority` prop for hero images (faster loading)
- Consider WebP format for better compression
- Lazy load images below the fold

---

## Testing Different Images

Quick test workflow:
1. Pick an image URL from this list
2. Open `app/page.tsx`
3. Replace the `src` URL
4. Save file
5. Page auto-refreshes
6. If you like it, keep it!
7. If not, try another

**Pro Tip**: Keep a few URLs in comments in your code so you can quickly swap:

```jsx
{/* Alternative backgrounds:
  Mechanic hands: https://images.unsplash.com/photo-1619642751034-765dfdf7c58e
  Engine bay: https://images.unsplash.com/photo-1492144534655-ae79c964c9d7
  Workshop: https://images.unsplash.com/photo-1625047509248-ec889cbff17f
*/}
<Image
  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3..."
  ...
/>
```

---

## Current Configuration

✅ **Unsplash images enabled** in `next.config.js`  
✅ **Hero background added** to homepage  
✅ **Professional overlay** with gradient  
✅ **Optimized loading** with Next.js Image  
✅ **Responsive design** works on mobile  

**File modified**: `app/page.tsx` (line ~50-65)  
**Config updated**: `next.config.js`  

---

## Credits

All images from [Unsplash](https://unsplash.com) - free to use for commercial projects.

Photographers:
- Mehanic workshop: @thisisengineering
- Car images: Various professional automotive photographers
- All images licensed under Unsplash License (free for commercial use)

---

**Need help?** Just swap the URL and refresh the page! 🎨
