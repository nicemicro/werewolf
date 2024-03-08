// @ts-check
import NameMenu from "./routes/name-menu.js";
import Joining from "./routes/joining.js";
import MainMenu from "./routes/main-menu.js";
import DayPick from "./routes/day-pick.js";
import DayExecution from "./routes/day-execution.js";
import NightTime from "./routes/night-time.js";


m.route(document.getElementById("werewolfapp"), "/", {
    '/': Joining,
    '/menu': MainMenu,
    "/name-menu": NameMenu,
    '/day-pick': DayPick,
    '/day-execution': DayExecution,
    '/night-time': NightTime,
})