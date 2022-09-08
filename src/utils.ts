import type { ItemConfig } from "golden-layout";

export function traverse(config: ItemConfig, visitor: (current: ItemConfig, parent?: ItemConfig) => ItemConfig = (it => it)): ItemConfig {
    return _traverse(config, undefined, visitor);
}

function _traverse(config: ItemConfig, parent: ItemConfig | undefined, visitor: (current: ItemConfig, parent?: ItemConfig) => ItemConfig): ItemConfig {
    switch (config.type) {
        case "stack":
        case "row":
        case "column":
        case "ground":
            const content = config.content?.map(it => _traverse(it, config, visitor)) || [];
            return visitor({...config, content}, parent);
        default:
            return visitor(config, parent);
    }
}