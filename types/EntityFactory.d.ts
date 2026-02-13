export = EntityFactory;
/**
 * Stores definitions of entities to allow for easy creation/cloning
 */
declare class EntityFactory {
    entities: Map<unknown, unknown>;
    scripts: BehaviorManager;
    /**
     * Create the key used by the entities and scripts maps
     * @param {string} areaName
     * @param {number} id
     * @return {string}
     */
    createEntityRef(area: unknown, id: number): string;
    /**
     * @param {string} entityRef
     * @return {Object}
     */
    getDefinition(entityRef: string): unknown;
    /**
     * @param {string} entityRef
     * @param {Object} def
     */
    setDefinition(entityRef: string, def: unknown): void;
    /**
     * Add an event listener from a script to a specific item
     * @see BehaviorManager::addListener
     * @param {string}   entityRef
     * @param {string}   event
     * @param {Function} listener
     */
    addScriptListener(entityRef: string, event: string, listener: Function): void;
    /**
     * Create a new instance of a given npc definition. Resulting npc will not be held or equipped
     * and will _not_ have its default contents. If you want it to also populate its default contents
     * you must manually call `npc.hydrate(state)`
     *
     * @param {Area}   area
     * @param {string} entityRef
     * @param {Class}  Type      Type of entity to instantiate
     * @return {type}
     */
    createByType(area: Area, entityRef: string, Type: Class): type;
    create(): void;
    /**
     * Clone an existing entity.
     * @param {Item|Npc|Room|Area} entity
     * @return {Item|Npc|Room|Area}
     */
    clone(entity: Item | Npc | Room | Area): Item | Npc | Room | Area;
}
import BehaviorManager = require("./BehaviorManager");
import Area = require("./Area");
import Item = require("./Item");
import Npc = require("./Npc");
import Room = require("./Room");
type Class = new (...args: unknown[]) => unknown;
type type = unknown;
