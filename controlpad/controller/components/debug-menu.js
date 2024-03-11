import channel from "../util/channel.js";
import {Action} from "../util/action.js";
import {dispatch} from "../stores/store.js";
import m from 'mithril';

/**
 * @template Attrs
 * @typedef {import('mithril').ClassComponent<Attrs>} ClassComponent
 */

/**
 * @extends {m.ClassComponent}
 */
export class DebugMenu {
    type = '';
    payload = '';

    sendMessage() {
        channel.sendMessage(this.actionFromInput());
    }

    receiveMessage() {
        dispatch(this.actionFromInput());
    }

    actionFromInput() {
        return Action.create(/** @type {import('../util/action').ActionNames} */ this.type, JSON.parse(this.payload))
    }

    clearInput() {
        this.type = '';
        this.payload = '';
    }

    /**
     * @param {m.Vnode} vnode
     */
    view(vnode) {
        return m('div.absolute.bottom-0.bg-white-90.w-100.pa3', [
            m('input.db.pa1', {
                value: this.type,
                placeholder: 'Message Type',
                /** @param {Event & { target: HTMLInputElement}} e */
                oninput: (e) => this.type = e.target.value
            }),
            m('textarea.db.pa1', {
                value: this.payload,
                placeholder: 'Json Payload',
                /** @param {Event & { target: HTMLTextAreaElement}} e */
                oninput: e => { this.payload = e.target.value }
            }),
            m('button.pa1', {
                onclick: () => this.sendMessage()
            }, 'Send Message'),
            m('button.pa1', {
                onclick: () => this.receiveMessage()
            }, 'Simulate Receive message'),
            m('button.pa1', {
                onclick: () => this.clearInput()
            }, 'Clear Input'),
        ])
    }
}