import { load } from '@2gis/mapgl';
import { GltfPlugin } from '@2gis/mapgl-gltf';
import './assets/style.css';

load().then((mapglAPI) => {
  const map = new mapglAPI.Map('container', {
    center: [37.383849, 55.808361],
    zoom: 18.25,
    key: '7f9168cc-7f41-4862-ac0e-475d7c33b869',
    pitch: 53,
    rotation: 123,
    enableTrackResize: true,
    maxZoom: 21,
  });

  // Исправляем ссылки на существующие low-poly модели
  let models = {
    environment: 'House_Low_Env.glb',
    building: 'House_Low_Full.glb',
    floor2: 'House_Low_2fl.glb',
    floor8: 'House_Low_8fl.glb',
  };
  
let baseUrl = 'assets/models_draco/'; // ← правильный путь
  const container = document.getElementById('container');
  const isLowPoly = container.getAttribute('data-low-poly') === 'true';

  if (isLowPoly) {
  baseUrl = 'assets/models_draco/';
    models = {
      environment: 'House_Low_Env.glb',
      building: 'House_Low_Full.glb',
      floor2: 'House_Low_2fl.glb',
      floor8: 'House_Low_8fl.glb',
    };
  } else {
  baseUrl = 'assets/models_draco/';
    models = {
      environment: 'House_Low_Env.glb',
      building: 'House_Low_Full.glb',
      floor2: 'House_Low_2fl.glb',
      floor8: 'House_Low_8fl.glb',
    };
  }

  const needPreload = new URL(location.href).searchParams.has('preload');
  const curtain = document.getElementById('curtain');
  curtain.style.display = 'block';

  const plugin = new GltfPlugin(map, {
    modelsLoadStrategy: needPreload ? 'waitAll' : 'dontWaitAll',
    ambientLight: { color: '#ffffff', intencity: 3 },
    modelsBaseUrl: baseUrl,
    poiConfig: {
      primary: {
        fontSize: 14,
      },
      secondary: {
        fontSize: 14,
      },
    },
    hoverHighlight: {
      intencity: 0.1,
    },
  });

// === МОНИТОРИНГ ДЛЯ 2GIS ===
console.log('=== СИСТЕМНЫЙ МОНИТОРИГ 2GIS АКТИВИРОВАН ===');

const monitoringStartTime = performance.now();
let modelsReported = false;

// 1. Мониторинг загрузки GLB файлов
let glbLoadCount = 0;
const totalExpectedGLBs = 48 * 3; // 48 домов × 3 модели каждый

// 2. Проверка загрузки ресурсов
function checkResourceLoading() {
  const resources = performance.getEntriesByType('resource');
  const glbResources = resources.filter(resource => 
    resource.name.includes('.glb')
  );
  
  if (glbResources.length > glbLoadCount) {
    glbLoadCount = glbResources.length;
    console.log(`Загружено GLB файлов: ${glbLoadCount}`);
    
    // Информация о файлах
    glbResources.slice(-5).forEach(resource => {
      const sizeMB = (resource.transferSize / 1024 / 1024).toFixed(2);
      console.log(`   ${resource.name.split('/').pop()} (${sizeMB}MB, ${Math.round(resource.duration)}ms)`);
    });
  }
  
  if (glbLoadCount >= totalExpectedGLBs && !modelsReported) {
    modelsReported = true;
    const totalLoadTime = performance.now() - monitoringStartTime;
    console.log(`ВСЕ МОДЕЛИ ЗАГРУЖЕНЫ`);
    console.log(`Общее время: ${Math.round(totalLoadTime)}ms`);
    console.log(`GLB файлов: ${glbLoadCount}`);
  }
}

// 3. Мониторинг FPS
let frameCount = 0;
let lastFPSTime = performance.now();

function monitorFPS() {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime - lastFPSTime >= 3000) {
    const fps = Math.round((frameCount * 1000) / (currentTime - lastFPSTime));
    
    let fpsStatus = 'ХОРОШО';
    if (fps < 20) fpsStatus = 'НОРМА';
    if (fps < 10) fpsStatus = 'ПЛОХО';
    
    console.log(`FPS: ${fps} [${fpsStatus}]`);
    
    frameCount = 0;
    lastFPSTime = currentTime;
  }
  requestAnimationFrame(monitorFPS);
}

// 4. Мониторинг памяти
function monitorMemory() {
  if (performance.memory) {
    const mem = performance.memory;
    const usedMB = Math.round(mem.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(mem.totalJSHeapSize / 1024 / 1024);
    const percentage = Math.round(usedMB/totalMB*100);
    
    let memoryStatus = 'НОРМА';
    if (percentage > 80) memoryStatus = 'ВЫСОКАЯ';
    else if (percentage > 60) memoryStatus = 'ПОВЫШЕННАЯ';
    
    console.log(`Память: ${usedMB}MB / ${totalMB}MB (${percentage}%) [${memoryStatus}]`);
  }
}

// 5. Проверка canvas
function checkVisibleModels() {
  const mapContainer = document.getElementById('container');
  const canvas = mapContainer?.querySelector('canvas');
  
  if (canvas) {
    console.log(`Canvas: ${canvas.width}x${canvas.height}`);
  }
}

// Запуск мониторинга
console.log('Запуск мониторинга 2GIS');
console.log(`Ожидаем загрузки ~${totalExpectedGLBs} GLB файлов`);

// Интервалы мониторинга
setInterval(checkResourceLoading, 2000);
setInterval(monitorMemory, 5000);
setInterval(checkVisibleModels, 10000);
monitorFPS();

// Финальная проверка
setTimeout(() => {
  if (!modelsReported) {
    console.log('Предупреждение: через 30 секунд модели могут быть не полностью загружены');
    console.log(`Текущий счетчик GLB: ${glbLoadCount}`);
  }
}, 30000);




  const lon = 37.38348;
  const lat = 55.808431;

  // Оставляем исходную сцену (только building без environment)
  const realtyScene = [
    {
      modelId: 'building',
      coordinates: [lon, lat],
      rotateX: 90,
      rotateY: 253,
      scale: 172,
      modelUrl: models.building,
      floors: [
        {
          id: '8',
          text: '4-24',
          modelUrl: models.floor8,
          mapOptions: {
            center: [lon, lat],
            pitch: 0.001,
            zoom: 19.5,
            rotation: -5,
          }
        },
        {
          id: '2',
          text: '1-3',
          modelUrl: models.floor2,
          mapOptions: {
            center: [lon, lat],
            pitch: 0.001,
            zoom: 20,
            rotation: -5,
          }
        }
      ]
    }
  ];

  plugin.addRealtyScene(realtyScene);

  // --- Добавляем 47 копий дома ---
  const cluster1 = [
    [37.620393, 55.75396], [37.621393, 55.75396], [37.622393, 55.75396], [37.623393, 55.75396], [37.624393, 55.75396],
    [37.625393, 55.75396], [37.626393, 55.75396], [37.627393, 55.75396], [37.628393, 55.75396], [37.629393, 55.75396]
  ];
  const cluster2 = [
    [37.540393, 55.70096], [37.541393, 55.70096], [37.542393, 55.70096], [37.543393, 55.70096],
    [37.544393, 55.70096], [37.545393, 55.70096], [37.546393, 55.70096]
  ];
  const cluster3 = [
    [37.680393, 55.80096], [37.681393, 55.80096], [37.682393, 55.80096], [37.683393, 55.80096]
  ];
  const cluster4 = [
    [37.500393, 55.85096], [37.501393, 55.85096]
  ];
  const singleHouses = [
    [37.700393, 55.76096], [37.710393, 55.77096], [37.720393, 55.78096], [37.730393, 55.79096],
    [37.740393, 55.80096], [37.750393, 55.81096], [37.760393, 55.82096], [37.770393, 55.83096],
    [37.780393, 55.84096], [37.790393, 55.85096], [37.800393, 55.86096], [37.810393, 55.87096],
    [37.820393, 55.88096], [37.830393, 55.89096], [37.840393, 55.90096], [37.850393, 55.91096],
    [37.860393, 55.92096], [37.870393, 55.93096], [37.880393, 55.94096], [37.890393, 55.95096],
    [37.900393, 55.96096], [37.910393, 55.97096], [37.920393, 55.98096], [37.930393, 55.99096]
  ];
  
  const allCoords = [...cluster1, ...cluster2, ...cluster3, ...cluster4, ...singleHouses];

  // Для каждого дома создаём только building без environment
  for (let i = 0; i < allCoords.length; i++) {
    const coords = allCoords[i];
    const houseScene = [
      {
        modelId: `building_copy_${i+1}`,
        coordinates: coords,
        rotateX: 90,
        rotateY: 253,
        scale: 172,
        modelUrl: `House_Low_Full_${i+1}.glb`,
        floors: [
          {
            id: '2',
            text: '1-3',
            modelUrl: `House_Low_2fl_${i+1}.glb`,
            mapOptions: {
              center: coords,
              pitch: 0.001,
              zoom: 20,
              rotation: -5,
            },
          },
          {
            id: '8',
            text: '4-24',
            modelUrl: `House_Low_8fl_${i+1}.glb`,
            mapOptions: {
              center: coords,
              pitch: 0.001,
              zoom: 19.5,
              rotation: -5,
            },
          }
        ]
      }
    ];
    plugin.addRealtyScene(houseScene);
  }

  curtain.style.display = 'none';
});