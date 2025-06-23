const map = new mapgl.Map('container', {
  center: [37.383849, 55.808361],
  zoom: 18.25,
  key: '7f9168cc-7f41-4862-ac0e-475d7c33b869', // API key can be used on 2gis.github.io/mapgl-examples only!
  pitch: 53,
  rotation: 123,
  enableTrackResize: true,
  maxZoom: 21,
});

// map.on('click', (e) => {
//   console.log(e);
// });

const needPreload = new URL(location.href).searchParams.has('preload');
console.log(new URL(location.href), 'location', needPreload);
const curtain = document.getElementById('curtain');
curtain.style.display = 'block';

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

function waitIdle() {
  return new Promise((resolve) => {
    map.once('idle', resolve);
  });
}

function removeLabels() {
  if (map._impl.currentPendingStyle) {
    map.once('styleload', () => {
      labelIds.forEach((id) => {
        map.removeLayer(id);
      });
    });
    return;
  }

  labelIds.forEach((id) => {
    map.removeLayer(id);
  });
}

async function runScenario(scenario) {
  for (const part of scenario) {
    // console.log(part);
    const duration = part.duration || 0;
    if (part.zoom !== undefined) {
      const params = {
        duration,
        animateHeight: true,
      };
      if (part.zoomEasing) {
        params.easing = part.zoomEasing;
      }
      map.setZoom(part.zoom, params);
    }
    if (part.pitch !== undefined) {
      const params = {
        duration,
      };
      if (part.pitchEasing) {
        params.easing = part.pitchEasing;
      }
      map.setPitch(part.pitch, params);
    }
    if (part.snowIntensity !== undefined) {
      const intensity = part.snowIntensity;
      snow.setOptions({
        enabled: intensity > 0,
        particleNumber: intensity * 1000,
        velocityZ: 500 + intensity * 7,
        velocityX: intensity * 4,
        dispersion: intensity,
      });
    }
    if (part.center) {
      const params = {
        duration,
      };
      if (part.centerEasing) {
        params.easing = part.centerEasing;
      }
      map.setCenter(part.center, params);
    }
    if (part.rotation !== undefined) {
      const params = {
        duration,
      };
      if (part.rotationEasing) {
        params.easing = part.rotationEasing;
      }
      map.setRotation(part.rotation, { ...params, normalize: false });
    }

    if (typeof part.f === 'function') {
      part.f();
    }

    if (part.waitIdle) {
      await waitIdle();
    } else {
      await sleep(duration);
    }
  }
}

const plugin = new mapgl.GltfPlugin(map, {
  modelsLoadStrategy: needPreload ? 'waitAll' : 'dontWaitAll',
  ambientLight: { color: '#ffffff', intencity: 3 },
  // modelsBaseUrl: 'https://disk.2gis.com/digital-twin/models_s3/realty_ads/sakura/',
  modelsBaseUrl: 'https://getfloorplan-2-prod.s3.eu-central-1.amazonaws.com/app_storage_production/public/',
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

// const lon = 37.383849;
// const lat = 55.808361;

const lon = 37.38348;
const lat = 55.808431;

const realtyScene = [

  {
    modelId: 'environment',
    coordinates: [lon, lat],
    rotateX: 90,
    rotateY: 253,
    scale: 172,
    modelUrl: 'House_Environment.glb',
    linkedIds: ['70030076609150266'],
    mapOptions: {
      center: [lon, lat],
      pitch: 150,
      zoom: 88,
      rotation: 0
    }
  },
  {
    modelId: 'building',
    coordinates: [lon, lat],
    rotateX: 90,
    rotateY: 253,
    scale: 172,
    modelUrl: 'House_Full.glb',
    floors: [
      {
        id: '8',
        text: '4-24',
        modelUrl: 'House_8floor.glb',
        mapOptions: {
          center: [lon, lat],
          pitch: 0.001,
          zoom: 19.5,
          rotation: -5,
        },
        poiGroups: [
          {
            id: 1003,
            type: 'primary',
            minZoom: 18.5,
            elevation: 20,
            fontSize: 15,
            fontColor: '#3a3a3a',
            data: [
              {
                coordinates: [37.383675, 55.808440],
                label: '2Е\n42.94 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=13741977-8c48-49cb-bd5d-2603d84fa19a',
                },
              },
              {
                coordinates: [37.383570, 55.808457],
                label: '2Е\n40.82 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=ed4e9c6e-0031-47b3-bd69-aa838567ee78',
                },
              },
              {
                coordinates: [37.383800, 55.808414],
                label: '2Е\n35.57 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=508703e7-3bcd-4bfd-a8e8-639053d1a2d5',
                },
              },
              {
                coordinates: [37.383900, 55.808400],
                label: '3Е\n50.15 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=61a2e758-1fdf-4cdf-aa51-a5ff75fbd46c',
                },
              },
              {
                coordinates: [37.384030, 55.808375],
                label: '3Е\n0.88 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=d6580778-8d4f-4661-ac2f-9331d21080bd',
                },
              },
              {
                coordinates: [37.384030, 55.808327],
                label: '2Е\n40.81 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=9620cfd3-f991-4718-9e88-dc044ddad7e9',
                },
              },
              {
                coordinates: [37.383925, 55.808327],
                label: '2Е\n31.59 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=a4e22138-8e4a-4e6f-8922-4f32d04b8337',
                },
              },  
              {
                coordinates: [37.383855, 55.808337],
                label: '1С\n22.09 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=48b24648-c3cd-4a5a-addc-d2eb84f7a572',
                },
              }, 
              {
                coordinates: [37.383650, 55.808370],
                label: '1С\n21.72 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=080ca561-b0a4-4ef5-8b29-af670c1926b5',
                },
              },
              {
                coordinates: [37.383550, 55.808390],
                label: '3Е\n50.84 м²',
                userData: {
                  url: 'https://samolet-2.widget.floor-plan.online/beta/?id=1b9642e1-6972-4975-a331-2367b1834bae',
                },
              },
            ],
          },
        ],
      },
      {
        id: '2',
        text: '1-3',
        modelUrl: 'House_2floor.glb',
        mapOptions: {
          center: [lon, lat],
          pitch: 0.001,
          zoom: 20,
          rotation: -5,
        },
        poiGroups: [
          {
            id: 1003,
            type: 'primary',
            minZoom: 18.5,
            elevation: 1,
            fontSize: 10,
            fontColor: '#3a3a3a',
            data: [
              {
                coordinates: [37.383100, 55.808540],
                label: '121.41 м²\nТанцевальный зал / \nТренажерный зал',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503500',
                },
              },
              {
                coordinates: [37.382930, 55.808560],
                label: '25.3 м²\nОбщественный туалет',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503498',
                },
              },
              {
                coordinates: [37.383050, 55.808500],
                label: '131.38 м²\nКоридор',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503496',
                },
              },
              {
                coordinates: [37.383230, 55.808500],
                label: '3.73 м²\nКофеточка',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503497',
                },
              },
              {
                coordinates: [37.383675, 55.808440],
                label: '42.94 м²\nСалон красоты /\nМагазин кресел',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503501',
                },
              },
              {
                coordinates: [37.383570, 55.808457],
                label: '40.82 м²\nБарбершоп /\nБиблиотека',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503501',
                },
              },
              {
                coordinates: [37.383800, 55.808414],
                label: '35.57 м²\nРемонтная мастерская /\nМагазин одежды',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503507',
                },
              },
              {
                coordinates: [37.383965, 55.808390],
                label: '101.03 м²\nКомпьютерный клуб /\nМедклиника',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503504',
                },
              },
              {
                coordinates: [37.384030, 55.808327],
                label: '40.81 м²\nУчебный класс /\nДетский клуб',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503510',
                },
              },   
              {
                coordinates: [37.383925, 55.808327],
                label: '31.59 м²\nКабинет психолога /\nКофейня',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503503',
                },
              },  
              {
                coordinates: [37.383855, 55.808337],
                label: '22.09 м²\nWildberries /\nСДЭК',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503502',
                },
              }, 
              {
                coordinates: [37.383740, 55.808370],
                label: '80.8 м²\nКоридор',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503505',
                },
              },
              {
                coordinates: [37.383650, 55.808370],
                label: '21.72 м²\nOzon /\nЯндекс Маркет',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503506',
                },
              },
              {
                coordinates: [37.383550, 55.808390],
                label: '50.84 м²\nСтоматология /\nСПАт',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503509',
                },
              },
              {
                coordinates: [37.383220, 55.808440],
                label: '287.78 м²\nОфис /\nПятерочка',
                userData: {
                  url: 'https://samolet-new2.widget.hart-estate.ru/beta/?crmPlanId=503499',
                },
              },
            ],
          },
        ],
      },
    ]
  }
];

plugin.addRealtyScene(realtyScene).then(() => {
  curtain.style.display = 'none';
});
