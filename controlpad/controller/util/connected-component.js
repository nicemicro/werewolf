/** @type {import('mithril').Static} */
const m = window.m;

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
 * @template S
 * @extends {import('mithril').ClassComponent}
 */
export default class ConnectedComponent {
    /**
     * Store to register on init and to unsubscribe on remove
     * @type {S}
     */
    store
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
     * @param  {unknown} oldValue
     * @return {void}
     */
    onStoreChange(value, oldValue) {
        throw new Error('Not implemented');
    }

    onremove() {
        this._unsubStore();
    }
}