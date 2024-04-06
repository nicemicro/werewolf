import ConnectedComponent from "../util/connected-component.js";
import { $game } from "../stores/game.js";
import Layout from "../components/layout.js";
import m from "mithril";

/** @typedef {import('../stores/game').GameStore} NameStore */

/**
 * @extends {ConnectedComponent<typeof $game>}
 */
export default class Joining extends ConnectedComponent {
  store = $game;

  /**
   * @param {NameStore} value
   * @param {NameStore} oldValue
   */
  // eslint-disable-next-line no-unused-vars
  onStoreChange(value, oldValue) {
    if (value.connected && !value.debug) {
      m.route.set("/menu");
    }
  }

  view() {
    return m(Layout, [
      m("h1.f1.tc", "Welcome to The Cult of the Wolf"),
      m("h2.f2.tc", "Joining Server"),
    ]);
  }
}
