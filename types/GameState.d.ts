import AccountManager = require("./AccountManager");
import AreaFactory = require("./AreaFactory");
import AreaManager = require("./AreaManager");
import AttributeFactory = require("./AttributeFactory");
import BehaviorManager = require("./BehaviorManager");
import ChannelManager = require("./ChannelManager");
import CommandManager = require("./CommandManager");
import Config = require("./Config");
import Data = require("./Data");
import DataSourceRegistry = require("./DataSourceRegistry");
import EffectFactory = require("./EffectFactory");
import EntityLoaderRegistry = require("./EntityLoaderRegistry");
import EventManager = require("./EventManager");
import GameServer = require("./GameServer");
import HelpManager = require("./HelpManager");
import ItemFactory = require("./ItemFactory");
import ItemManager = require("./ItemManager");
import MobFactory = require("./MobFactory");
import MobManager = require("./MobManager");
import PartyManager = require("./PartyManager");
import PlayerManager = require("./PlayerManager");
import QuestFactory = require("./QuestFactory");
import QuestGoalManager = require("./QuestGoalManager");
import QuestRewardManager = require("./QuestRewardManager");
import RoomFactory = require("./RoomFactory");
import RoomManager = require("./RoomManager");
import SkillManager = require("./SkillManager");

/**
 * Canonical downstream server state container used throughout Ranvier.
 */
type GameState = {
    AccountManager: InstanceType<typeof AccountManager>;
    AreaBehaviorManager: InstanceType<typeof BehaviorManager>;
    AreaFactory: InstanceType<typeof AreaFactory>;
    AreaManager: InstanceType<typeof AreaManager>;
    AttributeFactory: InstanceType<typeof AttributeFactory>;
    ChannelManager: InstanceType<typeof ChannelManager>;
    CommandManager: InstanceType<typeof CommandManager>;
    Config: typeof Config;
    DataLoader: typeof Data;
    DataSourceRegistry: InstanceType<typeof DataSourceRegistry>;
    EffectFactory: InstanceType<typeof EffectFactory>;
    EntityLoaderRegistry: InstanceType<typeof EntityLoaderRegistry>;
    GameServer: InstanceType<typeof GameServer>;
    HelpManager: InstanceType<typeof HelpManager>;
    InputEventManager: InstanceType<typeof EventManager>;
    ItemBehaviorManager: InstanceType<typeof BehaviorManager>;
    ItemFactory: InstanceType<typeof ItemFactory>;
    ItemManager: InstanceType<typeof ItemManager>;
    MobBehaviorManager: InstanceType<typeof BehaviorManager>;
    MobFactory: InstanceType<typeof MobFactory>;
    MobManager: InstanceType<typeof MobManager>;
    PartyManager: InstanceType<typeof PartyManager>;
    PlayerManager: InstanceType<typeof PlayerManager>;
    QuestFactory: InstanceType<typeof QuestFactory>;
    QuestGoalManager: InstanceType<typeof QuestGoalManager>;
    QuestRewardManager: InstanceType<typeof QuestRewardManager>;
    RoomBehaviorManager: InstanceType<typeof BehaviorManager>;
    RoomFactory: InstanceType<typeof RoomFactory>;
    RoomManager: InstanceType<typeof RoomManager>;
    ServerEventManager: InstanceType<typeof EventManager>;
    SkillManager: InstanceType<typeof SkillManager>;
    SpellManager: InstanceType<typeof SkillManager>;
};

export = GameState;
