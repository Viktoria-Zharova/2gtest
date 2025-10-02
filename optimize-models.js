const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ModelOptimizer {
    constructor() {
        this.modelsPath = './src/assets/models';
    }

    // Получаем все .glb файлы в папке
    getAllGLBFiles() {
        try {
            const files = fs.readdirSync(this.modelsPath);
            const glbFiles = files.filter(file => file.endsWith('.glb'));
            console.log(`Найдено .glb файлов: ${glbFiles.length}`);
            return glbFiles;
        } catch (error) {
            console.error('Ошибка чтения папки с моделями:', error.message);
            return [];
        }
    }

    // Проверяем, установлен ли gltf-transform
    checkGltfTransform() {
        try {
            const version = execSync('gltf-transform --version', { encoding: 'utf8' }).trim();
            console.log(`gltf-transform установлен: ${version}`);
            return true;
        } catch (error) {
            console.error('gltf-transform не установлен');
            console.log('Установите: npm install -g @gltf-transform/cli');
            return false;
        }
    }

    // Оптимизируем одну модель
    optimizeModel(inputFile) {
        const inputPath = path.join(this.modelsPath, inputFile);
        
        // Создаем временный файл
        const tempOutputFile = `temp_${inputFile}`;
        const tempOutputPath = path.join(this.modelsPath, tempOutputFile);

        try {
            console.log(`[${inputFile}] Оптимизация...`);
            
            // Все дефолтные оптимизации, но без meshopt
            console.log('   Применяем все дефолтные оптимизации (кроме meshopt)...');
            const optimizeCommand = `gltf-transform optimize "${inputPath}" "${tempOutputPath}" --texture-compress webp --compress draco`;
            execSync(optimizeCommand, { stdio: 'inherit' });
            
            // Получаем размеры файлов для сравнения
            const originalSize = fs.statSync(inputPath).size;
            const optimizedSize = fs.statSync(tempOutputPath).size;
            const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
            
            // Заменяем оригинальный файл оптимизированным
            fs.unlinkSync(inputPath);
            fs.renameSync(tempOutputPath, inputPath);
            
            console.log(`[${inputFile}] Успешно: ${(originalSize/1024/1024).toFixed(2)}MB → ${(optimizedSize/1024/1024).toFixed(2)}MB (${reduction}% меньше)`);
            return true;
            
        } catch (error) {
            console.error(`[${inputFile}] Ошибка:`, error.message);
            
            // Очистка временного файла
            if (fs.existsSync(tempOutputPath)) {
                fs.unlinkSync(tempOutputPath);
            }
            return false;
        }
    }

    // Основной метод запуска оптимизации
    run() {
        console.log('ЗАПУСК ПОЛНОЙ ДЕФОЛТНОЙ ОПТИМИЗАЦИИ');
        console.log('======================================');
        
        // Проверяем установку gltf-transform
        if (!this.checkGltfTransform()) {
            process.exit(1);
        }

        // Получаем все модели
        const modelFiles = this.getAllGLBFiles();
        
        if (modelFiles.length === 0) {
            console.log('Модели не найдены в папке:', this.modelsPath);
            return;
        }

        console.log('Используем все дефолтные оптимизации gltf-transform:');
        console.log('- Базовые: join, weld, prune, dedup, instance, palette');
        console.log('- WebP сжатие текстур');
        console.log('- Draco сжатие (вместо meshopt)');
        console.log('- Другие дефолтные оптимизации');
        console.log('Начинаем оптимизацию...');

        let successCount = 0;
        let errorCount = 0;

        // Оптимизируем каждую модель
        modelFiles.forEach((file, index) => {
            console.log(`[${index + 1}/${modelFiles.length}]`);
            if (this.optimizeModel(file)) {
                successCount++;
            } else {
                errorCount++;
            }
        });

        // Итоги
        console.log('ДЕФОЛТНАЯ ОПТИМИЗАЦИЯ ЗАВЕРШЕНА');
        console.log('==================================');
        console.log(`Успешно: ${successCount} моделей`);
        console.log(`Ошибки: ${errorCount} моделей`);
        console.log(`Всего: ${modelFiles.length} моделей`);
        
        if (errorCount > 0) {
            console.log('Запустите скрипт снова для моделей с ошибками');
        } else {
            console.log('Все модели оптимизированы с максимальным качеством');
            console.log('Готово для 2GIS');
        }
    }
}

// Запускаем оптимизацию
const optimizer = new ModelOptimizer();
optimizer.run();