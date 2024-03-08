
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