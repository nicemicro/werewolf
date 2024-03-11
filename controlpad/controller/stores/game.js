import {map} from 'https://unpkg.com/nanostores';
import {Action, ActionNames} from "../util/action.js";
import {channel} from "../controlpad.js";
import {cond} from "../util/cond.js";

export const startGameAction = () => Action.create(ActionNames.P_START_GAME)
export const showRulesAction = () => Action.create(ActionNames.P_SHOW_RULES)
export const showCreditsAction = () => Action.create(ActionNames.P_SHOW_CREDITS)

/** @enum {string} */
export const Role = {
    KILLER: 'KILLER',
    VILLAGER: 'VILLAGER',
};

/** @enum {string} */
export const Cycle = {
    DAY: 'DAY',
    NIGHT: 'NIGHT',
};

/** @enum {string} */
export const Hour = {
    WOLF: 'WOLF',
    SHAMAN: 'SHAMAN',
    SEER: 'SEER'
};

/** @enum {string} */
export const GameState = {
    JOIN_GAME: 'joinGame',
    MAIN_MENU: 'mainMenu',
    START_GAME: 'startGame',
}

/**
 * @typedef {Object} GameStore
 * @property {boolean} connected
 * @property {boolean} gameStarted
 * @property {Role} role
 * @property {Object | undefined} pickedUser
 * @property {GameState} gameState
 * @property {Cycle} cycle
 * @property {Hour | undefined} hour
 */

/**
 * @type {import('nanostores').MapStore<GameStore>}
 */
export const $game = map({
    connected: false,
    gameStarted: false,
    role: Role.VILLAGER,
    pickedUser: undefined,
    cycle: Cycle.DAY,
    hour: undefined,
    gameState: GameState.MAIN_MENU
});

/**
 * @param {Action} action
 */
export const reduce = cond([
    [ActionNames.P_CONNECTED, () => $game.setKey('connected', true)],
    [ActionNames.G_STATE_SYNC, ({payload}) => $game.setKey('gameState', payload.gameState)],
    [
        [ActionNames.P_SHOW_RULES, ActionNames.P_SHOW_CREDITS, ActionNames.P_START_GAME],
        a => channel.sendMessage(a.toString()),
    ],
    [ActionNames.G_GAME_STARTED, () => $game.setKey('gameStarted', true)],
])