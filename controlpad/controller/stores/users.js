import * as nanostores from "nanostores";
import { cond } from "../util/cond.js";

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
 * @type {nanostores.Atom<Array<User>>}
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
export const $aliveUsers = nanostores.computed($users, (users) =>
  users.filter((u) => u.alive),
);

/**
 * @param {import('../util/action').Action} action
 */
export const reducer = cond([]);
