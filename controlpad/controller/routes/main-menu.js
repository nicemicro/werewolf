import { dispatch } from "../stores/store.js";
import Layout from "../components/layout.js";
import Button from "../components/button.js";
import {
  showCreditsAction,
  showRulesAction,
  startGameAction
} from "../stores/game.js";
import m from "mithril";

/**
 * @extends {m.ClassComponent}
 */
export default class MainMenu {


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
