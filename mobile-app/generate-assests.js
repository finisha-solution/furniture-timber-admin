# Create the generate-assets.js file
cat > generate-assets.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Simple 1x1 pixel PNG base64 (a tiny blue square)
const placeholderPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// Create assets folder if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Write placeholder images
const files = ['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'];
for (const file of files) {
  const filePath = path.join(assetsDir, file);
  fs.writeFileSync(filePath, Buffer.from(placeholderPNG, 'base64'));
  console.log(`Created: ${file}`);
}

console.log('✅ All placeholder images created!');
console.log('ℹ️  Replace these with your actual app icons later.');
EOF