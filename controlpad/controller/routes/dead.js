import Layout from "../components/layout.js";
import m from "mithril";

export default class Dead {

  view() {
    return m(Layout, [m("h1.f1.tc", "You are dead")]);
  }
}