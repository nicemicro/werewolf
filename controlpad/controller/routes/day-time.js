import Layout from "../components/layout.js";
import m from "mithril";

export default class DayTime {

  view() {
    return m(Layout, [m("h1.f1.tc", "A new day dawns")]);
  }
}
