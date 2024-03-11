import {map} from 'https://unpkg.com/nanostores';
import {Action, ActionNames} from "../util/action.js";
import {channel} from "../controlpad.js";
import {cond} from "../util/cond.js";

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
 * @return {void}
 */
export const reduce = cond([
    [ActionNames.P_PICK_USER, (action) => {
        $day.setKey('pickedUser', /** @type {User} */ action.payload);
        channel.sendMessage(action.toString());
    }]
])