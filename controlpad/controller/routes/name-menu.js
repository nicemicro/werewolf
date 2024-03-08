import {$name, submitNameAction} from "../stores/name.js";
import {DebugMenu} from "../components/debug-menu.js";
import ConnectedComponent from "../util/connected-component.js";
import {dispatch} from "../stores/index.js";
import Layout from "../components/layout.js";


/** @type {import('@types/mithril').Static} */
const m = window.m;

/**
 * @typedef NameFormProps
 * @property {string|undefined} error
 * @property {boolean} loading
 * @property {(string) => void} onSubmit - Called when the form is valid and submit is clicked
 */

/**
 * @implements {{import('@types/mithril').ClassComponent<NameFormProps>}
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

    /**
     * @param {import('@types/mithril').Vnode<NameFormProps>} vnode
     * @param {SubmitEvent} e
     */
    submitName(vnode, e) {
        e.preventDefault();
        /** @type {HTMLFormElement} */
        const form = e.target;
        if (form.checkValidity()) {
            vnode.attrs.onSubmit(this.name)
        }
    }

    /**
     * @override
     * @param {import('@types/mithril').Vnode<NameFormProps>} vnode
     */
    view(vnode) {
        return m.fragment({}, [
            vnode.attrs.error
                ? m('span', vnode.attrs.error)
                : [],
            m('form.mt3', {onsubmit: (e) => this.submitName(vnode, e)}, [
                m("input#name[name='name']", {
                    required: true,
                    disabled: vnode.attrs.loading,
                    minlength: 3,
                    pattern: "[a-zA-Z]+",
                    class: 'white pa2 db bg-transparent outline-0 f3 bb bw1 b--mid-gray bl-0 bt-0 br-0 ml-auto mr-auto',
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

export default class NameMenu extends ConnectedComponent {
    store = $name;

    /**
     * @param {StoreValue<typeof $game>}value
     * @param newValue
     */
    onStoreChange(value, newValue) {
    }

    /** @param {string} name */
    onSubmit(name) {
        dispatch(submitNameAction(name));
    }

    view(vnode) {
        const state = $name.get();
        return m(Layout, m('div.ph5', [
            m('h1.f1.tc', "Welcome to The Cult of the Wolf"),
            state.ready
                ? m(Ready)
                : m(NameForm, { error: state.error, loading: state.submitting, onSubmit: this.onSubmit})

        ]))
    }
}

