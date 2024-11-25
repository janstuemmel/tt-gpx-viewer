import maplibregl from 'maplibre-gl';
import * as mapTextProto from 'maplibre-gl-vector-text-protocol';
import 'maplibre-gl/dist/maplibre-gl.css';

mapTextProto.addProtocols(maplibregl);

const ROUTES = [
  {file: '22-04-tun.gpx', name: 'Tunesien 04/2022', color: '#B565A7'},
  {file: '22-10-tun.gpx', name: 'Tunesien 10/2022', color: '#009B77'},
  {file: '23-04-tun.gpx', name: 'Tunesien 04/2023', color: '#6667AB'},
  {file: '24-04-tun.gpx', name: 'Tunesien 04/2024', color: '#BB2649'},
  {file: '24-10-tun.gpx', name: 'Tunesien 10/2024', color: '#98B4D4'},
];

const map = new maplibregl.Map({
  container: 'map',
  center: [9.11, 33.11],
  zoom: 9,
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap Contributors',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
      },
    ],
  },
});

map.on('load', () => {
  fetch(`${location.href}poi.json`)
    .then((res) => res.json())
    .then((list) =>
      // biome-ignore lint/complexity/noForEach: <explanation>
      list.forEach((poi) => {
        new maplibregl.Marker()
          .setLngLat([poi.lon, poi.lat])
          .addTo(map)
          .setPopup(new maplibregl.Popup().setHTML(poi.name));
      }),
    );
});

map.on('load', () => {
  const filesElem = document.getElementById('files');
  // biome-ignore lint/complexity/noForEach: <explanation>
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
        'line-width': 3,
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
});
