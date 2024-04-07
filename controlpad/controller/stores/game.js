import * as nanostores from "nanostores";
import { Action, ActionNames } from "../util/action.js";
import channel from "../util/channel.js";
import { cond } from "../util/cond.js";
import m from 'mithril';
import { dispatch } from "./store.js";
import { submitNameAction } from "./name.js";

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
 * @property {boolean} debug
 * @property {boolean} connected
 * @property {boolean} gameStarted
 * @property {boolean} canStart
 * @property {boolean} dead
 * @property {Role | undefined} role
 * @property {string} partner Name of the other cultist in case you are one
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
  debug: false,
  gameStarted: false,
  canStart: false,
  dead: false,
  role: undefined,
  partner: undefined,
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
    /** @param {Action<{ gameState: GameState, name?:string, canStart?: boolean }>} action */
    (action) => {
      const { name, canStart = false, gameState} = action.payload
      $game.setKey("gameState", gameState);
      $game.setKey("canStart", canStart);

    }
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
  [ActionNames.G_SCREEN_SWITCH, handleScreenSwitch],
]);

$game.subscribe((val, oldValue) => {
  if (val.debug || val.dead) return;
  if (val.gameState !== oldValue?.gameState) {
    if (val.gameState === GameState.MAIN_MENU) {
      m.route.set('/menu')
    }
    if (val.gameState === GameState.JOIN_GAME) {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const name = params.get('debugName')
      if (typeof name !== 'undefined' && name !== null) {
          dispatch(submitNameAction(name));
      }
      m.route.set('/name-menu')
    }
    return;
  }
  if (val.canStart === true && oldValue?.canStart === false) {
    m.route.set('/game-start');
  }
})

/** @typedef {'night' | 'morning' | 'killvote' | 'death' | 'look up'} ScreenKeys */

/** @type {Record<ScreenKeys, [string, Cycle | undefined]>} */
const TargetScreen = {
  'night': ['/night-time', Cycle.NIGHT],
  'killvote': ['/night-pick', undefined],
  'morning': ['/day-pick', Cycle.DAY],
  'death': ['/dead', Cycle.NIGHT],
  'look up': ['/look-up', Cycle.NIGHT],
}

/**
 * 
 * @param {Action<{ switch_to: ScreenKeys, partner?: string }>} action 
 */
function handleScreenSwitch(action) {
  const { switch_to, partner} = action.payload 
  const target = TargetScreen[switch_to];
  
  if (switch_to === 'death') {
    $game.setKey('dead', true);
  }

  if (typeof partner === 'string') {
    $game.setKey('partner', partner);
  }

  if (!target) return;

  const [route, cycle] = target;
  // Change cycle if there is a cycle
  if (cycle) {
    $game.setKey('cycle', cycle);
  }
  m.route.set(route);
}

