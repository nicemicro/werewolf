import {channel} from "../controlpad.js";
import {Action, ActionNames} from "../util/action.js";
import {dispatch as gameDispatch} from "./game.js";
import {dispatch as nameDispatch} from './name.js';

channel.addConnectedHandler(() => {
    dispatch(Action.create(ActionNames.CONNECTED, {}));
    channel.sendMessage(Action.create(ActionNames.SYNC, {}).toString());
});


channel.addOnMessageHandler(msg => {
    dispatch(Action.fromString(msg))
});

/**
 * @param {Action} action
 * @returns {void}
 */
export const dispatch = (action) => {
    gameDispatch(action)
    nameDispatch(action);
}