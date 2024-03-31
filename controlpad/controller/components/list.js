import m from "mithril";

/**
 * @typedef {Object} IListItem
 * @property {string} text
 * @property {boolean} [selected=false]
 */

/**
 * @typedef ListProps
 * @property {(e: MouseEvent, item: IListItem) => void} [onItemClick]
 * @property {Array<IListItem>} items
 */

/** @type {m.Component<ListProps>} */
const List = {
  view: (vnode) => {
    const { items, onItemClick } = vnode.attrs;
    return m("div.pa4.lh-copy", [
      items.map((item) =>
        m(
          "button",
          {
            class: `f3 fw6 db black link dim pv2 bg-transparent b--none outline-0 light-gray ${item.selected ? "underline" : ""}`,
            /** @param {MouseEvent} e */
            onclick: (e) => onItemClick && onItemClick(e, item),
          },
          item.text,
        ),
      ),
    ]);
  },
};

export default List;
