import Layout from "../components/layout.js";
import m from "mithril";
import { $game } from "../stores/game.js";

// Screen used for killers to see each other
export default class LookUp {

  view() {
    const partner = $game.get().partner;
    return m(Layout, [
      m("h1.f1.tc", "The town sleeps"),
      m('h2.f2.tc.mt3', 'The cultist see each other for the first time'),
      m('h3.f2.tc.mt3', ['Your partner is ', m('strong.underline.b', partner || 'something')])
    ]);
  }
}
