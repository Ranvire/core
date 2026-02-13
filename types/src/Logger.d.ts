export = Logger;
/**
 * Wrapper around Winston
 */
declare class Logger {
    static getLevel(): string;
    static setLevel(level: unknown): void;
    static log(...messages: unknown[]): void;
    static error(...messages: unknown[]): void;
    static warn(...messages: unknown[]): void;
    static verbose(...messages: unknown[]): void;
    static setFileLogging(path: unknown): void;
    static deactivateFileLogging(): void;
    static enablePrettyErrors(): void;
}
