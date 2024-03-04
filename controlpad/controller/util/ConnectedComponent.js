/** @typedef {import('mithril')} M */
const m = /** @type {M.Static} */ window.m;

/** @typedef {import('nanostores').Store} Store */

/**
 * Mithril Component for automatically subscribe to a store
 * To use, subclass and override the store prop
 * @example
 * import {$game} from 'stores/game.js';
 * class SomeCmp extends ConnectedComponent {
 *     store = $game
 *
 *     // @override
 *     onStoreChange(store, value, oldValue) {
 *         // ...
 *     }
 * }
 *
 * @template T
 * @extends {M.ClassComponent<T>}
 */
export default class ConnectedComponent {
    /**
     * Store to register on init and to unsubscribe on remove
     * @type {Store}
     */
    store = null;
    /**
     * If the component should call redraw on store update
     * @type {boolean}
     */
    redrawOnChange = true;


    oninit() {
        this._unsubStore = this.store.subscribe((value, oldValue) => {
            if (this.redrawOnChange) {
                m.redraw();
            }
            this.onStoreChange(value, oldValue)
        })
    }

    /**
     * Called on store change
     * @param {unknown} value
     * @param {unknown} newValue
     * @return {void}
     */
    onStoreChange(value, newValue) {
        throw new Error('Not implemented');
    }

    onremove() {
        this._unsubStore();
    }
}