import m from 'mithril';
import * as nanostores from "nanostores";
import channel from "../util/channel.js"
import { Action, ActionNames } from "../util/action.js";
import { $game, GameState, reduce as gameReducer } from "./game.js";
import { $name, reducer as nameReducer, submitNameAction } from "./name.js";
import { reducer as userReducer } from "./users.js";
import { reduce as pickReducer } from "./pick.js";

/**
 * @param {Action} action
 * @returns {void}
 */
export const dispatch = (action) => {
  nameReducer(action);
  userReducer(action);
  pickReducer(action);
  gameReducer(action);
};

channel.addConnectedHandler(() => {
  dispatch(Action.create(ActionNames.P_CONNECTED, {}));
  channel.sendMessage(Action.create(ActionNames.P_SYNC, {}));
});

channel.addOnMessageHandler(dispatch);

$game.subscribe((val, oldValue) => {
  if (val.debug || val.dead) return;
  if (val.gameState !== oldValue?.gameState) {
    if (val.gameState === GameState.MAIN_MENU) {
      m.route.set('/menu')
    }
    if (val.gameState === GameState.JOIN_GAME) {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const name = params.get('debugName')
      if (typeof name !== 'undefined' && name !== null) {
        dispatch(submitNameAction(name));
      }
      m.route.set('/name-menu')
    }
    return;
  }
  if (val.canStart === true && $name.get().name) {
    m.route.set('/game-start');
  }
})
