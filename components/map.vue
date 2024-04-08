<script setup>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const runtimeConfig = useRuntimeConfig();
const apiKey = runtimeConfig.public.AWS_LOCATION_SERVICE_KEY;
const mapName = runtimeConfig.public.MAP_NAME;
const region = runtimeConfig.public.AWS_REGION;

let map;

onMounted(async () => {
  // Initialize the map
  map = new maplibregl.Map({
    container: "map",
    center: [-100.3175, 25.6856],
    zoom: 14, // initial map zoom
    attributionControl: false,
    style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
  });

  map.addControl(new maplibregl.NavigationControl());

  // Add the source and layer for the initial route
  // Event listener for style load
  map.on("load", () => {
    map.addSource("route_sample", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [], // Initially empty
        },
      },
    });

    map.addLayer({
      id: "route_sample",
      type: "line",
      source: "route_sample",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#FF0000",
        "line-width": 5,
        "line-opacity": 0.5,
      },
    });
  });
});

const drawRoute = (routes) => {
  // Actualizar los datos de la fuente existente con los datos de la nueva ruta
  map.getSource("route_sample").setData({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: routes,
    },
  });
  // Calcular los límites de la ruta
  let bounds = routes.reduce((bounds, coord) => {
    return bounds.extend(coord);
  }, new maplibregl.LngLatBounds(routes[0], routes[0]));

  // Ajustar el mapa para que se ajuste a los límites de la ruta
  map.fitBounds(bounds, { padding: 20 }); // Puedes ajustar el padding según sea necesario
};

defineExpose({
  drawRoute,
});
</script>
<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  height: 30vh;
}
</style>
