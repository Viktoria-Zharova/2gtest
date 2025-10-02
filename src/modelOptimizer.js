import { NodeIO } from '@gltf-transform/core';
import { 
    dedup, 
    instance, 
    palette, 
    flatten, 
    join, 
    weld, 
    simplify, 
    resample, 
    prune, 
    sparse, 
    textureCompress 
} from '@gltf-transform/functions';

export class ModelOptimizer {
    constructor() {
        this.io = new NodeIO();
    }

    async optimizeModel(inputBuffer, options = {}) {
        try {
            console.log('🔧 Начинаем оптимизацию модели...');
            
            // Загружаем модель из ArrayBuffer
            const document = await this.io.readBinary(new Uint8Array(inputBuffer));
            
            // Применяем все оптимизации
            await document.transform(
                dedup(),          // удаление дубликатов
                instance(),       // инстансинг
                palette(),        // палитра
                flatten(),        // выравнивание
                join(),           // объединение
                weld(),           // сварка вершин
                simplify({        // упрощение геометрии
                    ratio: 0.75,  // сохраняем 75% детализации
                    error: 0.001
                }),
                resample(),       // ресемплинг анимаций
                prune(),          // удаление неиспользуемых данных
                sparse(),         // разреженные атрибуты
                textureCompress({ // сжатие текстур
                    encoder: 'sharp',
                    targetFormat: 'webp',
                    quality: 0.8,
                    resize: [1024, 1024]
                })
            );

            console.log('✅ Оптимизация завершена');
            
            // Сохраняем оптимизированную модель
            const optimizedBuffer = await this.io.writeBinary(document);
            return optimizedBuffer;
            
        } catch (error) {
            console.error('❌ Ошибка оптимизации:', error);
            throw error;
        }
    }

    // Метод для измерения эффективности оптимизации
    measureOptimization(originalSize, optimizedSize) {
        const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        console.log(`📊 Сжатие: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(optimizedSize / 1024 / 1024).toFixed(2)}MB (${reduction}% уменьшение)`);
        return reduction;
    }
}