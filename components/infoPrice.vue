<template>
  <Panel header="Costo" class="mx-3 mb-4 text-xl text-left">
    <p class="flex justify-between m-0 text-3xl">
      <span><i class="pi pi-sun"></i> Dia: </span
      ><span>${{ fareCost.day }}</span>
    </p>
    <p class="flex justify-between m-0 text-3xl">
      <span><i class="pi pi-moon"></i> Noche: </span
      ><span>${{ fareCost.night }}</span>
    </p>
  </Panel>
</template>

<script setup>
defineProps({
  fareCost: Object,
});
</script>
