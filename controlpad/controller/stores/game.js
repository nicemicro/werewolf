import * as nanostores from "nanostores";
import { Action, ActionNames } from "../util/action.js";
import channel from "../util/channel.js";
import { cond } from "../util/cond.js";
import m from 'mithril';

export const startGameAction = () =>
  Action.create(ActionNames.P_START_GAME, {});
export const showRulesAction = () =>
  Action.create(ActionNames.P_SHOW_RULES, {});
export const showCreditsAction = () =>
  Action.create(ActionNames.P_SHOW_CREDITS, {});

/** @enum {string} */
export const Role = {
  CULTIST1: "CULTIST1",
  CULTIST2: "CULTIST2",
  VILLAGER: "VILLAGER",
  SEER: "SEER",
  SHAMAN: "SHAMAN",
};

/**
 * @type {Array<Role>}
 * List of roles to keep the Godot Enum for Roles synced easily
 */
export const RoleList = [
  Role.VILLAGER,
  Role.CULTIST1,
  Role.CULTIST2,
  Role.VILLAGER,
  Role.SEER,
  Role.SHAMAN,
]

/** @enum {string} */
export const Cycle = {
  DAY: "DAY",
  NIGHT: "NIGHT",
};

/** @enum {string} */
export const Hour = {
  WOLF: "WOLF",
  SHAMAN: "SHAMAN",
  SEER: "SEER",
};

/** @enum {string} */
export const GameState = {
  JOIN_GAME: "joinGame",
  MAIN_MENU: "mainMenu",
  START_GAME: "startGame",
};

/**
 * @typedef {Object} GameStore
 * @property {boolean} connected
 * @property {boolean} gameStarted
 * @property {boolean} canStart
 * @property {Role | undefined} role
 * @property {Object | undefined} pickedUser
 * @property {GameState} gameState
 * @property {Cycle} cycle
 * @property {Hour | undefined} hour
 */

/**
 * @type {nanostores.MapStore<GameStore>}
 */
export const $game = nanostores.map({
  connected: false,
  gameStarted: false,
  canStart: false,
  role: undefined,
  pickedUser: undefined,
  cycle: Cycle.DAY,
  hour: undefined,
  gameState: GameState.MAIN_MENU,
});

/**
 * @param {Action} action
 */
export const reduce = cond([
  [ActionNames.P_CONNECTED, () => $game.setKey("connected", true)],
  [
    ActionNames.G_STATE_SYNC,
    /** @param {Action<{ gameState: GameState }>} action */
    (action) => $game.setKey("gameState", action.payload.gameState),
  ],
  [
    [
      ActionNames.P_SHOW_RULES,
      ActionNames.P_SHOW_CREDITS,
      ActionNames.P_START_GAME,
    ],
    (a) => channel.sendMessage(a),
  ],
  [ActionNames.G_GAME_STARTED, () => {
    $game.setKey("gameStarted", true)
    $game.setKey("gameState", GameState.JOIN_GAME)
  }],
  [ActionNames.G_CAN_START, () => $game.setKey('canStart', true)],
  [ActionNames.P_START_PLAY, a => channel.sendMessage(a)],
  [ActionNames.G_PLAY, () => $game.setKey('gameState', GameState.START_GAME)],
  [ActionNames.G_ASSIGN_ROLE,
     /** @param {Action<{ role: number }>} a */
    a => $game.setKey("role", RoleList[a.payload.role])
  ],
  [ActionNames.G_SCREEN_SWITCH, handleScreenSwitch]
]);

$game.subscribe((val, oldValue) => {
  if (val.gameState !== oldValue?.gameState) {
    if (val.gameState === GameState.MAIN_MENU) {
      m.route.set('/menu')
    }
    if (val.gameState === GameState.JOIN_GAME) {
      m.route.set('/name-menu')
    }
    return;
  }
  if (val.canStart === true && oldValue?.canStart === false) {
    m.route.set('/game-start');
  }
})

/** @typedef {'night' | 'morning' | 'look up'} ScreenKeys */

/** @type {Record<ScreenKeys, [string, Cycle | undefined]>} */
const TargetScreen = {
  'night': ['/night-time', Cycle.NIGHT],
  'killvote': ['/night-pick', undefined],
  'morning': ['/day-execution', Cycle.DAY],
}


/**
 * 
 * @param {Action<{ switch_to: ScreenKeys }>} action 
 */
function handleScreenSwitch(action) {
  const target = TargetScreen[action.payload.switch_to];
  if (!target) return;

  const [route, cycle] = target;
  // Change cycle if there is a cycle
  if (cycle) {
    $game.setKey('cycle', cycle);
  }
  m.route.set(route);
}

