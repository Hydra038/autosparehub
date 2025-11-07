"""
Generate PNG favicons from SVG
Requires: pip install cairosvg pillow
"""

try:
    import cairosvg
    from PIL import Image
    import io
    import os
    
    # Sizes to generate
    sizes = [
        (16, 'favicon-16x16.png'),
        (32, 'favicon-32x32.png'),
        (48, 'favicon-48x48.png'),
        (180, 'apple-touch-icon.png'),
    ]
    
    svg_path = 'public/favicon.svg'
    
    if not os.path.exists(svg_path):
        print(f"❌ Error: {svg_path} not found!")
        exit(1)
    
    print("🎨 Generating PNG favicons from SVG...\n")
    
    # Read SVG
    with open(svg_path, 'rb') as f:
        svg_data = f.read()
    
    # Generate each size
    for size, filename in sizes:
        output_path = f'public/{filename}'
        
        # Convert SVG to PNG at specific size
        png_data = cairosvg.svg2png(
            bytestring=svg_data,
            output_width=size,
            output_height=size
        )
        
        # Save PNG
        with open(output_path, 'wb') as f:
            f.write(png_data)
        
        print(f"✅ Created: {output_path} ({size}x{size})")
    
    # Create ICO file from 16x16 and 32x32
    print("\n🎨 Creating favicon.ico...")
    img16 = Image.open('public/favicon-16x16.png')
    img32 = Image.open('public/favicon-32x32.png')
    
    img32.save(
        'public/favicon.ico',
        format='ICO',
        sizes=[(16, 16), (32, 32)]
    )
    print("✅ Created: public/favicon.ico\n")
    
    print("✨ All favicons generated successfully!")
    print("\nFiles created:")
    print("  - favicon-16x16.png")
    print("  - favicon-32x32.png")
    print("  - favicon-48x48.png")
    print("  - apple-touch-icon.png")
    print("  - favicon.ico")
    print("\n📝 Next: Update your app/layout.tsx with the metadata")
    
except ImportError as e:
    print("❌ Missing dependencies!")
    print("\nInstall required packages:")
    print("  pip install cairosvg pillow")
    print("\nOr use the online tool: https://favicon.io/favicon-converter/")
    print("Upload public/favicon.svg and download the generated files.")
