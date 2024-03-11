import List from "../components/list.js";
import Button from "../components/button.js";
import {dispatch} from "../stores/store.js";
import {$aliveUsers} from "../stores/users.js";
import {$day, pickUserAction} from "../stores/day.js";
import {subAndRedraw} from "../util/utils.js";
import Layout from "../components/layout.js";
import m from 'mithril';

/**
 * @typedef {import('../stores/users').User} User
 */

/**
 * @implements {m.ClassComponent}
 */
export default class DayPick {
    /** @type {User | undefined} */
    pickedUser

    /** @type {Array<User>} */
    users = $aliveUsers.get()

    /** @type {import('../stores/day').DayStore} */
    dayState= $day.get()

    /** @type {Array<() => void>} */
    _unsub = [];

    oninit() {
        this._unsub = [
            subAndRedraw($aliveUsers, (val) => this.users = val ),
            subAndRedraw($day, this.onDayStoreChange.bind(this))
        ];
    }

    onremove () { this._unsub.forEach((f => f())); }


    /** @param {import('../stores/day').DayStore} state */
    onDayStoreChange(state) {
        this.dayState = state;
        if (this.dayState.pickedUser) {
            m.route.set('/day-execution');
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
        dispatch(pickUserAction(this.pickedUser))
    }

    resetPick() {
        this.pickedUser = undefined;
    }

    /** @param {m.Vnode} vnode */
    view(vnode) {
        /** @type {Array<import('../components/list').IListItem & User> } */
        const items = this.users.map(i => ({...i, text: i.name}));
        return m(Layout, [
            m('h1.f1.tc', 'A new day comes'),
            m('h3.f3.tc', this.pickedUser ? `You sure ${this.pickedUser.name} is a Killer?` : 'Pick a suspect'),
            this.pickedUser
                ? m.fragment({}, [
                    m(Button, { onclick: () => this.confirmPick() }, 'Yes!!'),
                    m(Button, { onclick: () => this.resetPick() }, 'No'),
                ])
                : m(List, {
                    onItemClick: (e, item) => this.itemClick(e, item),
                    items,
                })
        ])
    }
}


