import {$name, submitNameAction} from "../stores/name.js";
import {DebugMenu} from "../components.js";
import ConnectedComponent from "../util/ConnectedComponent.js";
import {dispatch} from "../stores/index.js";

/**
 * @template Attrs
 * @typedef {import('mithril').ClassComponent<Attrs>} ClassComponent
 */
/**
 * @template Attrs
 * @typedef {import('@types/mithril').Vnode<Attrs>} Vnode
 */
/** @type {import('@types/mithril').Static} */
const m =window.m;

/**
 * @typedef NameFormProps
 * @property {string?} error
 * @property {boolean} loading
 * @property {(string) => void} onSubmit
 */

/**
 * @extends {ClassComponent<NameFormProps>}
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
     * @param {Vnode<NameFormProps>} vnode
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

    /** @param {Vnode<NameFormProps>} vnode */
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

export default class Menu extends ConnectedComponent {
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
        console.log(state);
        return m("div#menu.w-100.h-100.flex.flex-column.justify-center.content-center.items-center.border-box.ph5", [
            m(DebugMenu),
            m('h1.f1', "Welcome to The Cult of the Wolf"),
            state.ready
                ? m(Ready)
                : m(NameForm, { error: state.error, loading: state.submitting, onSubmit: this.onSubmit})

        ])
    }
}

