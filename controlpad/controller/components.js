import {send_msg} from "./controlpad.js";
import {handleWSEvent} from "./store.js";

/** @typedef {import('mithril')} M */
const m = /** @type {M.Static} */ window.m;

/**
 * @extends {M.ClassComponent}
 */
export class DebugMenu {
    sendMessage() {
        send_msg(this.type, JSON.parse(this.payload));
        this.type = '';
        this.payload = '';
    }

    recieveMessage() {
        handleWSEvent(this.type, JSON.parse(this.payload));
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
                    this.recieveMessage()
                }
            }, 'Simulate Receive message'),
        ])
    }
}