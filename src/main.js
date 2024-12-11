import {length} from '@turf/turf';
import maplibre from 'maplibre-gl';
import * as mapTextProto from 'maplibre-gl-vector-text-protocol';
import 'maplibre-gl/dist/maplibre-gl.css';
import './main.css';
import {empty} from '@versatiles/style';

import {administrative} from './layers/administrative';
import {infrastructure} from './layers/infrastructure';
import {labels} from './layers/labels';
import {land} from './layers/land';
import {water} from './layers/water';

mapTextProto.addProtocols(maplibre);

const ROUTES = [
  {file: '22-04-tun.gpx', name: 'Tunesien 04/2022', color: '#B565A7'},
  {file: '22-10-tun.gpx', name: 'Tunesien 10/2022', color: '#009B77'},
  {file: '23-04-tun.gpx', name: 'Tunesien 04/2023', color: '#6667AB'},
  {file: '24-04-tun.gpx', name: 'Tunesien 04/2024', color: '#BB2649'},
  {file: '24-10-tun.gpx', name: 'Tunesien 10/2024', color: '#0F4C81'},
];

// const apiKey = 'tUOkvl6XCvv71vE3zD8u';

// const map = new maplibregl.Map({
//   container: 'map',
//   center: [9.11, 33.11],
//   zoom: 9,
//   style: `https://api.maptiler.com/maps/68c69456-9c73-4f0a-82be-e58bad52d250/style.json?key=${apiKey}`,
// });

const style = empty({
  tiles: ['/tiles/osm/{z}/{x}/{y}'],
  baseUrl: 'https://tiles.versatiles.org',
  glyphs: '/assets/fonts/{fontstack}/{range}.pbf',
  sprite: [
    {id: 'versatiles', url: '/assets/sprites/sprites'},
    {
      id: 'osm',
      url: 'https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite',
    },
  ],
});

console.log(style);

const layers = [
  {
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#edf1e7',
    },
  },
  ...water,
  ...land,
  ...administrative,
  ...infrastructure,
  ...labels,
];

const map = new maplibre.Map({
  container: 'map',
  style: {...style, layers},
  center: [9.11, 33.11],
  zoom: 9,
  maxZoom: 14,
  // bounds: []
});

let rulerActive = false;

map.on('load', async () => {
  // GPX

  const filesElem = document.getElementById('files');
  ROUTES.forEach(({file, name, color}) => {
    map.addSource(name, {
      type: 'geojson',
      data: `gpx://${location.pathname}${file}`,
    });
    map.addLayer({
      id: name,
      source: name,
      type: 'line',
      paint: {
        'line-color': color,
        'line-width': 5,
        'line-opacity': 0.6,
      },
    });
    map.setLayoutProperty(name, 'visibility', 'none');
    const div = document.createElement('div');
    const txt = document.createTextNode(name);
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.style.accentColor = color;
    checkbox.addEventListener('change', () => {
      map.setLayoutProperty(
        name,
        'visibility',
        checkbox.checked ? 'visible' : 'none',
      );
    });
    div.appendChild(checkbox);
    div.appendChild(txt);
    filesElem.appendChild(div);
  });

  // TERRAIN

  map.addSource('aws-terrain', {
    type: 'raster-dem',
    tiles: [
      'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
    ],
    encoding: 'terrarium',
    tileSize: 256,
    attribution: 'tbd',
  });

  map.addLayer(
    {
      id: 'hills',
      source: 'aws-terrain',
      type: 'hillshade',
      layout: {visibility: 'visible'},
      maxzoom: 15,
      paint: {
        'hillshade-exaggeration': 1,
        'hillshade-accent-color': 'hsla(0, 0%, 0%, 0.5)',
        'hillshade-highlight-color': 'hsla(100, 100%, 100%, 0.3)',
        'hillshade-shadow-color': 'hsla(0, 0%, 0%, 0.3)',
      },
    },
    'water-ocean',
  );

  // POI

  await map
    .loadImage(`${location.pathname}point.png`)
    .then((res) => map.addImage('poi-marker', res.data));

  await fetch(`${location.href}poi.json`)
    .then((res) => res.json())
    .then((list) => {
      map.addSource('places', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: list.map(({name, lat, lon}) => ({
            type: 'Feature',
            properties: {
              description: name,
              icon: 'poi-marker',
            },
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
          })),
        },
      });

      map.addLayer({
        id: 'poi-labels',
        type: 'symbol',
        source: 'places',
        layout: {
          'text-font': ['noto_sans_regular'],
          'text-field': ['get', 'description'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 1,
          'text-size': 12,
          'text-justify': 'auto',
          'icon-image': ['get', 'icon'],
        },
      });
    });

  // RULER

  const rulerElem = document.getElementById('toggle-ruler');
  const rulerLenElem = document.getElementById('ruler-len');

  const ruler = {
    type: 'FeatureCollection',
    features: [],
  };

  const rulerLine = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
  };

  rulerElem.addEventListener('click', () => {
    rulerActive = !rulerActive;
    if (!rulerActive) {
      rulerElem.textContent = 'Aktivere Lineal';
      rulerElem.style.color = 'green';
      rulerLine.geometry.coordinates = [];
      ruler.features = [];
      rulerLenElem.innerText = '0';
      map.getSource('ruler').setData(ruler);
    } else {
      rulerElem.textContent = 'Deaktivere Lineal';
      rulerElem.style.color = 'chocolate';
    }
  });

  map.addSource('ruler', {type: 'geojson', data: ruler});
  map.addLayer({
    id: 'ruler-points',
    type: 'circle',
    source: 'ruler',
    paint: {
      'circle-radius': 8,
      'circle-color': '#000',
      'circle-opacity': 0.6,
    },
    filter: ['in', '$type', 'Point'],
  });
  map.addLayer({
    id: 'ruler-lines',
    type: 'line',
    source: 'ruler',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#000',
      'line-width': 4,
      'line-opacity': 0.6,
    },
    filter: ['in', '$type', 'LineString'],
  });

  map.on('click', (e) => {
    if (!rulerActive) {
      return;
    }

    const features = map.queryRenderedFeatures(e.point, {
      layers: ['ruler-points'],
    });

    if (ruler.features.length > 1) ruler.features.pop();

    rulerLenElem.innerText = '0';

    if (features.length) {
      const id = features[0].properties.id;
      ruler.features = ruler.features.filter((p) => p.properties.id !== id);
    } else {
      ruler.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        },
        properties: {
          id: String(new Date().getTime()),
        },
      });
    }

    if (ruler.features.length > 1) {
      rulerLine.geometry.coordinates = ruler.features.map(
        (p) => p.geometry.coordinates,
      );
      ruler.features.push(rulerLine);
      const len = length(rulerLine).toLocaleString();
      rulerLenElem.innerText = len;
    }

    map.getSource('ruler').setData(ruler);
  });

  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['ruler-points'],
    });
    map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair';
  });
});
