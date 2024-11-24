import maplibregl from "maplibre-gl";
import * as mapTextProto from "maplibre-gl-vector-text-protocol";
import "maplibre-gl/dist/maplibre-gl.css";

mapTextProto.addProtocols(maplibregl);

const map = new maplibregl.Map({
	container: "map",
	center: [9.11, 33.11],
	zoom: 9,
	style: {
		version: 8,
		sources: {
			osm: {
				type: "raster",
				tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
				tileSize: 256,
				attribution: "&copy; OpenStreetMap Contributors",
				maxzoom: 19,
			},
		},
		layers: [
			{
				id: "osm",
				type: "raster",
				source: "osm",
			},
		],
	},
}).addControl(new maplibregl.NavigationControl());

map.on("load", () => {
	const gpxSourceName = "2410tun";

	map.addSource(gpxSourceName, {
		type: "geojson",
		data: `gpx://${location.pathname}/24-10-tun.gpx`,
	});

	map.addLayer({
		id: gpxSourceName,
		type: "line",
		source: gpxSourceName,
		minzoom: 0,
		maxzoom: 20,
		paint: {
			"line-color": "red",
			"line-width": 5,
		},
	});

	fetch(`${location.href}/poi.json`)
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
