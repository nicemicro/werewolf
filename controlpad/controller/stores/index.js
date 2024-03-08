import {channel} from "../controlpad.js";
import {Action, ActionNames} from "../util/action.js";
import {reduce as gameReducer} from "./game.js";
import {reducer as nameReducer} from './name.js';
import {reducer as userReducer } from "./users.js";
import {reduce as dayReducer} from "./day.js";

channel.addConnectedHandler(() => {
    dispatch(Action.create(ActionNames.P_CONNECTED, {}));
    channel.sendMessage(Action.create(ActionNames.P_SYNC, {}).toString());
});


channel.addOnMessageHandler(msg => {
    dispatch(Action.fromString(msg))
});

/**
 * @param {Action} action
 * @returns {void}
 */
export const dispatch = (action) => {
    gameReducer(action)
    nameReducer(action);
    userReducer(action);
    dayReducer(action);
}