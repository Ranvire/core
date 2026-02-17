export = GameEntity;
/**
 * @extends EventEmitter
 * @mixes Metadatable
 * @mixes Scriptable
 */
declare class GameEntity extends EventEmitter {
    constructor(options?: EventEmitter.EventEmitterOptions);
}
import EventEmitter = require("node:events");
