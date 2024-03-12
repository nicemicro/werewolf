import m from "mithril";

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
 * @abstract
 * @template {Store} S
 * @extends {m.ClassComponent}
 */
export default class ConnectedComponent {
  /**
   * Store to register on init and to unsubscribe on remove
   * @abstract
   * @type {S} store
   */
  // @ts-expect-error Initialized in child
  store;
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
      this.onStoreChange(value, oldValue);
    });
  }

  /**
   * Called on store change
   * @param {unknown} value
   * @param  {unknown} oldValue
   * @return {void}
   */
  // eslint-disable-next-line no-unused-vars
  onStoreChange(value, oldValue) {}

  onremove() {
    this._unsubStore();
  }
}
