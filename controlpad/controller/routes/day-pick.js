import List from "../components/list.js";
import Button from "../components/button.js";
import { dispatch } from "../stores/store.js";
import { $aliveUsers } from "../stores/users.js";
import { $pick, pickUserAction } from "../stores/pick.js";
import { subAndRedraw } from "../util/utils.js";
import Layout from "../components/layout.js";
import m from "mithril";

/** @typedef {import('../stores/users').User} User */
/**
 * @template T
 * @typedef {import('mithril').ClassComponent<T>} ClassComponent
 */

/**
 * @implements {ClassComponent<{}>}
 */
export default class DayPick {
  /** @type {User | undefined} */
  pickedUser;

  /** @type {Array<User>} */
  users = $aliveUsers.get();

  /** @type {import('../stores/pick.js').PickStore} */
  pickState = $pick.get();

  /** @type {Array<() => void>} */
  _unsub = [];

  oninit() {
    this._unsub = [
      subAndRedraw($aliveUsers, (val) => (this.users = val)),
      subAndRedraw($pick, this.onPickStoreChange.bind(this)),
    ];
  }

  onremove() {
    this._unsub.forEach((f) => f());
  }

  /** @param {import('../stores/pick.js').PickStore} state */
  onPickStoreChange(state) {
    this.pickState = state;
    if (this.pickState.pickedUser) {
      m.route.set("/day-execution");
    }
  }

  /**
   *
   * @param {MouseEvent} e
   * @param {import('../components/list').IListItem} item
   */
  itemClick(e, item) {
    this.pickedUser = /** @type {User} */ (/** @type {unknown} */ (item));
  }

  confirmPick() {
    if (!this.pickedUser) return;
    dispatch(pickUserAction(this.pickedUser));
  }

  resetPick() {
    this.pickedUser = undefined;
  }

  view() {
    /** @type {Array<import('../components/list').IListItem & User> } */
    const items = this.users.map((i) => ({ ...i, text: i.name }));
    return m(Layout, [
      m("h1.f1.tc", "A new day comes"),
      m(
        "h3.f3.tc",
        this.pickedUser
          ? `You sure ${this.pickedUser.name} is a Killer?`
          : "Pick a suspect",
      ),
      this.pickedUser
        ? m.fragment({}, [
          m(Button, { onclick: () => this.confirmPick() }, "Yes!!"),
          m(Button, { onclick: () => this.resetPick() }, "No"),
        ])
        : m(List, {
          className: ["flex",
            "flex-column",
            "justify-center",
            "content-center",
            "items-center",].join(' '),
          onItemClick: (e, item) => this.itemClick(e, item),
          items,
        }),
    ]);
  }
}
