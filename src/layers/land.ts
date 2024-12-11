import type {LayerSpecification} from 'maplibre-gl';

export const land: LayerSpecification[] = [
  {
    id: 'land-wetland',
    type: 'fill',
    'source-layer': 'land',
    filter: ['all', ['in', 'kind', 'bog', 'marsh', 'string_bog', 'swamp']],
    source: 'versatiles-shortbread',
    paint: {
      'fill-color': '#beddf3',
    },
  },
  {
    id: 'water-area',
    type: 'fill',
    'source-layer': 'water_polygons',
    filter: ['==', 'kind', 'water'],
    source: 'versatiles-shortbread',
    paint: {
      'fill-color': '#beddf3',
      'fill-opacity': {
        type: 'interval',
        stops: [
          [4, 0],
          [6, 1],
        ],
      },
    },
  },
  {
    id: 'water-area-river',
    type: 'fill',
    'source-layer': 'water_polygons',
    filter: ['==', 'kind', 'river'],
    source: 'versatiles-shortbread',
    paint: {
      'fill-color': '#beddf3',
      'fill-opacity': {
        type: 'interval',
        stops: [
          [4, 0],
          [6, 1],
        ],
      },
    },
  },
  {
    id: 'land-forest',
    type: 'fill',
    'source-layer': 'land',
    filter: ['all', ['in', 'kind', 'forest']],
    source: 'versatiles-shortbread',
    paint: {
      'fill-color': '#66aa44',
      'fill-opacity': {
        type: 'exponential',
        stops: [
          [6, 0],
          [7, 0.1],
        ],
      },
    },
  },
  {
    id: 'land-vegetation',
    type: 'fill',
    'source-layer': 'land',
    filter: ['all', ['in', 'kind', 'heath', 'scrub']],
    source: 'versatiles-shortbread',
    paint: {
      'fill-color': '#d9d9a5',
      'fill-opacity': {
        type: 'interval',
        stops: [
          [11, 0],
          [12, 1],
        ],
      },
    },
  },
];
