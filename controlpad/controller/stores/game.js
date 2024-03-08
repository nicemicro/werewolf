import {map} from 'https://unpkg.com/nanostores';
import {Action, ActionNames} from "../util/action.js";
import {channel} from "../controlpad.js";

export const startGameAction = () => Action.create(ActionNames.P_START_GAME)
export const showRulesAction = () => Action.create(ActionNames.P_SHOW_RULES)
export const showCreditsAction = () => Action.create(ActionNames.P_SHOW_CREDITS)

/**
 * @typedef {Object} GameStore
 * @property {boolean} connected
 * @property {boolean} gameStarted
 */

/**
 * @type {import('nanostores').MapStore<GameStore>}
 */
export const $game = map({
    connected: false,
    gameStarted: false,
});

/**
 * @param {Action} action
 */
export function dispatch(action) {
    const {type, payload} = action;
    switch (type) {
        case ActionNames.P_CONNECTED:
            $game.setKey('connected', true);
            break;
        case ActionNames.P_SHOW_RULES:
        case ActionNames.P_SHOW_CREDITS:
        case ActionNames.P_START_GAME:
            channel.sendMessage(action.toString());
            break;
        case ActionNames.G_GAME_STARTED:
            $game.setKey('gameStarted', true);
    }
}