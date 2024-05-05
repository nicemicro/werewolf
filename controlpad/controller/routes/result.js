import m from "mithril";
import Layout from "../components/layout.js";
import { subAndRedraw } from "../util/utils.js";
import { $game } from "../stores/game.js";

/**
 * Screen used to show result.
 * It's generic and it can be configured with $game.result
 */
export default class Result {
    /** @type {import('../stores/game.js').GameStore} */
    gameState = $game.get();

    /** @type {Array<() => void>} */
    _unsub = [];

    oninit() {
        this._unsub = [
            subAndRedraw($game, g => (this.gameState = g)),
        ];
    }

    onremove() {
        this._unsub.forEach((f) => f());
    }


    view() {
        const { title, description } = this.gameState.result ?? {}
        return m(Layout, [
            m("h1.f1.tc", title),
            m("h3.f3.tc", description),
        ]);

    }
}
