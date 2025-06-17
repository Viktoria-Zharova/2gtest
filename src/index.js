const map = new mapgl.Map('container', {
    center: [37.383849,55.808361],
    zoom: 18.25,
    key: '7f9168cc-7f41-4862-ac0e-475d7c33b869', // API key can be used on 2gis.github.io/mapgl-examples only!
    pitch: 53,
    rotation: 123,
    enableTrackResize: true,
    maxZoom: 21,
});

map.on('click', (e) => {
    console.log(e);
});

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
        rotateY: 73, // Требует калибровки
        scale: 172,   // Требует калибровки
        modelUrl: 'House_Environment.glb',
        linkedIds: ['70030076609150266'],
        mapOptions: {
            center: [lon, lat],
            pitch: 150,
            zoom: 18,
            rotation: 0
        }
    },
    {
        modelId: 'building',
        coordinates: [lon, lat],
        rotateX: 90,
        rotateY: 73, // Требует калибровки
        scale: 172,   // Требует калибровки
        modelUrl: 'House_Full.glb',
        floors: [
            {
                id: '2',
                text: '2',
                modelUrl: 'House_2floor.glb',
                mapOptions: {
                    center: [lon, lat],
                    pitch: 0.001,
                    zoom: 19,
                    rotation: 0
                }
            },
            {
                id: '8',
                text: '8',
                modelUrl: 'House_8floor.glb',
                mapOptions: {
                    center: [lon, lat],
                    pitch: 0.001,
                    zoom: 19,
                    rotation: 0
                }
            }
        ]
    }
];

plugin.addRealtyScene(realtyScene).then(() => {
    curtain.style.display = 'none';
});
