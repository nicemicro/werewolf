/** @typedef {import('nanostores').StoreValue} StoreValue */
import ConnectedComponent from "../util/connected-component.js";
import {$game} from "../stores/game.js";
import Layout from "../components/layout.js";

export default class Joining extends ConnectedComponent {
    store = $game;

    /**
     * @param {StoreValue<typeof $game>}value
     * @param newValue
     */
    onStoreChange(value, newValue) {
        if (this.store.get().connected) {
            m.route.set('/menu');
        }
    }

    view(vnode) {
        return m(Layout, [
            m('h1.f1.tc', "Welcome to The Cult of the Wolf"),
            m('h2.f2.tc', "Joining Server")
        ]);
    }
}