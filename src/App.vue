<script setup lang="ts">
import GoldenLayout from './components/GoldenLayout.vue';
const props = defineProps<{
  config: object
}>();
</script>

<template>
  <GoldenLayout :config="config" show-header="top" class="flex-1"/>
</template>