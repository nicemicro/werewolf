import { $game } from "../stores/game.js";
import { capitalize, subAndRedraw } from "../util/utils.js";
import m from "mithril";

/** @type {m.Component<{ role: string }>} */
const RoleAvatar = {
  view(vnode) {
    const role = vnode.attrs.role.toLowerCase();

    return m("div.tc", [
      m("img.br-100 h3 w3 dib", {
        alt: role,
        src: `/resources/roles/avatars/${role}.jpg`,
      }),
    ]);
  },
};

/**
 * @implements {m.ClassComponent<{}>}
 */
export default class Layout {
  /**
   * Function to unsub from stores
   * @type {Array<() => void>}
   */
  _unsubFn = [];

  /** @type {import('../stores/game').GameStore} */
  gameState = $game.get();

  oninit() {
    this._unsubFn = [subAndRedraw($game, (val) => (this.gameState = val))];
  }

  onremove() {
    this._unsubFn.forEach((f) => f());
  }

  /** @param {m.Vnode} vnode */
  view(vnode) {
    const classNames = [
      "w-100",
      "h-100",
      "flex",
      "flex-column",
      "justify-center",
      "content-center",
      "items-center",
      "border-box",
    ];
    classNames.push(this.gameState.cycle.toLowerCase() + "-gradient");
    return m(
      "div",
      {
        class: classNames.join(" "),
      },
      [
        this.gameState.gameStarted
          ? m("div.w-100.flex-none.flex.flex-row", [
              m("div.flex-auto"),
              this.gameState.role
                ? m(
                  "div.flex-none.pt3.pr3",
                  m(RoleAvatar, { role: this.gameState.role }),
                ) : null,
            ])
          : null,
        m("div.flex-auto"),
        m("div.flex-auto.w-100", vnode.children),
        m("div.flex-auto"),
        this.gameState.gameStarted
          ? m(
              "p.f3.flex-none.mb4",
              `${capitalize(this.gameState.cycle.toLowerCase())} Time`,
            )
          : null,
      ],
    );
  }
}
