import channel from "../util/channel.js";
import {Action, ActionNames} from "../util/action.js";
import {reduce as gameReducer} from "./game.js";
import {reducer as nameReducer} from './name.js';
import {reducer as userReducer } from "./users.js";
import {reduce as dayReducer} from "./day.js";

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

channel.addConnectedHandler(() => {
    dispatch(Action.create(ActionNames.P_CONNECTED, {}));
    channel.sendMessage(Action.create(ActionNames.P_SYNC, {}));
});

channel.addOnMessageHandler(dispatch);