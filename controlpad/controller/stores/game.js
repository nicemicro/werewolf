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
 * @property {boolean} everyoneReady
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
  everyoneReady: false,
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
  [ActionNames.G_EVERYONE_READY, () => $game.setKey('everyoneReady', true)],
  [ActionNames.P_PLAY, a => channel.sendMessage(a)],
  /** @param {Action<{ role: Role }>} action */
  [ActionNames.G_ASSIGN_ROLE, a => $game.setKey("role", a.payload.role)]
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
  if (val.everyoneReady === true && oldValue?.everyoneReady === false) {
    m.route.set('/game-start');
  }
})
