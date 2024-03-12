import { $name, submitNameAction } from "../stores/name.js";
import ConnectedComponent from "../util/connected-component.js";
import { dispatch } from "../stores/store.js";
import Layout from "../components/layout.js";
import m from "mithril";

/**
 * @typedef NameFormProps
 * @property {string|undefined} error
 * @property {boolean} loading
 * @property {(name: string) => void} onSubmit - Called when the form is valid and submit is clicked
 */

/**
 * @implements {m.ClassComponent<NameFormProps>}
 */
class NameForm {
  /** @type {string | undefined} Used to store the name before server validation */
  name = undefined;

  /** @param {Omit<Event, 'target'> & { target: HTMLInputElement }} e */
  onNameChange(e) {
    const input = e.target;
    if (!input) return;
    if (input.validity.patternMismatch) {
      input.setCustomValidity(
        "The name must contain only letters and at least 3 characters",
      );
    }
    this.name = input.value;
  }

  /**
   * @param {m.Vnode<NameFormProps>} vnode
   * @param {Omit<SubmitEvent, 'target'> & { target: HTMLFormElement }} e
   */
  submitName(vnode, e) {
    e.preventDefault();
    const form = e.target;
    if (form && form.checkValidity() && this.name) {
      vnode.attrs.onSubmit(this.name);
    }
  }

  /**
   * @param {m.Vnode<NameFormProps>} vnode
   */
  view(vnode) {
    return m.fragment({}, [
      vnode.attrs.error ? m("span", vnode.attrs.error) : [],
      m(
        "form.mt3",
        {
          /** @param {Omit<SubmitEvent, 'target'> & { target: HTMLFormElement }} e */
          onsubmit: (e) => this.submitName(vnode, e),
        },
        [
          m("input#name[name='name']", {
            required: true,
            disabled: vnode.attrs.loading,
            minlength: 3,
            pattern: "[a-zA-Z]+",
            class:
              "white pa2 db bg-transparent outline-0 f3 bb bw1 b--mid-gray bl-0 bt-0 br-0 ml-auto mr-auto",
            placeholder: "Please enter your name",
            /** @param {Omit<Event, 'target'> & { target: HTMLInputElement }} e */
            oninput: (e) => this.onNameChange(e),
          }),
          m(
            "button[type='submit']",
            {
              disabled: vnode.attrs.loading,
              class:
                "link db ml-auto mr-auto dim br3 ph3 pv2 mt3 white bg-purple b--none",
            },
            "I'm Ready",
          ),
        ],
      ),
    ]);
  }
}

/** @type {m.Component} */
const Ready = {
  view: () => {
    return m("h2.f2.tc", "Waiting for other players");
  },
};

/** @typedef {import('../stores/name').NameStore} NameStore */

/** @extends {ConnectedComponent<typeof $name>} */
export default class NameMenu extends ConnectedComponent {
  store = $name;

  /** @param {string} name */
  onSubmit(name) {
    dispatch(submitNameAction(name));
  }

  view() {
    const state = $name.get();
    return m(
      Layout,
      m("div.ph5", [
        m("h1.f1.tc", "Welcome to The Cult of the Wolf"),
        state.ready
          ? m(Ready)
          : m(NameForm, {
              error: state.error,
              loading: state.submitting,
              onSubmit: this.onSubmit,
            }),
      ]),
    );
  }
}
