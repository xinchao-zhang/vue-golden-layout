import type { ItemConfig } from "golden-layout";

export function traverse(config: ItemConfig, visitor: (current: ItemConfig, parent?: ItemConfig) => void): void {
    _traverse(config, undefined, visitor);
}

function _traverse(config: ItemConfig, parent: ItemConfig | undefined, visitor: (current: ItemConfig, parent?: ItemConfig) => void): void {
    visitor(config, parent);
    if (config.type !== "component") {
        config.content?.forEach(child => _traverse(child, config, visitor));  
    }
}