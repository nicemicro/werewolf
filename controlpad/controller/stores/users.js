import {atom, computed} from 'https://unpkg.com/nanostores';

/**
 * @typedef {Object} User
 * @property {string} name - User picked name
 * @property {boolean} alive - If the user is still alive
 */


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
export function dispatch(action) {
    const {type, payload} = action;
    switch (type) {
    }
}