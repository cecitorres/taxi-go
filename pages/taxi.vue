<script setup>
import { ref, onMounted } from "vue";

const originCoordinates = ref()
const { getUserLocation } = useUserLocation();
// Calcular coordenadas inicio
onMounted(async () => {
  originCoordinates.value = await getUserLocation();
  console.log(originCoordinates.value)
})
// Obtener por voz la direccion destino
// Calcular coordenadas destino,

// Calcular ruta
// Calcular costos
</script>

<template>
  <div class="flex items-center">
    <!-- <p>Taxi</p> -->
    <Button
      icon="pi pi-microphone"
      severity="warning"
      class="mx-auto p-button-rounded"
    ></Button>
  </div>
</template>

<style scoped>
button {
  min-height: 40vh;
  min-width: 40vh;
  font-size: 8rem;
}
</style>
