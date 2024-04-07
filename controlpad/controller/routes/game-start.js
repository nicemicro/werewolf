import Layout from "../components/layout.js";
import m from "mithril";
import Button from "../components/button.js";
import channel from "../util/channel.js";
import {$game, Role} from '../stores/game.js';
import { Action, ActionNames } from "../util/action.js";
import ConnectedComponent from "../util/connected-component.js";

/** @type {Record<Role, [string, string]>} */
const RoleMsg = {
  [Role.CULTIST1]: [
    'a worshipper of the Wolf.',
    "When night comes you and your partner will pick your victim. Be sure that no one find out who your god is."
  ],
  [Role.CULTIST2]: [
    'a worshipper of the Wolf.',
    "When night comes your partner and you will pick your victim. Be sure that no one find out who your god is."
  ],
  [Role.VILLAGER]: [
    'a regular villager.',
    "Your village has been picked by the Wolf worshippers. Come morning you'll and the other villagers will pick a suspect and execute him."
  ],
  [Role.SEER]: [
    'a Seer',
    "At night vision come to you. You can ask the visions if someones follows the Wolf, and the visions will tell you the truth."
  ],
  [Role.SHAMAN]: [
    'a Seer',
    "At night spirits warn of someone in need. You can visit someone in the hopes of healing them after the cultist attack."
  ],
}

/**
 * @extends {ConnectedComponent<typeof $game>}
 */
export default class GameStart extends ConnectedComponent {
  store = $game;

  onPlay() {
    channel.sendMessage(Action.create(ActionNames.P_START_PLAY, {}))
  }
  view() {
    // TODO check if this should be the condition, or if GAME_STARTED
    const role = $game.get().role;
    return m(Layout, role
      ? m('div.pa4', [
        m('h3.f3.tc.mb3', `You are a ${RoleMsg[role][0]}`),
        m('p.f4.tc.mb3', RoleMsg[role][1]),
        m('img.mb3', { src: `/resources/roles/${role.toLowerCase()}.jpg`, alt: role})
      ]) : [
        m("h1.f1.tc", "Welcome to The Cult of the Wolf"),
        m("h3.f3.tc", "Everyone is ready, hit play to start the first round"),
        m(Button, { onclick: () => this.onPlay() }, 'Play')
      ]
    );
  }
}
