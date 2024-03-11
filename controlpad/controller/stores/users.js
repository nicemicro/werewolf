import {atom, computed} from 'https://unpkg.com/nanostores';
import {cond} from "../util/cond.js";

/**
 * @interface
 * @property {boolean} alive - If the user is still alive
 */
export class User {
    /**
     * Name submitted by the user
     * @type {string}
     */
    name
    /**
     * If the player is alive
     * @type {boolean}
     */
    alive = true;
}

/**
 * @type {import('nanostores').Atom<Array<User>>}
 */
export const $users = atom([
    {name: 'Nicky', alive: true },
    {name: 'Airam', alive: true },
    {name: 'Safwaan', alive: true},
    {name: 'NiceMicro', alive: true}
]);

/**
 * @type {import('nanostores').ReadableAtom<Array<User>>}
 */
export const $aliveUsers = computed($users, (users) => users.filter(u => u.alive));

/**
 * @param {Action} action
 */
export const reducer = cond([])