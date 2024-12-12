import maplibre, {
  type LayerSpecification,
  NavigationControl,
  type IControl,
} from 'maplibre-gl';
import * as mapTextProto from 'maplibre-gl-vector-text-protocol';
import 'maplibre-gl/dist/maplibre-gl.css';
import RulerControlInvisible from '@mapbox-controls/ruler';
import {empty} from '@versatiles/style';
import '@mapbox-controls/ruler/src/index.css';
import './main.css';

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

const layers: LayerSpecification[] = [
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

const rulerInvisible = new RulerControlInvisible({
  labelLayout: {'text-font': ['noto_sans_regular']},
  invisible: true,
});

class RulerControl implements IControl {
  private elem: HTMLElement | null;
  onAdd() {
    const div = document.createElement('div');
    div.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    const button = document.createElement('button');
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-ruler-3"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 8c.621 0 1.125 .512 1.125 1.143v5.714c0 .631 -.504 1.143 -1.125 1.143h-15.875a1 1 0 0 1 -1 -1v-5.857c0 -.631 .504 -1.143 1.125 -1.143h15.75z" /><path d="M9 8v2" /><path d="M6 8v3" /><path d="M12 8v3" /><path d="M18 8v3" /><path d="M15 8v2" /></svg>`;
    div.appendChild(button);
    div.addEventListener('click', () => {
      if (rulerInvisible.isActive) {
        rulerInvisible.deactivate();
        button.style.removeProperty('color');
      } else {
        rulerInvisible.activate();
        button.style.setProperty('color', '#4264fb');
      }
    });
    return div;
  }
  onRemove(): void {
    if (this.elem) {
      document.removeChild(this.elem);
    }
  }
}

map.addControl(rulerInvisible as unknown as IControl);
map.addControl(new NavigationControl({showCompass: false}));
map.addControl(new RulerControl());

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

map.on('load', async () => {
  // GPX
  const filesElem = document.getElementById('files') as HTMLElement;
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
    attribution:
      '© <a href="https://www.mapzen.com/rights">Mapzen</a> and <a href="https://www.mapzen.com/rights/#services-and-data-sources">others</a>',
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
});
