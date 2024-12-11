import type {LayerSpecification} from 'maplibre-gl';

export const administrative: LayerSpecification[] = [
  {
    id: 'boundary-state',
    type: 'line',
    'source-layer': 'boundaries',
    filter: [
      'all',
      ['==', 'admin_level', 4],
      ['!=', 'maritime', true],
      ['!=', 'disputed', true],
      ['!=', 'coastline', true],
    ],
    source: 'versatiles-shortbread',
    paint: {
      'line-color': '#d0d0d0',
      'line-width': {
        type: 'interval',
        stops: [
          [7, 0],
          [8, 1],
          [10, 2],
        ],
      },
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  },

  {
    id: 'boundary-country',
    type: 'line',
    'source-layer': 'boundaries',
    filter: [
      'all',
      ['==', 'admin_level', 2],
      ['!=', 'maritime', true],
      ['!=', 'disputed', true],
      ['!=', 'coastline', true],
    ],
    source: 'versatiles-shortbread',
    paint: {
      'line-color': '#393b3e',
      'line-width': {
        type: 'interval',
        stops: [
          [2, 0],
          [3, 1],
          [10, 4],
        ],
      },
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  },
];
