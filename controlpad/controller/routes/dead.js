import Layout from "../components/layout.js";
import m from "mithril";
import { Cycle } from "../stores/game.js";

export default class Dead {

  view() {
    return m(Layout, { cycleOverride: Cycle.NIGHT }, [
      m("h1.f1.tc", "You are dead"),
      m("div.w-100", [
        m("img.h5.w5.center.db", { src: '/resources/grave.png', alt: 'gallow' }),
      ]),
    ]);
  }
}
