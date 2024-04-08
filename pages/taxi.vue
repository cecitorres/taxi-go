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
const mapRef = ref(null);
const showResult = ref(false);

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
  await calculateTaxiFare(originCoords.value, destinationCoords.value);
  // Draw Map
  mapRef.value.drawRoute(routeString.value);
  showResult.value = true;
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-screen h-screen text-center"
  >
    <div class="w-screen" v-show="showResult">
      <Button
        @click="onGetDestinationAddress"
        icon="pi pi-microphone"
        severity="warning"
        class="m-auto p-button-rounded"
        label="Nuevo destino"
      ></Button>
      <div class="my-4">
        <Map ref="mapRef" />
      </div>
      <InfoPrice :fare-cost="fareCost" />
      <InfoRide
        origin-address="Mi ubicacion"
        :destination-address="destinationAddress"
        :distance="distance"
        :duration="duration"
      />
    </div>
    <div v-show="!showResult">
      <p class="mb-4 text-4xl">¿A dónde?🚕💨</p>
      <Button
        @click="onGetDestinationAddress"
        icon="pi pi-microphone"
        severity="warning"
        class="mx-auto big p-button-rounded"
      ></Button>
    </div>
  </div>
</template>

<style scoped>
button.big {
  min-height: 40vh;
  min-width: 40vh;
  font-size: 8rem;
}
</style>
