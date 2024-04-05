<script setup>
import "maplibre-gl/dist/maplibre-gl.css";
import { getTaxiFare } from "../services/faresService";
import {
  initializeLocationClient,
  searchPlaceForSuggestions,
  getPlace,
  calculateRoute,
} from "../services/locationService";
import convertTime from "../utils/convertTime";
import { ref, onMounted } from "vue";
import maplibregl from "maplibre-gl";

let client;
let map;
const mapName = "TaxiGo";
const region = "us-east-1";
const runtimeConfig = useRuntimeConfig();
const apiKey = runtimeConfig.public.AWS_LOCATION_SERVICE_KEY;

onMounted(() => {
  // Initialize the map
  map = new maplibregl.Map({
    container: "map",
    center: [-100.3175, 25.6856],
    zoom: 14, // initial map zoom
    style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
  });
  map.addControl(new maplibregl.NavigationControl());
  // console.log(map);
});

async function initialize() {
  //initialize the Location client:
  client = await initializeLocationClient();
}
initialize();
const originInput = ref("");
const originSuggestionsResult = ref([]);
const originSuggestionsText = ref([]);
const originCoordinates = ref([]);

const onOriginSearch = async (event) => {
  try {
    const response = await searchPlaceForSuggestions(event.query, client);
    originSuggestionsResult.value = response.Results;
    // Procesar el resultado para obtener las sugerencias de direcciones
    originSuggestionsText.value = originSuggestionsResult.value.map(
      (result) => result.Text
    );
  } catch (error) {
    console.error("Error searching for places:", error);
  }
};

const onOriginSelect = async (event) => {
  try {
    const placeId = originSuggestionsResult.value.find(
      (i) => i.Text === event.value
    ).PlaceId;
    const response = await getPlace(placeId, client);
    // Procesar placeInfo para obtener las coordenadas
    originCoordinates.value = response.Place.Geometry.Point;
  } catch (error) {
    console.error("Error getting place coordinates:", error);
    // Manejar errores de obtención de coordenadas del lugar
  }
};

const destinationInput = ref("");
const destinationSuggestionsResult = ref([]);
const destinationSuggestionsText = ref([]);
const destinationCoordinates = ref([]);

const destinationSearch = async (event) => {
  try {
    const response = await searchPlaceForSuggestions(event.query, client);
    destinationSuggestionsResult.value = response.Results;
    // Procesar el resultado para obtener las sugerencias de direcciones
    destinationSuggestionsText.value = destinationSuggestionsResult.value.map(
      (result) => result.Text
    );
  } catch (error) {
    console.error("Error searching for places:", error);
  }
};

const onDestinationSelect = async (event) => {
  try {
    const placeId = destinationSuggestionsResult.value.find(
      (i) => i.Text === event.value
    ).PlaceId;
    const response = await getPlace(placeId, client);
    // Procesar placeInfo para obtener las coordenadas
    destinationCoordinates.value = response.Place.Geometry.Point;
  } catch (error) {
    console.error("Error getting place coordinates:", error);
    // Manejar errores de obtención de coordenadas del lugar
  }
};

const loading = ref(false);
const distance = ref(0);
const duration = ref(0);

const dayFare = ref(0);
const nightFare = ref(0);

const calculateFare = async () => {
  loading.value = true;
  try {
    const response = await calculateRoute(
      originCoordinates.value,
      destinationCoordinates.value,
      client
    );
    distance.value = response.Summary.Distance.toFixed(2);
    // steps are also available in response
    duration.value = response.Summary.DurationSeconds.toFixed(2);

    const [dayFareCost, nightFareCost] = getTaxiFare(
      distance.value,
      duration.value
    );
    dayFare.value = dayFareCost;
    nightFare.value = nightFareCost;
    drawRoute(response);
  } catch (error) {
    console.error("Error calculating for route:", error);
  } finally {
    loading.value = false;
  }
};
const drawRoute = (data) => {
  let routes = data.Legs[0].Geometry.LineString;
  map.addSource("route_sample", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: routes,
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
      "line-width": 3,
      "line-opacity": 0.8,
    },
  });
  // Calcular los límites de la ruta
  let bounds = routes.reduce((bounds, coord) => {
    return bounds.extend(coord);
  }, new maplibregl.LngLatBounds(routes[0], routes[0]));

  // Ajustar el mapa para que se ajuste a los límites de la ruta
  map.fitBounds(bounds, { padding: 20 }); // Puedes ajustar el padding según sea necesario
  // map.redraw();
};
</script>

<template>
  <div class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
    <p class="text-2xl">Calcule su tarifa de taxi</p>
    <div class="mb-4">
      <label class="block mb-2 font-bold text-gray-700 text-md" for="username">
        Punto de partida
      </label>
      <AutoComplete
        input-id="originInput"
        v-model="originInput"
        :suggestions="originSuggestionsText"
        @complete="onOriginSearch"
        @item-select="onOriginSelect"
        placeholder="Centro de Monterrey ..."
        forceSelection
      />
    </div>

    <div class="mb-4">
      <label
        class="block mb-2 font-bold text-gray-700 text-md"
        for="destinationInput"
        >Punto de llegada
      </label>
      <AutoComplete
        input-id="destinationInput"
        v-model="destinationInput"
        :suggestions="destinationSuggestionsText"
        @complete="destinationSearch"
        @item-select="onDestinationSelect"
        placeholder="Centro de Guadalupe ..."
        forceSelection
      />
    </div>
    <div class="flex items-center justify-center">
      <Button label="Calcular" @click="calculateFare" :loading="loading" />
    </div>
    <div class="my-4">
      <div id="map"></div>
    </div>
  </div>

  <!-- <p>fake texts</p>
    <p>Central de Autobuses de Monterrey</p>
    <p>Avenida de la Primavera 1517</p> -->

  <!-- <p>Coordinadas A {{ originCoordinates }}</p>
    <p>Coordinadas B {{ destinationCoordinates }}</p> -->

  <div class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
    <Panel header="Header">
      <template #header>
        <p class="font-bold"><i class="pi pi-money-bill"></i> Costo</p>
      </template>
      <p class="m-0">
        <i class="pi pi-map-marker"></i> Distancia: {{ distance }}km
      </p>
      <p class="m-0">
        <i class="pi pi-stopwatch"></i> Duracion: {{ convertTime(duration) }}
      </p>
      <p class="m-0">
        <i class="pi pi-sun"></i> Durante el dia: ${{ dayFare }}
      </p>
      <p class="m-0">
        <i class="pi pi-moon"></i> Durante la noche: ${{ nightFare }}
      </p>
    </Panel>
  </div>
</template>
<style scoped>
#map {
  height: 30vh;
}
</style>
