<script setup>
import { ref, onMounted } from "vue";
import {
  initializeLocationClient,
  searchPlaceForText,
  calculateRoute,
} from "../services/locationService";
import { getTaxiFare } from "../services/faresService";
import convertTime from "../utils/convertTime";
import getTranscript from "../utils/speechRecognition";

const client = ref();
const runtimeConfig = useRuntimeConfig();
const apiKey = runtimeConfig.public.AWS_LOCATION_SERVICE_KEY;
const mapName = runtimeConfig.public.MAP_NAME;
const region = runtimeConfig.public.AWS_REGION;

onMounted(async () => {
  // Initialize the AWS Location client
  client.value = await initializeLocationClient();
});

const { loading: loadingCurrentLocation, getUserLocation } = useUserLocation();

const getCurrentLocation = async () => {
  const coords = await getUserLocation();
  originInput.value = "Mi ubicacion";
  originCoordinates.value = coords;
};

const resetAddresses = () => {
  resetOriginValues();
  resetDestinationValues();
};

const {
  input: originInput,
  suggestionsResult: originSuggestionsResult,
  suggestionsText: originSuggestionsText,
  coordinates: originCoordinates,
  onSearch: onOriginSearch,
  onSelect: onOriginSelect,
  resetValues: resetOriginValues,
} = useAddressInput(client);

const {
  input: destinationInput,
  suggestionsResult: destinationSuggestionsResult,
  suggestionsText: destinationSuggestionsText,
  coordinates: destinationCoordinates,
  onSearch: onDestinationSearch,
  onSelect: onDestinationSelect,
  resetValues: resetDestinationValues,
} = useAddressInput(client);

const getRef = (refName) => {
  return eval(refName);
};

const searchByVoice = async () => {
  try {
    const place = await searchPlaceForText(
      destinationInput.value,
      client.value
    );
    destinationCoordinates.value = place.Geometry.Point;
    destinationInput.value = place.Label;
  } catch (error) {
    console.error("Error searching for place:", error);
  }
};
const infoRideRef = ref();
const mapRef = ref(null);
const {
  loading: loadingTaxiFare,
  distance,
  duration,
  fareCost,
  routeString,
  calculateTaxiFare,
} = useTaxiFare(client);

const onCalculateTaxiFare = async () => {
  await calculateTaxiFare(
    originCoordinates.value,
    destinationCoordinates.value
  );
  mapRef.value.drawRoute(routeString.value);
  infoRideRef.value.scrollIntoView({ behavior: "smooth" });
};

const startSpeechRecognition = async () => {
  const transcript = await getTranscript();
  destinationInput.value = transcript;
  searchByVoice();
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
          @complete="onDestinationSearch"
          @item-select="onDestinationSelect"
          placeholder="Centro de Guadalupe ..."
          forceSelection
          class="flex-1 mr-2"
        />
        <Button
          @click="startSpeechRecognition"
          icon="pi pi-microphone"
          severity="warning"
        ></Button>
      </div>
    </div>
    <div class="flex items-center justify-around">
      <Button label="Limpiar" @click="resetAddresses" outlined="" />
      <Button
        label="Calcular"
        @click="onCalculateTaxiFare"
        :loading="loadingTaxiFare"
      />
    </div>
  </div>
  <div class="mt-4" ref="infoRideRef">
    <div class="my-4">
      <Map ref="mapRef" />
    </div>
    <InfoPrice :fare-cost="fareCost" />
    <InfoRide
      :origin-address="originInput"
      :destination-address="destinationInput"
      :distance="distance"
      :duration="duration"
    />
  </div>
</template>
