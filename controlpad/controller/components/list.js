/** @type {import('@types/mithril').Static} */
const m = window.m;

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


/** @implements {Component<ListProps>} */
const List = {
    /** @param {import('mithril').Vnode<ListProps>} vnode */
    view: (vnode) => {
        const { items, onItemClick } = vnode.attrs;
        return m('div.pa4.lh-copy', [
            items.map(item =>
                m('button', {
                    class: `f3 fw6 db black link dim pv2 bg-transparent b--none outline-0 light-gray ${item.selected ? 'underline' : ''}`,
                    onclick: (e) => onItemClick && onItemClick(e, item)
                }, item.text)
            )
        ])
    }
}

export default List;