<script setup>
import "maplibre-gl/dist/maplibre-gl.css";
import { getTaxiFare } from "../services/faresService";
import {
  initializeLocationClient,
  searchPlaceForSuggestions,
  searchPlaceForText,
  getPlace,
  calculateRoute,
} from "../services/locationService";
import convertTime from "../utils/convertTime";
import { ref, onMounted } from "vue";
import maplibregl from "maplibre-gl";
import getCurrentPosition from "../utils/location";

let client;
let map;
const mapName = "TaxiGo";
const region = "us-east-1";
const runtimeConfig = useRuntimeConfig();
const apiKey = runtimeConfig.public.AWS_LOCATION_SERVICE_KEY;

const loadingCurrentLocation = ref(false);
onMounted(async () => {
  //initialize the Location client:
  client = await initializeLocationClient();
  // Initialize the map
  map = new maplibregl.Map({
    container: "map",
    center: [-100.3175, 25.6856],
    zoom: 14, // initial map zoom
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

const getCurrentLocation = async () => {
  // GPS location
  if ("geolocation" in navigator) {
    try {
      loadingCurrentLocation.value = true;
      const position = await getCurrentPosition();
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      originInput.value = "Mi ubicacion";
      originCoordinates.value = [lat, lon];
      // Hardcode coords for fake position
      originCoordinates.value = [-100.1865, 25.6718];
    } catch (err) {
      console.log(err);
    } finally {
      loadingCurrentLocation.value = false;
    }
  } else {
    // TODO: Add toast to show error
  }
};

const resetValues = () => {
  originInput.value = "";
  originSuggestionsResult.value = [];
  originSuggestionsText.value = [];
  originCoordinates.value = [];
  destinationInput.value = "";
  destinationSuggestionsResult.value = [];
  destinationSuggestionsText.value = [];
  destinationCoordinates.value = [];
};

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

const searchByVoice = async () => {
  try {
    const response = await searchPlaceForText(destinationInput.value, client);
    console.log(response);
    const firstResult = response.Results[0].Place;
    destinationCoordinates.value = firstResult.Geometry.Point;
    destinationInput.value = firstResult.Label;
  } catch (error) {
    console.error("Error searching for place:", error);
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
  // Obtener las coordenadas de la nueva ruta
  let routes = data.Legs[0].Geometry.LineString;

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
const getAutoCompleteComponent = (refName) => {
  return eval(refName);
};
const destinationRef = ref(null);
const startSpeechRecognition = () => {
  const autoCompleteComponent = getAutoCompleteComponent("destinationRef");

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "es-ES";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    destinationInput.value = transcript;
    searchByVoice();
    // // Simular el evento 'complete' con el texto transcrita como consulta
    // autoCompleteComponent.value.$emit("complete", {
    //   query: transcript,
    // });
    // autoCompleteComponent.value.clicked = true;
    // autoCompleteComponent.value.focused = true;
    // // Mostrar sugerencias
    // autoCompleteComponent.value.overlayVisible = true;
  };

  recognition.onerror = (event) => {
    console.error("Error de reconocimiento:", event.error);
  };

  recognition.onend = () => {
    console.log("Reconocimiento de voz finalizado");
  };

  recognition.start();
};
</script>

<template>
  <div class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
    <p class="text-2xl">Calcule su tarifa de taxi</p>
    <div class="mb-4">
      <label class="block mb-2 font-bold text-gray-700 text-md" for="username">
        Punto de partida
      </label>
      <div class="flex">
        <AutoComplete
          input-id="originInput"
          v-model="originInput"
          :suggestions="originSuggestionsText"
          @complete="onOriginSearch"
          @item-select="onOriginSelect"
          placeholder="Centro de Monterrey ..."
          forceSelection
          :disabled="loadingCurrentLocation"
          class="flex-1 mr-2"
        />

        <Button
          @click="getCurrentLocation"
          :loading="loadingCurrentLocation"
          icon="pi pi-map-marker"
          severity="danger"
        />
      </div>
    </div>

    <div class="mb-4">
      <label
        class="block mb-2 font-bold text-gray-700 text-md"
        for="destinationInput"
        >Punto de llegada
      </label>
      <div class="flex">
        <AutoComplete
          input-id="destinationInput"
          v-model="destinationInput"
          :suggestions="destinationSuggestionsText"
          @complete="destinationSearch"
          @item-select="onDestinationSelect"
          placeholder="Centro de Guadalupe ..."
          forceSelection
          class="flex-1 mr-2"
          ref="destinationRef"
        />
        <Button
          @click="startSpeechRecognition"
          icon="pi pi-microphone"
          severity="warning"
        ></Button>
      </div>
    </div>
    <div class="flex items-center justify-around">
      <Button label="Limpiar" @click="resetValues" outlined="" />
      <Button label="Calcular" @click="calculateFare" :loading="loading" />
    </div>
    <div class="my-4">
      <div id="map"></div>
    </div>
  </div>

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
