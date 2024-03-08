import ConnectedComponent from "../util/connected-component.js";
import List from "../components/list.js";
import Button from "../components/button.js";
import {dispatch} from "../stores/index.js";
import {$aliveUsers} from "../stores/users.js";
import {$day, pickUserAction} from "../stores/day.js";
import {subAndRedraw} from "../util/utils.js";
import Layout from "../components/layout.js";

/**
 * @typdef {import('./users').User} User
 */

/**
 * @implements {import('mithril').ClassComponent}
 */
export default class DayPick {
    /** @type {User | undefined} */
    pickedUser

    /** @type {ReadonlyArray<User>} */
    users

    /** @type {import('../stores/day').DayStore} */
    dayState

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
    itemClick(e, item) {
        this.pickedUser = item;
    }

    confirmPick() {
        dispatch(pickUserAction(this.pickedUser))
    }

    resetPick() {
        this.pickedUser = undefined;
    }

    view(vnode) {
        return m(Layout, [
            m('h1.f1.tc', 'A new day comes'),
            m('h3.f3.tc', this.pickedUser ? `You sure ${this.pickedUser.name} is a Killer?` : 'Pick a suspect'),
            this.pickedUser
                ? m.fragment([
                    m(Button, { onclick: () => this.confirmPick() }, 'Yes!!'),
                    m(Button, { onclick: () => this.resetPick() }, 'No'),
                ])
                : m(List, {
                    onItemClick: (e, item) => this.itemClick(e, item),
                    items: this.users.map(i => ({...i, text: i.name}))
            })

        ])
    }
}


