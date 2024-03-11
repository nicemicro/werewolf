import Layout from "../components/layout.js";
import GraveSvg from "../components/grave-svg.js";

const WaitingH1 = {
    onbeforeremove: function (vnode) {
        vnode.dom.classList.add("anim__fade-out")
        return new Promise(function (resolve) {
            vnode.dom.addEventListener("animationend", resolve)
        })
    },
    view() {
        return m('h1.f1.tc.absolute', 'Waiting for other players to pick')
    }
}

export default class DayExecution {
    newDead = false;

    oninit() {
        setTimeout(() => {
            this.newDead = true;
            m.redraw();
        }, 1000)
    }

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