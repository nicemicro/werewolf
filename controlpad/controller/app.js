// @ts-check
import NameMenu from "./routes/name-menu.js";
import Joining from "./routes/joining.js";
import MainMenu from "./routes/main-menu.js";


m.route(document.getElementById("werewolfapp"), "/", {
    '/': Joining,
    '/menu': MainMenu,
    "/name-menu": NameMenu,
})