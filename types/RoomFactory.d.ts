export = RoomFactory;
/**
 * Stores definitions of npcs to allow for easy creation/cloning
 * @extends EntityFactory
 */
declare class RoomFactory extends EntityFactory {
    /**
     * Create a new instance of a given room. Room will not be hydrated
     *
     * @param {Area}   area
     * @param {string} entityRef
     * @return {Room}
     */
    create(area?: Area, entityRef?: string): Room;
}
import Area = require("./Area");
import EntityFactory = require("./EntityFactory");
import Room = require("./Room");
