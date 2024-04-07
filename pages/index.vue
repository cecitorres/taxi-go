<script setup>
import { ref, onMounted } from "vue";
import {
  initializeLocationClient,
  searchPlaceForSuggestions,
  searchPlaceForText,
  getPlace,
  calculateRoute,
} from "../services/locationService";
import { getTaxiFare } from "../services/faresService";
import convertTime from "../utils/convertTime";
import getCurrentPosition from "../utils/location";

let client;
const mapName = "TaxiGo";
const region = "us-east-1";
const runtimeConfig = useRuntimeConfig();
const apiKey = runtimeConfig.public.AWS_LOCATION_SERVICE_KEY;

const loadingCurrentLocation = ref(false);
onMounted(async () => {
  //initialize the Location client:
  client = await initializeLocationClient();
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
      // originCoordinates.value = [-100.1865, 25.6718];
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
const getRef = (refName) => {
  return eval(refName);
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

const mapRef = ref(null);
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
    // Obtener las coordenadas de la nueva ruta
    let routes = response.Legs[0].Geometry.LineString;

    mapRef.value.drawRoute(routes);
  } catch (error) {
    console.error("Error calculating for route:", error);
  } finally {
    loading.value = false;
  }
};
const destinationRef = ref(null);
const startSpeechRecognition = () => {
  const autoCompleteComponent = getRef("destinationRef");

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
      <Map ref="mapRef" />
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
