export = Item;
/**
 * @property {Area}    area        Area the item belongs to (warning: this is not the area is currently in but the
 *                                 area it belongs to on a fresh load)
 * @property {object}  metadata    Essentially a blob of whatever attrs the item designer wanted to add
 * @property {Array}   behaviors   list of behaviors this object uses
 * @property {string}  description Long description seen when looking at it
 * @property {number}  id          vnum
 * @property {boolean} isEquipped  Whether or not item is currently equipped
 * @property {?Character} equippedBy Entity that has this equipped
 * @property {Map}     inventory   Current items this item contains
 * @property {string}  name        Name shown in inventory and when equipped
 * @property {?Room}   room        Room the item is currently in
 * @property {string}  roomDesc    Description shown when item is seen in a room
 * @property {string}  script      A custom script for this item
 * @property {ItemType|string} type
 * @property {string}  uuid        UUID differentiating all instances of this item
 * @property {boolean} closeable   Whether this item can be closed (Default: false, true if closed or locked is true)
 * @property {boolean} closed      Whether this item is closed
 * @property {boolean} locked      Whether this item is locked
 * @property {?entityReference} lockedBy Item that locks/unlocks this item
 * @property {?(Character|Item)} carriedBy Entity that has this in its Inventory
 *
 * @extends GameEntity
 */
declare class Item extends GameEntity {
    constructor(area: unknown, item: unknown);
    area: unknown;
    metadata: unknown;
    behaviors: Map<string, unknown>;
    defaultItems: unknown;
    description: unknown;
    entityReference: unknown;
    id: unknown;
    maxItems: unknown;
    isEquipped: unknown;
    keywords: unknown;
    name: unknown;
    room: unknown;
    roomDesc: unknown;
    script: unknown;
    type: unknown;
    uuid: unknown;
    closeable: unknown;
    closed: unknown;
    locked: unknown;
    lockedBy: unknown;
    carriedBy: unknown;
    equippedBy: unknown;
    /**
     * Create an Inventory object from a serialized inventory
     * @param {object} inventory Serialized inventory
     */
    initializeInventory(inventory: object): void;
    inventory: Inventory;
    hasKeyword(keyword: unknown): boolean;
    /**
     * Add an item to this item's inventory
     * @param {Item} item
     */
    addItem(item: Item): void;
    /**
     * Remove an item from this item's inventory
     * @param {Item} item
     */
    removeItem(item: Item): void;
    /**
     * @return {boolean}
     */
    isInventoryFull(): boolean;
    _setupInventory(): void;
    /**
     * Helper to find the game entity that ultimately has this item in their
     * Inventory in the case of nested containers. Could be an item, player, or
     * @return {Character|Item|null} owner
     */
    findCarrier(): Character | Item | null;
    /**
     * Open a container-like object
     */
    open(): void;
    /**
     * Close a container-like object
     */
    close(): void;
    /**
     * Lock a container-like object
     */
    lock(): void;
    /**
     * Unlock a container-like object
     */
    unlock(): void;
    hydrate(state: unknown, serialized?: {}): boolean;
    __hydrated: boolean;
    serialize(): {
        entityReference: unknown;
        inventory: {
            items: unknown[];
            max: number;
        };
        metadata: unknown;
        description: unknown;
        keywords: unknown;
        name: unknown;
        roomDesc: unknown;
        closed: unknown;
        locked: unknown;
        behaviors: {};
    };
}
import GameEntity = require("./GameEntity");
import { Inventory } from "./Inventory";
