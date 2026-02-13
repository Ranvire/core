export = GameServer;
declare class GameServer extends EventEmitter {
    constructor(options?: EventEmitter.EventEmitterOptions);
    /**
     * @param {commander} commander
     * @fires GameServer#startup
     */
    startup(commander: unknown): void;
    /**
     * @fires GameServer#shutdown
     */
    shutdown(): void;
}
import EventEmitter = require("node:events");
