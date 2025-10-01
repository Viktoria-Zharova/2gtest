const fs = require('fs');
const path = require('path');

console.log('🔍 ПРОВЕРКА МОДЕЛЕЙ...');

// Проверяем разные папки с моделями
const folders = [
  'src/assets/models',
  'src/assets/models_optimized', 
  'src/assets/models_draco',
  'src/assets/models_draco_fixed'
];

folders.forEach(folder => {
  if (fs.existsSync(folder)) {
    const files = fs.readdirSync(folder).filter(f => f.endsWith('.glb'));
    console.log(`📁 ${folder}: ${files.length} моделей`);
    if (files.length > 0) {
      const sampleFile = path.join(folder, files[0]);
      const stats = fs.statSync(sampleFile);
      console.log(`   Пример: ${files[0]} - ${(stats.size/1024/1024).toFixed(2)} MB`);
    }
  } else {
    console.log(`❌ ${folder} - папка не существует`);
  }
});

console.log('\n💡 РЕКОМЕНДАЦИИ:');
console.log('1. Найдите папку с НЕСЖАТЫМИ моделями (обычно 7-10 MB каждая)');
console.log('2. Используйте ТЕ модели для Draco-сжатия');
console.log('3. Текущие модели в models_draco уже сжаты или повреждены');