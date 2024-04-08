<template>
  <Panel header="Info Viaje" class="mx-3 text-lg text-left">
    <p class="flex justify-between m-0">
      <span><i class="pi pi-map-marker"></i> Origen:</span
      ><span> Mi ubicacion</span>
    </p>
    <p class="flex justify-between m-0">
      <span class="basis-1/2"><i class="pi pi-flag-fill"></i> Destino:</span
      ><span class="text-right basis-1/2">{{ destinationAddress }}</span>
    </p>
    <p class="flex justify-between m-0">
      <span><i class="pi pi-arrows-h"></i> Distancia:</span
      ><span> {{ distance }}km</span>
    </p>
    <p class="flex justify-between m-0">
      <span><i class="pi pi-hourglass"></i> Duracion:</span
      ><span> {{ convertTime(duration) }}</span>
    </p>
  </Panel>
</template>

<script setup>
import convertTime from "@/utils/convertTime";
defineProps({
  originAddress: String,
  destinationAddress: String,
  distance: Number,
  duration: Number,
});
</script>
