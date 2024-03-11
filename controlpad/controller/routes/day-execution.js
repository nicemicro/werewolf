import Layout from "../components/layout.js";
import GraveSvg from "../components/grave-svg.js";
import m from 'mithril';

const WaitingH1 = {
    /** @param {m.VnodeDOM} vnode */
    onbeforeremove: function (vnode) {
        vnode.dom.classList.add("anim__fade-out")
        return new Promise(function (resolve) {
            vnode.dom.addEventListener("animationend", resolve)
        })
    },
    view() {
        return m('h1.f1.tc.absolute.ph5', 'Waiting for other players to pick')
    }
}

export default class DayExecution {
    newDead = false;

    view() {
        return m(Layout, [
            !this.newDead ? m(WaitingH1) : null,
            this.newDead ? m('div.relative.w-100.overflow-y-hidden', {style: {minHeight: "300px"}}, [
                    m('div.absolute.anim__up_and_crawl', {
                        style: {
                            width: "300px",
                            left: "50%",
                            marginLeft: '-150px',

                            "--transform-up-from": "100%",
                            "--transform-up-to": "0%"
                        },
                    }, m(GraveSvg, {name: 'Nicky'}))
                ]) : null
        ])
    }
}