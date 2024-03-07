import {$name} from "../stores/name.js";
import {$game} from "../stores/game.js";

/** @typedef {import('nanostores').Store} Store */
const m = /** @type {import('mithril').Static} */ window.m;

/**
 * @template Attrs
 * @typedef {import('mithril').ClassComponent<Attrs>} ClassComponent
 */
export default class Layout {
    /**
     * Function to unsub from stores
     * @type {Array<() => void>}
     */
    unsubFn = [];

    oninit() {
        this.unsubFn = [
            $game.subscribe(() => m.redraw()),
            $name.subscribe(() => m.redraw),
        ]
    }

    onremove() {
        this.unsubFn.forEach(f => f());
    }

    view(vnode) {
        return m("div#menu.w-100.h-100.flex.flex-column.justify-center.content-center.items-center.border-box.ph5", vnode.children)
    }
}