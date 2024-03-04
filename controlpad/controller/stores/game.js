import {map} from 'https://unpkg.com/nanostores';
import {ActionNames} from "../util/action.js";

/**
 * @template T
 * @typedef {import('nanostores').MapStore<T>} MapStore
 */

/**
 * @typedef GameStore
 * @property {boolean} connected
 */

/**
 * @type {MapStore<GameStore>}
 */
export const $game = map({
    connected: false,
});

/**
 * @param {Action} action
 */
export function dispatch(action) {
    const {type, payload} = action;
    switch (type) {
        case ActionNames.CONNECTED:
            $game.setKey('connected', true);
            break;
    }
}