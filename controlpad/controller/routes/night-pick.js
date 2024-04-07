import List from "../components/list.js";
import Button from "../components/button.js";
import { dispatch } from "../stores/store.js";
import { $aliveUsers } from "../stores/users.js";
import { $pick, pickUserAction } from "../stores/pick.js";
import { subAndRedraw } from "../util/utils.js";
import Layout from "../components/layout.js";
import m from "mithril";
import { $game, Role } from "../stores/game.js";

/** @type {Record<Role, string>} */
const RoleMsg = {
  [Role.CULTIST1]: 'Pick a sacrifice to the Wolf.',
  [Role.CULTIST2]: 'Pick a sacrifice to the Wolf.',
  [Role.VILLAGER]: '', // This case is not possible
  [Role.SEER]: 'Pick a person and the spirits will tell you if they worships the Wolf',
  [Role.SHAMAN]: 'Pick a person so that nature heals their wounds',
}

/**
 * @typedef {import('../stores/users.js').User} User
 */

/**
 * @implements {m.ClassComponent}
 */
export default class NightPick {
  /** @type {boolean} */
  waiting = false
  /** @type {User | undefined} */
  pickedUser;

  /** @type {Array<User>} */
  users = $aliveUsers.get();

  /** @type {import('../stores/game.js').GameStore} */
  gameState = $game.get();

  /** @type {import('../stores/pick.js').PickStore} */
  dayState = $pick.get();

  /** @type {Array<() => void>} */
  _unsub = [];

  oninit() {
    this._unsub = [
      subAndRedraw($aliveUsers, (val) => (this.users = val)),
      subAndRedraw($pick, this.onPickStoreChange.bind(this)),
      subAndRedraw($game, g => (this.gameState = g)),
    ];
  }

  onremove() {
    this._unsub.forEach((f) => f());
  }

  /** @param {import('../stores/pick.js').PickStore} state */
  onPickStoreChange(state) {
    this.dayState = state;
    if (this.dayState.pickedUser) {
      this.waiting = true;
    }
  }

  /**
   * @param {MouseEvent} e
   * @param {import('../components/list.js').IListItem} item
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
    const { role, partner } = this.gameState;
    const isCultist = role === Role.CULTIST1 || role === Role.CULTIST2;
    let users = this.users;
    if (isCultist) {
      users = users.filter(u => u.name !== partner);
    }

    /** @type {Array<import('../components/list.js').IListItem & User> } */
    const items = users.map((i) => ({ ...i, text: i.name }));
    return m(Layout, [
      m("h1.f1.tc", "Night Comes ..."),
      !this.waiting ? [
        m(
          "h3.f3.tc",
          this.pickedUser
            ? `You sure you want to pick ${this.pickedUser.name}?`
            : RoleMsg[/** @type {string} */ (this.gameState.role)],
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
          })
      ] : null,
    ]);
  }
}
