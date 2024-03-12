import Layout from "../components/layout.js";
import m from "mithril";
import Button from "../components/button.js";
import channel from "../util/channel.js";
import {$game} from '../stores/game.js';
import { Action, ActionNames } from "../util/action.js";
import ConnectedComponent from "../util/connected-component.js";

/**
 * @extends {ConnectedComponent<typeof $game>}
 */
export default class GameStart extends ConnectedComponent {
  store = $game;

  onPlay() {
    channel.sendMessage(Action.create(ActionNames.P_PLAY, {}))
  }
  view() {
    const role = $game.get().role;
    return m(Layout, role
      ? m('img', { src: `/resources/roles/${role.toLowerCase()}.jpg`, alt: role})
      : [
        m("h1.f1.tc", "Welcome to The Cult of the Wolf"),
        m("h3.f3.tc", "Everyone is ready, hit play to start the first round"),
        m(Button, { onclick: () => this.onPlay() }, 'Play')
      ]
    );
  }
}
