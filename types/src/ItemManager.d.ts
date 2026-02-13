export = ItemManager;
/**
 * Keep track of all items in game
 */
declare class ItemManager {
    items: Set<unknown>;
    add(item: unknown): void;
    remove(item: unknown): void;
    /**
     * @fires Item#updateTick
     */
    tickAll(): void;
}
