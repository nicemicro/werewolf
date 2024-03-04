// @ts-check
import Menu from "./routes/menu.js";
import {$game} from "./stores/game.js";
import ConnectedComponent from "./util/ConnectedComponent.js";

/** @typedef {import('nanostores').StoreValue} StoreValue */

class Joining extends ConnectedComponent {
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

    view() {
        return m("div#menu.w-100.h-100.flex.flex-column.justify-center.content-center.items-center.border-box.ph5", [
            m('h1.f1.tc', "Welcome to The Cult of the Wolf"),
            m('h2.f2.tc', "Joining Server")
        ]);
    }
}


m.route(document.getElementById("werewolfapp"), "/", {
    '/': Joining,
    "/menu": Menu,
})