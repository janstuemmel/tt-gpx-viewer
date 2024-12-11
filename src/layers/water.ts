import type {LayerSpecification} from 'maplibre-gl';

export const water: LayerSpecification[] = [
  {
    id: 'water-ocean',
    type: 'fill',
    'source-layer': 'ocean',
    source: 'versatiles-shortbread',
    paint: {
      'fill-color': '#a4d1f4',
    },
  },
  {
    id: 'water-river',
    type: 'line',
    'source-layer': 'water_lines',
    filter: [
      'all',
      ['in', 'kind', 'river'],
      ['!=', 'tunnel', true],
      ['!=', 'bridge', true],
    ],
    source: 'versatiles-shortbread',
    paint: {
      'line-color': '#beddf3',
      'line-width': {
        type: 'interval',
        stops: [
          [9, 0],
          [10, 3],
          [15, 5],
          [17, 9],
          [18, 20],
          [20, 60],
        ],
      },
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  },
];
