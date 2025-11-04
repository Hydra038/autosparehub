# 🚗 Vehicle Background Images - Quick Reference

## Current Background
Professional automotive/mechanic workshop background from Pixabay (royalty-free CDN).

**Current URL**:
```
https://cdn.pixabay.com/photo/2016/11/18/17/46/automotive-1835365_1280.jpg
```

---

## How to Change Background

Open `app/page.tsx` (around line 53) and find:
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/18/17/46/automotive-1835365_1280.jpg)',
```

Replace the URL with any of these options:

---

## 🚗 Vehicle Background Options

### Option 1: Mechanic Workshop (Current)
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/18/17/46/automotive-1835365_1280.jpg)',
```
Professional mechanic working on a car - great for auto parts shop.

### Option 2: Car Dashboard Close-up
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/19/11/32/automotive-1838744_1280.jpg)',
```
Modern car interior with steering wheel - sleek and professional.

### Option 3: Sports Car - Red
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2012/11/02/13/02/car-63930_1280.jpg)',
```
Luxury red sports car - bold and eye-catching.

### Option 4: Modern Car on Road
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2015/05/15/14/22/conference-room-768441_1280.jpg)',
```
Clean modern vehicle on highway - professional look.

### Option 5: Engine Bay Close-up
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/22/23/51/auto-1851298_1280.jpg)',
```
Clean engine compartment - perfect for parts shop.

### Option 6: Classic Car
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2012/04/13/20/37/car-33556_1280.png)',
```
Vintage classic car - nostalgic automotive feel.

### Option 7: Car Garage/Workshop
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2020/10/07/16/46/auto-5635118_1280.jpg)',
```
Professional auto repair shop setting.

### Option 8: Sleek Black Sports Car
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/18/14/05/car-1834274_1280.jpg)',
```
Modern luxury sports car - premium feel.

### Option 9: Car Parts/Tools
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/29/12/13/auto-1868726_1280.jpg)',
```
Automotive tools and parts - directly relevant to your business.

### Option 10: Multiple Cars in Showroom
```jsx
backgroundImage: 'url(https://cdn.pixabay.com/photo/2018/02/07/14/29/dealership-3137704_1280.jpg)',
```
Car dealership/showroom - professional automotive setting.

---

## 🎨 Customize Image Brightness

In `app/page.tsx`, find:
```jsx
filter: 'brightness(0.6)'
```

Adjust the brightness value:
- `brightness(0.4)` - Darker (better text contrast)
- `brightness(0.6)` - **Current** (balanced)
- `brightness(0.8)` - Brighter (more image visible)
- `brightness(1.0)` - Full brightness

---

## 🎨 Customize Overlay

Find the overlay gradient:
```jsx
<div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
```

**Make it darker** (better for bright images):
```jsx
<div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
```

**Make it lighter** (for dark images):
```jsx
<div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10" />
```

**Add blue tint** (brand color):
```jsx
<div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-800/30" />
```

**Remove overlay completely**:
```jsx
<div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
```

---

## 🖼️ Use Your Own Image

### Option 1: Place in Public Folder
1. Create `/public/images/` folder in your project
2. Add your image: `hero-bg.jpg`
3. Update the code:
```jsx
backgroundImage: 'url(/images/hero-bg.jpg)',
```

### Option 2: Upload to Supabase Storage
1. Upload to `product-images` bucket
2. Get public URL
3. Use that URL in `backgroundImage`

---

## ⚡ Performance Tips

- **Optimize images**: Keep under 500KB for fast loading
- **Use JPG format**: Better for photos
- **Recommended size**: 1920x1080px or 2560x1440px
- **CDN hosted**: Pixabay images are on CDN (fast worldwide)

---

## 📱 Mobile Responsive

The background automatically adjusts for mobile devices using:
```jsx
className="bg-cover bg-center bg-no-repeat"
```

This ensures:
- ✅ Image covers full width
- ✅ Centered on all screen sizes
- ✅ No image repetition
- ✅ Maintains aspect ratio

---

## 🎯 Quick Test Workflow

1. Pick an image URL from this list
2. Open `app/page.tsx`
3. Find the `backgroundImage:` line (around line 55)
4. Replace the URL
5. Save file
6. Browser auto-refreshes
7. Adjust brightness/overlay if needed

---

## ✅ Current Setup

✅ **Vehicle background active**  
✅ **CDN hosted** (Pixabay - fast, reliable, free)  
✅ **No external dependencies** (pure CSS)  
✅ **Mobile responsive**  
✅ **Professional look**  

**File modified**: `app/page.tsx` (line ~50-70)

---

## 💡 Recommendations

**Best for Auto Parts Shop:**
- Mechanic workshop (Current) ⭐ **Recommended**
- Engine bay close-up
- Car parts/tools
- Garage setting

**Best for Modern/Premium Feel:**
- Sleek black sports car
- Modern car dashboard
- Luxury sports car

**Best for Classic/Traditional:**
- Classic vintage car
- Car showroom

---

## 🆘 Troubleshooting

### Image not loading?
✅ Check internet connection (images are CDN-hosted)  
✅ Try a different URL from the list  
✅ Clear browser cache: `Ctrl+Shift+R`

### Image too bright/dark?
✅ Adjust `brightness()` value (0.4 to 1.0)  
✅ Adjust overlay darkness (`black/40` to `black/70`)

### Text hard to read?
✅ Decrease brightness: `brightness(0.5)`  
✅ Add darker overlay: `from-black/60 to-black/40`

---

**Enjoy your professional automotive background! 🚗✨**
