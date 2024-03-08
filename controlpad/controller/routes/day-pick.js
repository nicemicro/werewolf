import ConnectedComponent from "../util/connected-component.js";
import List from "../components/list.js";
import Button from "../components/button.js";
import {dispatch} from "../stores/index.js";
import {$aliveUsers} from "../stores/users.js";
import {$day, pickUserAction} from "../stores/day.js";
import {subAndRedraw} from "../util/utils.js";

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
        return m("div#menu.w-100.h-100.flex.flex-column.justify-center.content-center.items-center.border-box.ph5", {
            style: `
            background: #556270;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to bottom, #556270, #ff6b6b);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to bottom, #556270, #ff6b6b); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            `
        }, [
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


