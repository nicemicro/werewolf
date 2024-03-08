
/** @typedef {import('nanostores').Store} Store */

/**
 * Subscribes to the store and call {m.redraw} on every change
 * @template T
 * @param {Store<T>} store
 * @param {(val: import('nanostores').ReadonlyIfObject<T>) => void} cb
 * @return {() => void}
 */
export function subAndRedraw(store, cb) {
    return store.subscribe(val => {
        cb(val)
        m.redraw();
    })
}

/**
 * Capitalized the first letter of each word
 * @param {string} string
 * @return {string}
 */
export function capitalize(string) {
    if (!string || string.length === 0) return '';
    if (string.includes(' ')) {
        return string.split(' ').map(capitalize).join(' ');
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}
