import m from 'mithril';
import * as nanostores from 'nanostores';

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
 * @abstract
 * @template {nanostores.Store} S
 * @extends {m.ClassComponent}
 */
export default class ConnectedComponent {
    /**
     * Store to register on init and to unsubscribe on remove
     * @abstract
     * @type {S}
     */
    // @ts-ignore
    store
    /**
     * If the component should call redraw on store update
     * @type {boolean}
     */
    redrawOnChange = true;

    /** @type {() => void} */
    _unsubStore = () => {};


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
    }

    onremove() {
        this._unsubStore();
    }
}