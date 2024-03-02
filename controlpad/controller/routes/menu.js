import {$name, submitNameAction} from "../store.js";

/** @typedef {import('mithril')} M */
const m = /** @type {M.Static} */ window.m;

/**
 * @extends {M.ClassComponent}
 */
export default class Menu {
    /** @type {string | undefined} Used to store the name before server validation */
    name = undefined
    /** @type {boolean} */
    loading = false

    /** @type {boolean} */
    disabled = false

    oninit() {
        this.storeUnsub = $name.subscribe(() => m.redraw());
    }
    onremove() {
        this.storeUnsub();
    }

    /** @param {InputEvent} e */
    onNameChange(e) {
        const input = /** @type {HTMLInputElement} */ e.target;
        if (input.validity.patternMismatch) {
           input.setCustomValidity('The name must contain only letters and at least 3 characters');
        }
        this.name = e.target.value
    }

    /** @param {SubmitEvent} e */
    submitName(e) {
        e.preventDefault();
        /** @type {HTMLFormElement} */
        const form = e.target;
        if (form.checkValidity()) {
            this.loading = true;
            submitNameAction(this.name);
            return;
        }
    }

    view(vnode) {
        const state = $name.get();
        const ui = vnode.state;
        const disabled = this.loading || this.disabled;
        return m("div#menu.w-100.h-100.flex.flex-column.justify-center.content-center.items-center.border-box.ph5", [
            m('h1.welcome', "Welcome to The Cult of the Wolf"),
            state.error
                ? m('span', state.error)
                : [],
            m('form.mt3', { onsubmit: (e) => this.submitName(e) }, [
                m("input#name[name='name']", {
                    required: true,
                    disabled,
                    minlength: 3,
                    pattern: "[a-zA-Z]+",
                    class: 'white pa2 db bg-transparent outline-0 f3 bb bw1 b--mid-gray bl-0 bt-0 br-0  ',
                    placeholder: "Please enter your name",
                    oninput: (e) => this.onNameChange(e)
                }),
                m("button[type='submit']", {
                    disabled,
                    class: 'link db ml-auto mr-auto dim br3 ph3 pv2 mt3 white bg-purple b--none',
                }, "I'm Ready")
            ])
        ])
    }
}

