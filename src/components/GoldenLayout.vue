<template>
    <div ref="glRoot" class="vue-golden-layout"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, reactive, inject, watch } from "vue";
import { LayoutConfig, type ComponentContainer, type RootItemConfig } from "golden-layout";
import { GoldenLayout } from "golden-layout";
import "golden-layout/dist/css/goldenlayout-base.css";
import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";
import { traverse } from "@/utils";

const props = defineProps<{
    config: object, // root
    header?: LayoutConfig.Header,
    settings?: LayoutConfig.Settings
}>();

const gl = shallowRef<GoldenLayout>();
const glRoot = ref<HTMLElement>();

const portals = inject("portals") as { [index: string]: HTMLElement };
const containers = new Map<ComponentContainer, string>();

const layout = reactive<LayoutConfig>({
    root: props.config as RootItemConfig,
    header: props.header || {},
    settings: props.settings || undefined
});

onMounted(() => {
    gl.value = new GoldenLayout(glRoot.value);
    gl.value.resizeWithContainerAutomatically = true;
    gl.value.bindComponentEvent = (container, config) => {
        const state = config.componentState as string;
        portals[state] = container.element;
        containers.set(container, state);
        console.log(`bind component ${state}`);
        return { component: null, virtual: false };
    };
    gl.value.unbindComponentEvent = (container) => {
        const state = containers.get(container);
        if (state) {
            containers.delete(container);
            delete portals[state];
            console.log(`unbind component ${state}`);
        }
    };

    gl.value.on("stateChanged", () => {
        const resolved = gl.value?.saveLayout();
        if (resolved) {
            const config = LayoutConfig.fromResolved(resolved);
            console.log(config);
            // send the config to server
        }

    });

    gl.value.loadLayout(layout as LayoutConfig);

});

onUnmounted(() => {
    gl.value?.destroy();
});

watch(layout, () => {

    gl.value?.loadLayout(layout as LayoutConfig);

});
</script>

<style>
.vue-golden-layout {
    position: relative;
    overflow: hidden;
}
</style>