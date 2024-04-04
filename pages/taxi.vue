<script setup>
import { getTaxiFare } from "../services/faresService";
import {
  initializeLocationClient,
  searchPlaceForSuggestions,
  getPlace,
  calculateRoute,
} from "../services/locationService";
import convertTime from "../utils/convertTime";
import { ref } from "vue";
let client;

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
    console.log("Coordenadas del lugar:", originCoordinates.value);
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
    console.log("Coordenadas del lugar:", destinationCoordinates.value);
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
    console.log(response);
    distance.value = response.Summary.Distance.toFixed(2);
    // steps are also available in response
    duration.value = response.Summary.DurationSeconds.toFixed(2);

    const [dayFareCost, nightFareCost] = getTaxiFare(
      distance.value,
      duration.value
    );
    dayFare.value = dayFareCost;
    nightFare.value = nightFareCost;
  } catch (error) {
    console.error("Error calculating for route:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-1/2 p-4 mx-auto text-center border">
    <p>Calculemos el costo de un viaje en taxi del punto A al punto B</p>
    <div class="card flex justify-center">
      <label for="originInput">Punto de partida </label>
      <AutoComplete
        input-id="originInput"
        v-model="originInput"
        :suggestions="originSuggestionsText"
        @complete="onOriginSearch"
        @item-select="onOriginSelect"
        forceSelection
      />
    </div>

    <div class="card flex justify-center">
      <label for="destinationInput">Punto de llegada </label>
      <AutoComplete
        input-id="destinationInput"
        v-model="destinationInput"
        :suggestions="destinationSuggestionsText"
        @complete="destinationSearch"
        @item-select="onDestinationSelect"
        forceSelection
      />
    </div>
    <div class="card flex justify-center">
      <Button label="Enviar" @click="calculateFare" />
    </div>

    <p>fake texts</p>
    <p>Central de Autobuses de Monterrey</p>
    <p>Avenida de la Primavera 1517</p>

    <!-- <p>Coordinadas A {{ originCoordinates }}</p>
    <p>Coordinadas B {{ destinationCoordinates }}</p> -->

    <p></p>

    <Panel header="Header">
      <p class="m-0">
        <i class="pi pi-map-marker"></i> Distancia: {{ distance }}km
      </p>
      <p class="m-0">
        <i class="pi pi-stopwatch"></i> Duracion: {{ convertTime(duration) }}
      </p>
      <p class="m-0"><i class="pi pi-money-bill"></i> Costo</p>
      <p class="m-0">
        <i class="pi pi-sun"></i> Durante el dia: ${{ dayFare }}
      </p>
      <p class="m-0">
        <i class="pi pi-moon"></i> Durante la noche: ${{ nightFare }}
      </p>
    </Panel>
  </div>
</template>
