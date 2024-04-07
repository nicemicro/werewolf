import * as nanostores from "nanostores";
import { cond } from "../util/cond.js";
import { ActionNames } from "../util/action.js";
import { $name } from "./name.js";

/** 
 * @template {{ [x: string]: any }} T 
 * @typedef {import('../util/action.js').Action<T>} Action
 */

/**
 * @interface
 * @property {boolean} alive - If the user is still alive
 */
export class User {
  /**
   * Name submitted by the user
   * @type {string}
   */
  name = "";
  /**
   * If the player is alive
   * @type {boolean}
   */
  alive = true;
}

/**
 * @type {nanostores.WritableAtom<Array<User>>}
 */
export const $users = nanostores.atom([
  { name: "Nicky", alive: true },
  { name: "Airam", alive: true },
  { name: "Safwaan", alive: true },
  { name: "NiceMicro", alive: true },
]);

/**
 * @type {nanostores.ReadableAtom<Array<User>>}
 */
export const $aliveUsers = nanostores.computed([$users, $name], (users, name) =>
  users.filter((u) => u.alive && u.name !== name.name),
);


/**
 * @param {import('../util/action').Action} action
 */
export const reducer = cond([
  [
    ActionNames.G_SCREEN_SWITCH,
    /** @param {Action<{ players: string[] }>} action */
    (action) => $users.set(action.payload.players.map(a => ({ name: a, alive: true})))
  ]
]);
