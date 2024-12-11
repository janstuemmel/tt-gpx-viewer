import type {LayerSpecification} from 'maplibre-gl';

export const infrastructure: LayerSpecification[] = [
  {
    id: 'street-track',
    type: 'line',
    'source-layer': 'streets',
    filter: [
      'all',
      ['==', 'kind', 'track'],
      ['!=', 'bridge', true],
      ['!=', 'tunnel', true],
    ],
    source: 'versatiles-shortbread',
    paint: {
      'line-color': '#8ba5c1',
      'line-width': {
        type: 'interval',
        stops: [
          [10, 2],
          [16, 3],
          [18, 16],
          [19, 44],
          [20, 88],
        ],
      },
      'line-dasharray': [2, 4],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  },
  {
    id: 'street-secondary',
    type: 'line',
    'source-layer': 'streets',
    filter: [
      'all',
      ['!=', 'bridge', true],
      ['!=', 'tunnel', true],
      ['in', 'kind', 'secondary'],
      ['!=', 'link', true],
    ],
    source: 'versatiles-shortbread',
    paint: {
      'line-color': '#8ba5c1',
      'line-width': {
        type: 'interval',
        stops: [
          [8, 0],
          [9, 1],
          [14, 4],
          [16, 6],
          [18, 28],
          [19, 64],
          [20, 130],
        ],
      },
      'line-opacity': {
        type: 'interval',
        stops: [
          [8, 0],
          [9, 1],
        ],
      },
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  },
  {
    id: 'street-primary',
    type: 'line',
    'source-layer': 'streets',
    filter: [
      'all',
      ['!=', 'bridge', true],
      ['!=', 'tunnel', true],
      ['in', 'kind', 'primary'],
      ['!=', 'link', true],
    ],
    source: 'versatiles-shortbread',
    paint: {
      'line-color': '#8ba5c1',
      'line-width': {
        type: 'interval',
        stops: [
          [8, 0],
          [9, 2],
          [10, 3],
          [14, 5],
          [16, 10],
          [18, 34],
          [19, 70],
          [20, 140],
        ],
      },
      'line-opacity': {
        type: 'interval',
        stops: [
          [8, 0],
          [9, 1],
        ],
      },
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  },

  {
    id: 'street-trunk',
    type: 'line',
    'source-layer': 'streets',
    filter: [
      'all',
      ['!=', 'bridge', true],
      ['!=', 'tunnel', true],
      ['in', 'kind', 'trunk'],
      ['!=', 'link', true],
    ],
    source: 'versatiles-shortbread',
    paint: {
      'line-color': '#8ba5c1',
      'line-width': {
        type: 'interval',
        stops: [
          [8, 0],
          [9, 2],
          [10, 3],
          [14, 5],
          [16, 10],
          [18, 34],
          [19, 70],
          [20, 140],
        ],
      },
      'line-opacity': {
        type: 'interval',
        stops: [
          [8, 0],
          [9, 1],
        ],
      },
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  },
  {
    id: 'street-motorway',
    type: 'line',
    'source-layer': 'streets',
    filter: [
      'all',
      ['!=', 'bridge', true],
      ['!=', 'tunnel', true],
      ['in', 'kind', 'motorway'],
      ['!=', 'link', true],
    ],
    source: 'versatiles-shortbread',
    paint: {
      'line-color': '#8ba5c1',
      'line-width': {
        type: 'interval',
        stops: [
          [5, 0],
          [6, 1],
          [10, 4],
          [14, 4],
          [16, 12],
          [18, 36],
          [19, 80],
          [20, 160],
        ],
      },
      'line-opacity': {
        type: 'interval',
        stops: [
          [5, 0],
          [6, 1],
        ],
      },
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  },
];
