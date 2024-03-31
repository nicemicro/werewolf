import m from "mithril";

/**
 * @typedef ButtonProps
 * @property {(e: MouseEvent) => void} [onclick]
 * @property {HTMLButtonElement['type']} [type='button']
 * @property {boolean} [disabled=false]
 * @property {string} [className]
 */

/** @type {m.Component<ButtonProps>} */
const Button = {
  view(vnode) {
    const { type, disabled, className, ...rest } = vnode.attrs;
    return m(
      `button[type=${type ?? "button"}`,
      {
        disabled: disabled ?? false,
        class: `db ml-auto mr-auto dim br3 ph3 pv2 mt3 white bg-purple b--none ${className ?? ""}`,
        ...rest,
      },
      vnode.children,
    );
  },
};

export default Button;
