import {$game} from "../stores/game.js";
import {capitalize, subAndRedraw} from "../util/utils.js";

/** @typedef {import('nanostores').Store} Store */
const m = /** @type {import('mithril').Static} */ window.m;

const RoleAvatar = {
    view(vnode) {
        const role = /** @type {import('../stores/game').Role} */ vnode.attrs.role.toLowerCase();

        return m('div.tc', [
            m('img.br-100 h3 w3 dib', {
                alt: role,
                src: `/resources/roles/${role}.jpg`,
            })
        ])

    }
}

/**
 * @template Attrs
 * @typedef {import('mithril').ClassComponent<Attrs>} ClassComponent
 */
export default class Layout {
    /**
     * Function to unsub from stores
     * @type {Array<() => void>}
     */
    _unsubFn = [];

    /** @type {import('../stores/game').GameStore} */
    gameState

    oninit() {
        this._unsubFn = [
            subAndRedraw($game, (val) => this.gameState = val)
        ]
    }

    onremove() {
        this._unsubFn.forEach(f => f());
    }

    view(vnode) {
        const classNames = ['w-100', 'h-100', 'flex', 'flex-column', 'justify-center', 'content-center', 'items-center', 'border-box']
        classNames.push(this.gameState.cycle.toLowerCase() + '-gradient');
        return m("div", {
            class: classNames.join(' ')
        }, [
            this.gameState.gameStarted ? m('div.w-100.flex-none.flex.flex-row', [
                m('div.flex-auto'),
                m('div.flex-none.pt3.pr3', m(RoleAvatar, {role: this.gameState.role})),
            ]) : null,
            m('div.flex-auto'),
            m('div.flex-auto.w-100', vnode.children),
            m('div.flex-auto'),
            this.gameState.gameStarted ? m('p.f3.flex-none.mb4', `${capitalize(this.gameState.cycle.toLowerCase())} Time`) : null,
        ])
    }
}