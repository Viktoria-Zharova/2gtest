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

  const baseUrl = 'assets/models/';
  const curtain = document.getElementById('curtain');
  const loadingStatus = document.getElementById('loadingStatus');
  
  // === МОНИТОРИНГ ДЛЯ 2GIS ===
  console.log('=== СИСТЕМНЫЙ МОНИТОРИГ 2GIS АКТИВИРОВАН ===');

  const monitoringStartTime = performance.now();
  let modelsReported = false;
  let glbLoadCount = 0;
  const totalExpectedGLBs = 48 * 3; // 48 домов × 3 модели каждый

  let loadedModelsCount = 0;
  const totalModels = 48;

  // Безопасное обновление статуса
  function updateLoadingStatus(text) {
    if (loadingStatus) {
      loadingStatus.textContent = text;
    }
    console.log(text);
  }

  // Безопасное обновление прогресса
  function updateLoadingProgress() {
    loadedModelsCount++;
    const progress = Math.round((loadedModelsCount / totalModels) * 100);
    updateLoadingStatus(`Загружено моделей: ${loadedModelsCount}/${totalModels} (${progress}%)`);
    
    if (loadedModelsCount >= totalModels) {
      updateLoadingStatus('Все модели загружены!');
      setTimeout(() => {
        if (loadingStatus) {
          loadingStatus.style.display = 'none';
        }
      }, 3000);
    }
  }

  // Мониторинг загрузки ресурсов
  function checkResourceLoading() {
    const resources = performance.getEntriesByType('resource');
    const glbResources = resources.filter(resource => 
      resource.name.includes('.glb')
    );
    
    if (glbResources.length > glbLoadCount) {
      glbLoadCount = glbResources.length;
      console.log(`Загружено GLB файлов: ${glbLoadCount}`);
      
      glbResources.slice(-5).forEach(resource => {
        const sizeMB = (resource.transferSize / 1024 / 1024).toFixed(2);
        console.log(`   ${resource.name.split('/').pop()} (${sizeMB}MB, ${Math.round(resource.duration)}ms)`);
      });
    }
    
    if (glbLoadCount >= totalExpectedGLBs && !modelsReported) {
      modelsReported = true;
      const totalLoadTime = performance.now() - monitoringStartTime;
      console.log(`✅ ВСЕ МОДЕЛИ ЗАГРУЖЕНЫ`);
      console.log(`Общее время: ${Math.round(totalLoadTime)}ms`);
    }
  }

  // Мониторинг FPS
  let frameCount = 0;
  let lastFPSTime = performance.now();
  function monitorFPS() {
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastFPSTime >= 3000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastFPSTime));
      let fpsStatus = fps >= 30 ? 'ХОРОШО' : fps >= 20 ? 'НОРМА' : 'ПЛОХО';
      console.log(`FPS: ${fps} [${fpsStatus}]`);
      frameCount = 0;
      lastFPSTime = currentTime;
    }
    requestAnimationFrame(monitorFPS);
  }

  // Мониторинг памяти
  function monitorMemory() {
    if (performance.memory) {
      const mem = performance.memory;
      const usedMB = Math.round(mem.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(mem.totalJSHeapSize / 1024 / 1024);
      const percentage = Math.round(usedMB/totalMB*100);
      let memoryStatus = percentage > 80 ? 'ВЫСОКАЯ' : percentage > 60 ? 'ПОВЫШЕННАЯ' : 'НОРМА';
      console.log(`Память: ${usedMB}MB / ${totalMB}MB (${percentage}%) [${memoryStatus}]`);
    }
  }

  // Запуск мониторинга
  console.log('Запуск мониторинга 2GIS');
  console.log(`Ожидаем загрузки ~${totalExpectedGLBs} GLB файлов`);
  setInterval(checkResourceLoading, 2000);
  setInterval(monitorMemory, 5000);
  monitorFPS();

  // Инициализация плагина
  const plugin = new GltfPlugin(map, {
    modelsLoadStrategy: 'dontWaitAll',
    modelsBaseUrl: baseUrl,
    ambientLight: { color: '#ffffff', intencity: 3 },
    poiConfig: {
      primary: { fontSize: 14 },
      secondary: { fontSize: 14 },
    },
    hoverHighlight: { intencity: 0.1 },
  });

  console.log('Стратегия загрузки моделей: dontWaitAll - модели появляются по мере загрузки');

  // Скрываем занавес быстро
  setTimeout(() => {
    if (curtain) {
      curtain.style.display = 'none';
    }
    console.log('Интерфейс разблокирован, модели загружаются в фоне');
  }, 1000);

  // === РЕШЕНИЕ ПРОБЛЕМЫ MESHOPT ===
  async function setupMeshoptDecoder() {
    try {
      const { MeshoptDecoder } = await import('meshoptimizer');
      await MeshoptDecoder.ready;
      console.log('✅ MeshoptDecoder загружен');
    } catch (error) {
      console.warn('⚠️ MeshoptDecoder не загружен, модели могут не отображаться:', error);
    }
  }

  const lon = 37.38348;
  const lat = 55.808431;

  // --- Координаты для 48 РАЗНЫХ домов ---
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

  // --- СОЗДАЕМ СЦЕНУ С 48 РАЗНЫМИ ДОМАМИ ---
  const realtyScene = [];

  // Главный дом (индекс 0)
  realtyScene.push({
    modelId: 'main_building',
    coordinates: [lon, lat],
    rotateX: 90,
    rotateY: 253,
    scale: 172,
    modelUrl: 'House_Low_Full.glb',
    floors: [
      {
        id: '8',
        text: '4-24',
        modelUrl: 'House_Low_8fl.glb',
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
        modelUrl: 'House_Low_2fl.glb',
        mapOptions: {
          center: [lon, lat],
          pitch: 0.001,
          zoom: 20,
          rotation: -5,
        }
      }
    ]
  });

  // 47 дополнительных РАЗНЫХ домов (индексы 1-47)
  for (let i = 0; i < allCoords.length; i++) {
    const coords = allCoords[i];
    const houseNumber = i + 1;
    
    realtyScene.push({
      modelId: `building_${houseNumber}`,
      coordinates: coords,
      rotateX: 90,
      rotateY: 253,
      scale: 172,
      modelUrl: `House_Low_Full_${houseNumber}.glb`,
      floors: [
        {
          id: '2',
          text: '1-3',
          modelUrl: `House_Low_2fl_${houseNumber}.glb`,
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
          modelUrl: `House_Low_8fl_${houseNumber}.glb`,
          mapOptions: {
            center: coords,
            pitch: 0.001,
            zoom: 19.5,
            rotation: -5,
          },
        }
      ]
    });
  }

  console.log(`Создано сцен: ${realtyScene.length}`);
  console.log(`Ожидаем загрузки ${realtyScene.length * 3} моделей (основа + 2 этажа)`);
  
  if (loadingStatus) {
    loadingStatus.textContent = `Начинаем загрузку ${realtyScene.length} моделей...`;
  }

  // Загружаем декодер и добавляем сцену
  setupMeshoptDecoder().then(() => {
    console.log('Добавляем сцену в плагин...');
    
    // --- ЗАГРУЖАЕМ ВСЕ РАЗНЫЕ МОДЕЛИ ---
    plugin.addRealtyScene(realtyScene).then(() => {
      console.log('✅ Все РАЗНЫЕ модели загружены');
      console.log(`Итого загружено: ${realtyScene.length} уникальных домов`);
    }).catch((error) => {
      console.error('❌ Ошибка загрузки моделей:', error);
    });

    // Мониторинг загрузки моделей
    const checkProgress = setInterval(() => {
      try {
        const resources = performance.getEntriesByType('resource');
        const glbLoaded = resources.filter(r => 
          r.name.includes('.glb') && r.duration > 0
        ).length;
        
        if (glbLoaded > loadedModelsCount) {
          loadedModelsCount = glbLoaded;
          updateLoadingProgress();
        }
        
        if (loadedModelsCount >= totalModels) {
          clearInterval(checkProgress);
        }
      } catch (error) {
        console.log('Мониторинг загрузки:', loadedModelsCount);
      }
    }, 1000);
  });

});