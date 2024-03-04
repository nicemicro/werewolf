import {channel} from "./controlpad.js";
import {Action} from "./util/action.js";
import {dispatch} from "./stores/index.js";

/** @typedef {import('mithril')} M */
const m = /** @type {M.Static} */ window.m;

/**
 * @extends {M.ClassComponent}
 */
export class DebugMenu {
    sendMessage() {
        channel.sendMessage(this.actionFromInput().toString());
    }

    receiveMessage() {
        dispatch(this.actionFromInput());
    }

    actionFromInput() {
        return Action.create(this.type, JSON.parse(this.payload))
    }

    clearInput() {
        this.type = '';
        this.payload = '';
    }

    view(vnode) {
        return m('div.absolute.bottom-0.bg-white-90.w-100.pa3', [
            m('input.db.pa1', {
                value: this.type,
                placeholder: 'Message Type',
                oninput: (e) => this.type = e.target.value
            }),
            m('textarea.db.pa1', {
                value: this.payload,
                placeholder: 'Json Payload',
                oninput: e => {
                    this.payload = e.target.value
                }
            }),
            m('button.pa1', {
                onclick: () => {
                    this.sendMessage()
                }
            }, 'Send Message'),
            m('button.pa1', {
                onclick: () => {
                    this.receiveMessage()
                }
            }, 'Simulate Receive message'),
            m('button.pa1', {
                onclick: () => {
                    this.clearInput()
                }
            }, 'Clear Input'),
        ])
    }
}