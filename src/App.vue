<script setup lang="ts">
import GoldenLayout from './components/GoldenLayout.vue';
const props = defineProps<{
  config: object
}>();
</script>

<template>
  <GoldenLayout :config="config" :header="{show: 'top', popout: false}" class="flex-1"/>
</template>