import sharp from 'sharp';
import fs from 'fs';

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

const svgPath = 'public/favicon.svg';

async function generateFavicons() {
  console.log('🎨 Generating PNG favicons from SVG...\n');

  for (const { size, name } of sizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(`public/${name}`);
      
      console.log(`✅ Created: public/${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error creating ${name}:`, error.message);
    }
  }

  // Create ICO (using 32x32 PNG)
  try {
    await sharp('public/favicon-32x32.png')
      .toFile('public/favicon.ico');
    console.log('\n✅ Created: public/favicon.ico');
  } catch (error) {
    console.error('❌ Error creating favicon.ico:', error.message);
  }

  console.log('\n✨ All favicons generated successfully!');
}

generateFavicons();
