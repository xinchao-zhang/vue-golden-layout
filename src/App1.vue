<template>
  <teleport :disabled="!portal" :to="portal">
    <div :data-state="state">
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
const props = defineProps<{ state: string }>();
const portals = inject("portals") as { [index: string]: HTMLElement };
const portal = computed(()=>portals[props.state]);
</script>