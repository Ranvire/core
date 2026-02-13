export = RoomManager;
/**
 * Keeps track of all the individual rooms in the game
 */
declare class RoomManager {
    rooms: Map<unknown, unknown>;
    /**
     * @param {string} entityRef
     * @return {Room}
     */
    getRoom(entityRef: string): Room;
    /**
     * @param {Room} room
     */
    addRoom(room: Room): void;
    /**
     * @param {Room} room
     */
    removeRoom(room: Room): void;
}
import Room = require("./Room");
