import ConnectedComponent from "../util/connected-component.js";
import { dispatch } from "../stores/store.js";
import Layout from "../components/layout.js";
import Button from "../components/button.js";
import {
  $game,
  showCreditsAction,
  showRulesAction,
  startGameAction,
} from "../stores/game.js";
import m from "mithril";

/** @typedef {import('../stores/game').GameStore} GameStore */

/**
 * @extends {ConnectedComponent<typeof $game>}
 */
export default class MainMenu extends ConnectedComponent {
  store = $game;

  /**
   * @param {GameStore} value
   * @param  {GameStore} oldValue
   * @return {void}
   */
  // eslint-disable-next-line no-unused-vars
  onStoreChange(value, oldValue) {
    if (value.gameStarted) {
      m.route.set("/name-menu");
    }
  }

  onStart() {
    dispatch(startGameAction());
  }

  onShowRules() {
    dispatch(showRulesAction());
  }

  onShowCredits() {
    dispatch(showCreditsAction());
  }

  view() {
    return m(Layout, [
      m("h1.f1.tc", "Welcome to The Cult of the Wolf"),
      m("div.tc", [
        m(Button, { onclick: this.onStart }, "Start Game"),
        m(Button, { onclick: this.onShowRules }, "Rules"),
        m(Button, { onclick: this.onShowCredits }, "Credits"),
      ]),
    ]);
  }
}
