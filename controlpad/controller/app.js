// @ts-check
import NameMenu from "./routes/name-menu.js";
import Joining from "./routes/joining.js";
import MainMenu from "./routes/main-menu.js";
import DayPick from "./routes/day-pick.js";
import DayExecution from "./routes/day-execution.js";
import NightTime from "./routes/night-time.js";
import m from "mithril";
import GameStart from "./routes/game-start.js";

const node = document.getElementById("werewolfapp");

if (node) {
  m.route(node, "/", {
    "/": Joining,
    "/menu": MainMenu,
    "/name-menu": NameMenu,
    "/day-pick": DayPick,
    "/day-execution": DayExecution,
    "/night-time": NightTime,
    '/game-start': GameStart
  });
}
