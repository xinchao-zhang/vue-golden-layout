<template>
    <div ref="glRoot" class="vue-golden-layout"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, inject, watchEffect } from "vue";
import { ContentItem, LayoutConfig, VirtualLayout, type ComponentContainer } from "golden-layout";
import { GoldenLayout} from "golden-layout";
import "golden-layout/dist/css/goldenlayout-base.css";
import "golden-layout/dist/css/themes/goldenlayout-dark-theme.css";
import { traverse } from "@/utils";
import * as cloneDeep from "lodash.clonedeep";

const props = defineProps<{
    config: object, // root
    showHeader?: false | "top" | "left" | "right" | "bottom"
}>();

const gl = shallowRef<GoldenLayout>();
const glRoot = ref<HTMLElement>();

const portals = inject("portals") as { [index: string]: HTMLElement };
const containers = new Map<ComponentContainer, string>();

onMounted(() => {
    const bindComponentEvent: VirtualLayout.BindComponentEventHandler = (container, config) => {
        const state = config.componentState as string;
        portals[state] = container.element;
        containers.set(container, state);
        console.log(`bind component ${state}`);
        return { component: null, virtual: false };
    };

    const unbindComponentEvent: VirtualLayout.UnbindComponentEventHandler = (container) => {
        const state = containers.get(container);
        if (state) {
            containers.delete(container);
            delete portals[state];
            console.log(`unbind component ${state}`);
        }
    };

    // the bind and unbind event handler needs to passed in like this in order
    // to avoid async initialization
    gl.value = new GoldenLayout(glRoot.value, bindComponentEvent, unbindComponentEvent);
    gl.value.resizeWithContainerAutomatically = true;

    gl.value.on("tabCreated", (tab) => {
        console.log(`tabCreated ${tab}`);
        // const x = document.createElement("button");
        // x.innerHTML="close";
        // tab.element.appendChild(x);
    });

    gl.value.on("itemCreated", (e) => {
        console.log(`itemCreated ${(e.target as any).type}`);
        const target = e.target as ContentItem;
        if (ContentItem.isStack(target)) {
            // const p = target.header.controlsContainerElement;
            // const x = document.createElement('button');
            // x.innerHTML = "x";
            // p.appendChild(x);
        }
    });

    gl.value.on("stateChanged", () => {
        const resolved = gl.value?.saveLayout();
        if (resolved) {
            const config = LayoutConfig.fromResolved(resolved);
            console.log(`stateChanged ${JSON.stringify(config)}`);
            // send the config to server
        }
    });


    gl.value.on("itemDestroyed", (e) => {
        console.log(`itemDestroyed: ${(e.target as any).type}`);

    });

    watchEffect(() => {
        const root = cloneDeep(props.config);

        const layout: LayoutConfig = {
            root,
            header: { show: props.showHeader ?? "top", popout: false }
        }

        gl.value?.loadLayout(layout);
    });

});

onUnmounted(() => {
    gl.value?.destroy();
});
</script>

<style>
.vue-golden-layout {
    position: relative;
    overflow: hidden;
}

.lm_stack .lm_header .lm_controls .lm_close {
    display: none;
}

.lm_stack .lm_header .lm_tab .lm_close_tab {
    display: none;
}
</style>