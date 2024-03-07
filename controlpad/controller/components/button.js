
/** @type {import('@types/mithril').Static} */
const m = window.m;

/**
 * @typedef {HTMLButtonElement} ButtonProps
 * @property {string} [HTMLButtonElement]
 * @property {(MouseEvent) => void} [onclick]
 */


/** @implements {Component<ButtonProps>} */
const Button = {
    /** @param {import('mithril').Vnode<ButtonProps>} vnode */
    view(vnode) {
        const { type, disabled, className, ...rest} = vnode.attrs;
        return  m(`button[type=${type ?? 'button'}`, {
            disabled: disabled ?? false,
            class: `db ml-auto mr-auto dim br3 ph3 pv2 mt3 white bg-purple b--none ${className ?? ""}`,
            ...rest,
        }, vnode.children)
    }
}

export default Button;