import {$name, submitNameAction} from "../store.js";
import {DebugMenu} from "../components.js";

/** @typedef {import('mithril')} M */
const m = /** @type {M.Static} */ window.m;

/**
 * @extends {M.ClassComponent<{ error?: string, loading?: boolean}>}
 */
class NameForm {
    /** @type {string | undefined} Used to store the name before server validation */
    name = undefined

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
        }
    }

    view(vnode) {
        return m.fragment({}, [
            vnode.attrs.error
                ? m('span', vnode.attrs.error)
                : [],
            m('form.mt3', {onsubmit: (e) => this.submitName(e)}, [
                m("input#name[name='name']", {
                    required: true,
                    disabled: vnode.attrs.loading,
                    minlength: 3,
                    pattern: "[a-zA-Z]+",
                    class: 'white pa2 db bg-transparent outline-0 f3 bb bw1 b--mid-gray bl-0 bt-0 br-0  ',
                    placeholder: "Please enter your name",
                    oninput: (e) => this.onNameChange(e)
                }),
                m("button[type='submit']", {
                    disabled: vnode.attrs.loading,
                    class: 'link db ml-auto mr-auto dim br3 ph3 pv2 mt3 white bg-purple b--none',
                }, "I'm Ready")
            ])
        ])
    }
}

const Ready = {
    view: (vnode) => {
        return m('h2.f2', 'Waiting for other players')
    }
}

/**
 * @extends {M.ClassComponent}
 */
export default class Menu {


    oninit() {
        this.storeUnsub = $name.subscribe(() => m.redraw());
    }
    onremove() {
        this.storeUnsub();
    }

    view(vnode) {
        const state = $name.get();
        return m("div#menu.w-100.h-100.flex.flex-column.justify-center.content-center.items-center.border-box.ph5", [
            m(DebugMenu),
            m('h1.f1', "Welcome to The Cult of the Wolf"),
            state.ready
                ? m(Ready)
                : m(NameForm, { error: state.error, loading: state.submitting})

        ])
    }
}

