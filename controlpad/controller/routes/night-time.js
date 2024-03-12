import Layout from "../components/layout.js";
import m from "mithril";

export default class NightTime {
  newDead = false;

  oninit() {
    setTimeout(() => {
      this.newDead = true;
      m.redraw();
    }, 1000);
  }

  view() {
    return m(Layout, [m("h1.f1.tc", "The town sleeps")]);
  }
}
