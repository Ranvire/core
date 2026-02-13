export = Npc;
/**
 * @property {number} id   Area-relative id (vnum)
 * @property {Area}   area Area npc belongs to (not necessarily the area they're currently in)
 * @property {Map} behaviors
 * @extends Character
 * @mixes Scriptable
 */
declare class Npc extends Character {
    constructor(area: unknown, data: unknown);
    area: unknown;
    script: unknown;
    behaviors: Map<string, unknown>;
    equipment: Map<unknown, unknown>;
    defaultEquipment: unknown;
    defaultItems: unknown;
    description: unknown;
    entityReference: unknown;
    id: unknown;
    keywords: unknown;
    quests: unknown;
    uuid: unknown;
    commandQueue: CommandQueue;
    /**
     * Move the npc to the given room, emitting events appropriately
     * @param {Room} nextRoom
     * @param {function} onMoved Function to run after the npc is moved to the next room but before enter events are fired
     * @fires Room#npcLeave
     * @fires Room#npcEnter
     * @fires Npc#enterRoom
     */
    moveTo(nextRoom: Room, onMoved?: Function): void;
    hydrate(state: unknown): void;
}
import Character = require("./Character");
import CommandQueue = require("./CommandQueue");
import Room = require("./Room");
