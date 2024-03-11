import * as nanostores from "nanostores";
import ConnectedComponent from "../util/connected-component.js";
import {$game} from "../stores/game.js";
import Layout from "../components/layout.js";
import m from 'mithril';

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
    onStoreChange(value, oldValue) {
        if (value.connected) {
            m.route.set('/menu');
        }
    }

    /** @param {m.Vnode} vnode */
    view(vnode) {
        return m(Layout, [
            m('h1.f1.tc', "Welcome to The Cult of the Wolf"),
            m('h2.f2.tc', "Joining Server")
        ]);
    }
}