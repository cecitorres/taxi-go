<script setup>
import { ref, onMounted } from "vue";
import getTranscript from "~/utils/speechRecognition";
import {
  initializeLocationClient,
  searchPlaceForText,
} from "@/services/locationService";

const client = ref();
const originCoords = ref([]);
const destinationCoords = ref([]);
const destinationAddress = ref("");
const { getUserLocation } = useUserLocation();
const {
  loading,
  distance,
  duration,
  fareCost,
  routeString,
  calculateTaxiFare,
} = useTaxiFare(client);

// Calcular coordenadas inicio
onMounted(async () => {
  // Initialize the AWS Location client
  client.value = await initializeLocationClient();
  originCoords.value = await getUserLocation();
  console.log(originCoords.value);
});
const onGetDestinationAddress = async () => {
  // Obtener por voz la direccion destino
  destinationAddress.value = await getTranscript();
  // Calcular coordenadas destino,
  const place = await searchPlaceForText(
    destinationAddress.value,
    client.value
  );
  destinationCoords.value = place.Geometry.Point;
  destinationAddress.value = place.Label;

  // Calcular ruta
  // Calcular costos
  calculateTaxiFare(originCoords.value, destinationCoords.value);
  // Draw Map
};
</script>

<template>
  <div class="flex flex-col text-center">
    <!-- <p>Taxi</p> -->
    <Button
      @click="onGetDestinationAddress"
      icon="pi pi-microphone"
      severity="warning"
      class="mx-auto p-button-rounded"
    ></Button>
    <div class="">
      {{ destinationAddress }}
    </div>
    {{ destinationCoords }}
    {{ distance }}
    {{ duration }}
    {{ fareCost.day }}
    {{ fareCost.night }}
    <!-- {{ routeString }} -->
  </div>
</template>

<style scoped>
button {
  min-height: 40vh;
  min-width: 40vh;
  font-size: 8rem;
}
</style>
