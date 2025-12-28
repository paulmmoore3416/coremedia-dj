const sharp = require('sharp');
const fs = require('fs');

async function convertSVGtoPNG() {
    try {
        const svgBuffer = fs.readFileSync('assets/icon.svg');

        await sharp(svgBuffer)
            .resize(512, 512)
            .png()
            .toFile('assets/icon.png');

        console.log('Icon converted successfully!');
    } catch (error) {
        console.error('Error converting icon:', error);
        process.exit(1);
    }
}

convertSVGtoPNG();
