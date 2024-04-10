// @ts-check
import NameMenu from "./routes/name-menu.js";
import Joining from "./routes/joining.js";
import MainMenu from "./routes/main-menu.js";
import DayPick from "./routes/day-pick.js";
import DayExecution from "./routes/day-execution.js";
import NightTime from "./routes/night-time.js";
import m from "mithril";
import GameStart from "./routes/game-start.js";
import NightPick from "./routes/night-pick.js";
import { $game } from "./stores/game.js";
import Dead from "./routes/dead.js";
import LookUp from "./routes/lookup.js";
import NightKilling from "./routes/night-killing.js";
import GameOver from "./routes/game-over.js";

const search = window.location.search;
const params = new URLSearchParams(search);

let debug = (params.get('debug') ?? 'false') === 'true';

$game.setKey('debug', debug)

const node = document.getElementById("werewolfapp");

if (node) {
  m.route(node, "/", {
    "/": Joining,
    "/menu": MainMenu,
    "/name-menu": NameMenu,
    "/day-pick": DayPick,
    "/day-execution": DayExecution,
    "/night-killing": NightKilling,
    "/night-time": NightTime,
    '/night-pick': NightPick,
    '/game-start': GameStart,
    '/dead': Dead,
    '/look-up': LookUp,
    '/game-over': GameOver,
  });
}
