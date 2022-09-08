
<template>
  <div class="flex-row">
    <button @click="setRow">Set Row</button>
    <button @click="setColumn">Set Column</button>
    <button @click="addComponent">Add Component: </button><input v-model="state" />
  </div>
</template>

<script setup lang="ts">
import type { ComponentItemConfig, ItemConfig, RootItemConfig } from 'golden-layout';
import { inject, ref } from 'vue';


const config = inject("config") as RootItemConfig;

const collect = (c: ItemConfig) => {
  switch (c.type) {
    case "row":
    case "column":
    case "stack":
      const children: ComponentItemConfig[] = c.content?.reduce((a, it) => a.concat(collect(it)), [] as ComponentItemConfig[]) || [];
      return children;
    case "component":
      return [c] as ComponentItemConfig[];
    default: return [];
  }
};


const state = ref<string>();
const addComponent = () => {
  const componentState = state.value;
  const componentConfig = {
    type: "component",
    componentType: "custom",
    componentState,

  } as ComponentItemConfig;

  const type = config.type;
  if (type === "row" || type === "column" || type === "stack") {
    config.content?.push(componentConfig);
  }
};


const setRow = () => {
  if (config?.type !== "row") {
    const content = collect(config);
    Object.assign(config, {
      type: "row",
      content
    });
  }
};
const setColumn = () => {
  if (config?.type !== "column") {
    const content = collect(config);
    Object.assign(config, {
      type: "column",
      content
    });

  }
};
</script>
  