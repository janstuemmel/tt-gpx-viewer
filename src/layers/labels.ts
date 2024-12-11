import type {SymbolLayerSpecification} from 'maplibre-gl';

const createCityLayer = (
  id: string,
  {filter, layout, paint, minzoom}: Partial<SymbolLayerSpecification>,
): SymbolLayerSpecification => ({
  id,
  type: 'symbol',
  'source-layer': 'place_labels',
  filter,
  layout: {
    'icon-image': 'osm:circle_11',
    'text-field': '{name_en}',
    'text-font': ['noto_sans_regular'],
    ...layout,
  },
  source: 'versatiles-shortbread',
  paint: {
    'text-color': '#383838',
    'text-translate': [0, -12],
    ...paint,
  },
  minzoom,
});

export const labels: SymbolLayerSpecification[] = [
  {
    id: 'label-street-primary',
    type: 'symbol',
    'source-layer': 'street_labels',
    filter: ['==', 'kind', 'primary'],
    layout: {
      'text-field': '{name}',
      'text-font': ['noto_sans_regular'],
      'symbol-placement': 'line',
      'text-anchor': 'center',
      'text-size': {
        type: 'interval',
        stops: [
          [12, 10],
          [15, 13],
        ],
      },
    },
    source: 'versatiles-shortbread',
    paint: {
      'icon-color': '#3b3b3b',
      'text-color': '#3b3b3b',
      'text-halo-color': 'rgba(255, 255, 255, 0.8)',
      'text-halo-width': 2,
      'text-halo-blur': 1,
    },
    minzoom: 12,
  },
  {
    id: 'label-boundary-country-large',
    type: 'symbol',
    'source-layer': 'boundary_labels',
    filter: ['in', 'admin_level', 2, '2'],
    layout: {
      'text-field': ['format', ['upcase', ['get', 'name_de']]],
      'text-font': ['noto_sans_regular'],
      'text-anchor': 'top',
      'text-padding': 0,
      'text-optional': true,
      'text-size': {
        type: 'interval',
        stops: [
          [2, 10],
          [5, 15],
          [8, 18],
        ],
      },
    },
    source: 'versatiles-shortbread',
    paint: {
      'text-color': '#3b3b3b',
      'text-halo-color': 'rgba(255, 255, 255, 0.8)',
      'text-halo-width': 2,
      'text-halo-blur': 1,
    },
    minzoom: 2,
  },
  createCityLayer('label-place-village', {
    filter: ['==', 'kind', 'village'],
    minzoom: 10,
    layout: {'text-size': 10, 'icon-size': 0.7},
  }),
  createCityLayer('label-place-town', {
    filter: ['==', 'kind', 'town'],
    minzoom: 7,
    layout: {'text-size': 12, 'icon-size': 0.7},
  }),
  createCityLayer('label-place-city', {
    filter: ['==', 'kind', 'city'],
    minzoom: 6,
    layout: {'text-size': 14, 'icon-size': 1},
  }),
  createCityLayer('label-place-statecapital', {
    filter: ['==', 'kind', 'state_capital'],
    minzoom: 5,
    layout: {'text-size': 14, 'icon-size': 1},
  }),
  createCityLayer('label-place-capital', {
    filter: ['==', 'kind', 'capital'],
    minzoom: 4,
    layout: {'text-size': 16, 'icon-size': 1},
  }),
];
