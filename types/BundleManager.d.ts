export = BundleManager;
/**
 * Handles loading/parsing/initializing all bundles. AKA where the magic happens
 */
declare class BundleManager {
    /**
     * @param {GameState} state
     */
    constructor(path: string, state: GameState);
    state: GameState;
    bundlesPath: string;
    areas: string[];
    loaderRegistry: EntityLoaderRegistry;
    strictMode: boolean;
    bundleRegistrations: Map<string, Map<string, BundleRegistration>>;
    /**
     * Load in all bundles
     */
    loadBundles(distribute?: boolean): Promise<void>;
    /**
     * @param {string} bundle Bundle name
     * @param {string} bundlePath Path to bundle directory
     */
    loadBundle(bundle: string, bundlePath: string): Promise<void>;
    loadQuestGoals(bundle: string, goalsDir: string): void;
    loadQuestRewards(bundle: string, rewardsDir: string): void;
    /**
     * Load attribute definitions
     * @param {string} bundle
     * @param {string} attributesFile
     */
    loadAttributes(bundle: string, attributesFile: string): void;
    /**
     * Load/initialize player. See the {@link http://ranviermud.com/extending/input_events/|Player Event guide}
     * @param {string} bundle
     * @param {string} eventsFile event js file to load
     */
    loadPlayerEvents(bundle: string, eventsFile: string): void;
    /**
    * @param {string} bundle
    */
    loadAreas(bundle: string): Promise<void | []>;
    /**
     * @param {string} bundle
     * @param {string} areaName
     * @param {string} areaPath
     */
    loadArea(bundle: string, areaName: string, manifest: AreaManifest): Promise<void>;
    /**
     * Load an entity (item/npc/room) from file
     * @param {string} bundle
     * @param {string} areaName
     * @param {string} type
     * @param {EntityFactory} factory
     * @return {Array<entityReference>}
     */
    loadEntities(bundle: string, areaName: string, type: string, factory: EntityFactory): Array<entityReference>;
    /**
     * @param {EntityFactory} factory Instance of EntityFactory that the item/npc will be loaded into
     * @param {EntityReference} entityRef
     * @param {string} scriptPath
     */
    loadEntityScript(factory: EntityFactory, entityRef: EntityReference, scriptPath: string): void;
    /**
     * @param {string} areaName
     * @param {string} questsFile
     * @return {Promise<Array<entityReference>>}
     */
    loadQuests(bundle: string, areaName: string): Promise<Array<entityReference>>;
    /**
     * @param {string} bundle
     * @param {string} commandsDir
     */
    loadCommands(bundle: string, commandsDir: string): void;
    /**
     * @param {string} commandPath
     * @param {string} commandName
     * @param {string} bundle
     * @return {Command}
     */
    createCommand(commandPath: string, commandName: string, bundle: string): Command;
    /**
     * @param {string} bundle
     * @param {string} channelsFile
     */
    loadChannels(bundle: string, channelsFile: string): void;
    /**
     * @param {string} bundle
     * @param {string} helpDir
     */
    loadHelp(bundle: string): Promise<void>;
    /**
     * @param {string} bundle
     * @param {string} inputEventsDir
     */
    loadInputEvents(bundle: string, inputEventsDir: string): void;
    /**
     * @param {string} bundle
     * @param {string} behaviorsDir
     */
    loadBehaviors(bundle: string, behaviorsDir: string): void;
    /**
     * @param {string} bundle
     * @param {string} effectsDir
     */
    loadEffects(bundle: string, effectsDir: string): void;
    /**
     * @param {string} bundle
     * @param {string} skillsDir
     */
    loadSkills(bundle: string, skillsDir: string): void;
    /**
     * @param {string} bundle
     * @param {string} serverEventsDir
     */
    loadServerEvents(bundle: string, serverEventsDir: string): void;
    /**
     * For a given bundle js file require check if it needs to be backwards compatibly loaded with a loader(srcPath)
     * or can just be loaded on its own
     * @private
     * @param {function (string)|object|array} loader
     * @return {loader}
     */
    private _getLoader;
    /**
     * @private
     * @param {string} bundle
     * @param {string} areaName
     * @return {string}
     */
    private _getAreaScriptPath;
    _registerOrThrow(registry: string, key: string, bundle: string, source?: string | null): void;
}
import Command = require("./Command");
import EntityFactory = require("./EntityFactory");
import EntityLoaderRegistry = require("./EntityLoaderRegistry");
type EntityReference = string;
import GameState = require("./GameState");
type entityReference = string;
type AreaManifest = {
    title: string;
    metadata?: Record<string, unknown>;
    script?: string | null;
    behaviors?: Record<string, unknown>;
};
type BundleRegistration = {
    bundle: string;
    source: string | null;
};
