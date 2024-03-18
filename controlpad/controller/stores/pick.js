import * as nanostores from "nanostores";
import { Action, ActionNames } from "../util/action.js";
import channel from "../util/channel.js";
import { cond } from "../util/cond.js";

/** @typedef {import('./users.js').User} User */

/**
 * @typedef {Object} PickStore
 * @property {User | undefined} pickedUser - The user picked for execution in the current day cycle
 */

/**
 * @type {nanostores.MapStore<PickStore>}
 */
export const $pick = nanostores.map({
  pickedUser: undefined,
});

/**
 * @param {User} user - The user picked by the player
 * @returns {Action<User>}
 */
export const pickUserAction = (user) =>
  Action.create(ActionNames.P_PICK_USER, user);

/**
 * @param {Action} action
 * @return {void}
 */
export const reduce = cond([
  [
    ActionNames.P_PICK_USER,
    /** @param {Action<User>} action */
    (action) => {
      $pick.setKey("pickedUser", action.payload);
      channel.sendMessage(action);
    },
  ] , [
    // Clear picks on new screen
    ActionNames.G_SCREEN_SWITCH,
    () => $pick.setKey('pickedUser', undefined)
  ],
]);
