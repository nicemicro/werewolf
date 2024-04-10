import Layout from "../components/layout.js";
import m from "mithril";

export default class GameOver {

  view() {
    const wolfsWon = true
    return m(Layout, wolfsWon ? [
      m("h1.f1.tc", "The Wolf claims this land as his"),
      m('p.f3.tc', "The worshippers got all the villagers, and used their bodies to feed their wicked God"),
    ] : [
      m("h1.f1.tc", "With the cultists found, the nightmare was over"),
      m('p.f3.tc', "Now the town could sleep safe, but the spirits knew that the Wolf never rests for long"),
    ]);
  }
}