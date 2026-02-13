export = TransportStream;
/**
 * Base class for anything that should be sending or receiving data from the player
 */
declare class TransportStream extends EventEmitter {
    constructor(options?: EventEmitter.EventEmitterOptions);
    get readable(): boolean;
    get writable(): boolean;
    write(): void;
    /**
     * A subtype-safe way to execute commands on a specific type of stream that invalid types will ignore. For given input
     * for command (example, `"someCommand"` ill look for a method called `executeSomeCommand` on the `TransportStream`
     * @param {string} command
     * @param {...*} args
     * @return {*}
     */
    command(command: string, ...args: unknown[]): unknown;
    address(): unknown;
    end(): void;
    setEncoding(): void;
    pause(): void;
    resume(): void;
    destroy(): void;
    /**
     * Attach a socket to this stream
     * @param {*} socket
     */
    attach(socket: unknown): void;
    socket: unknown;
}
import EventEmitter = require("node:events");
