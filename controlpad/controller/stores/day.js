import {map} from 'https://unpkg.com/nanostores';
import {Action, ActionNames} from "../util/action.js";
import {channel} from "../controlpad.js";

/** @typedef {import('./users').User} User */

/**
 * @typedef {Object} DayStore
 * @property {User | undefined} pickedUser - The user picked for execution in the current day cycle
 */

/**
 * @type {import('nanostores').MapStore<DayStore>}
 */
export const $day = map({
    pickedUser: undefined
});

/**
 * @param {User} user - The user picked by the player
 * @returns {Action<User>}
 */
export const pickUserAction = user => Action.create(ActionNames.P_PICK_USER, user)

/**
 * @param {Action} action
 */
export function reduce(action) {
    const {type, payload} = action;
    switch (type) {
        case ActionNames.P_PICK_USER:
            $day.setKey('pickedUser', /** @type {User} */ payload);
            channel.sendMessage(action.toString());
            break;
    }
}