const gltfPipeline = require('gltf-pipeline');
const fs = require('fs');
const path = require('path');

const inputDir = './src/assets/models_optimized';
const outputDir = './src/assets/models_draco';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.glb'));

console.log(`Начинаем сжатие ${files.length} моделей...`);

files.forEach((file, index) => {
    console.log(`Сжимаем ${index + 1}/${files.length}: ${file}`);
    
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    try {
        const glb = fs.readFileSync(inputPath);
        
        gltfPipeline.processGlb(glb, {
            draco: {
                compressionLevel: 7,
                quantizePosition: 14
            }
        }).then(result => {
            fs.writeFileSync(outputPath, result.glb);
            console.log(`✅ Сжали: ${file}`);
        });
        
    } catch (error) {
        console.log(`❌ Ошибка: ${file}`, error.message);
    }
});