import * as nanostores from "nanostores";
import { Action, ActionNames } from "../util/action.js";
import channel from "../util/channel.js";
import { cond } from "../util/cond.js";
import m from 'mithril';
import { $pick } from "./pick.js";
import { dispatch } from "./store.js";

export const startGameAction = () =>
  Action.create(ActionNames.P_START_GAME, {});
export const showRulesAction = () =>
  Action.create(ActionNames.P_SHOW_RULES, {});
export const showCreditsAction = () =>
  Action.create(ActionNames.P_SHOW_CREDITS, {});
export const resetAction = () =>
  Action.create(ActionNames.P_RESET, {});

/** @enum {string} */
export const Role = {
  CULTIST1: "CULTIST1",
  CULTIST2: "CULTIST2",
  VILLAGER: "VILLAGER",
  SEER: "SEER",
  SHAMAN: "SHAMAN",
};

/**
 * @type {Array<Role>}
 * List of roles to keep the Godot Enum for Roles synced easily
 */
export const RoleList = [
  Role.VILLAGER,
  Role.CULTIST1,
  Role.CULTIST2,
  Role.SEER,
  Role.SHAMAN,
]

/** @enum {string} */
export const Cycle = {
  DAY: "DAY",
  NIGHT: "NIGHT",
};

/** @enum {string} */
export const Hour = {
  WOLF: "WOLF",
  SHAMAN: "SHAMAN",
  SEER: "SEER",
};

/** @enum {string} */
export const GameState = {
  JOIN_GAME: "joinGame",
  MAIN_MENU: "mainMenu",
  START_GAME: "startGame",
};

/**
 * @typedef {Object} GameStore
 * @property {boolean} debug
 * @property {boolean} connected
 * @property {boolean} gameStarted
 * @property {boolean} canStart
 * @property {boolean} dead
 * @property {Role | undefined} role
 * @property {string | undefined} partner Name of the other cultist in case you are one
 * @property {GameState} gameState
 * @property {Cycle} cycle
 * @property {Hour | undefined} hour
 * @property {{ title: string, description: string } | undefined} result 
 */

const search = window.location.search;
const params = new URLSearchParams(search);

const initialState = {
  connected: false,
  debug: (params.get('debug') ?? 'false') === 'true',
  gameStarted: false,
  canStart: false,
  dead: false,
  role: undefined,
  partner: undefined,
  cycle: Cycle.DAY,
  hour: undefined,
  gameState: GameState.MAIN_MENU,
  result: undefined,
};

/**
 * @type {nanostores.MapStore<GameStore>}
 */
export const $game = nanostores.map(initialState);

/**
 * @param {Action} action
 */
export const reduce = cond([
  [ActionNames.P_CONNECTED, () => $game.setKey("connected", true)],
  [
    ActionNames.G_STATE_SYNC,
    /** @param {Action<{ gameState: GameState, name?:string, canStart?: boolean }>} action */
    (action) => {
      const { canStart = false, gameState } = action.payload
      $game.setKey("gameState", gameState);
      $game.setKey("canStart", canStart);

    }
  ],
  [
    [
      ActionNames.P_SHOW_RULES,
      ActionNames.P_SHOW_CREDITS,
      ActionNames.P_START_GAME,
    ],
    (a) => channel.sendMessage(a),
  ],
  [ActionNames.G_GAME_STARTED, () => {
    if ($game.get().gameStarted) {
      dispatch(resetAction());
      return;
    }
    $game.setKey("gameStarted", true)
    $game.setKey("gameState", GameState.JOIN_GAME)
  }],
  [ActionNames.G_CAN_START, () => $game.setKey('canStart', true)],
  [ActionNames.P_START_PLAY, a => channel.sendMessage(a)],
  [ActionNames.G_PLAY, () => $game.setKey('gameState', GameState.START_GAME)],
  [ActionNames.G_ASSIGN_ROLE,
  /** @param {Action<{ role: number }>} a */
  a => $game.setKey("role", RoleList[a.payload.role])
  ],
  [ActionNames.G_SCREEN_SWITCH, handleScreenSwitch],
  [
    ActionNames.P_RESET, () => $game.set({
      ...initialState,
      gameState: GameState.JOIN_GAME,
      gameStarted: true,
    })
  ]
]);


/** @typedef {'night' | 'morning' | 'killvote' | 'death' | 'look up' | 'start vote' | 'foundcultist' | 'foundvillager' | 'end vote'} ScreenKeys */

/** @type {Record<ScreenKeys, [string, Cycle | undefined]>} */
const TargetScreen = {
  'night': ['/night-time', Cycle.NIGHT],
  'killvote': ['/night-pick', Cycle.NIGHT],
  'morning': ['/day-time', Cycle.DAY],
  'death': ['/dead', Cycle.NIGHT],
  'look up': ['/look-up', Cycle.NIGHT],
  'start vote': ['/day-pick', Cycle.DAY],
  // Seer result
  'foundvillager': ['/result', Cycle.NIGHT],
  'foundcultist': ['/result', Cycle.NIGHT],
  'end vote': ['/result', Cycle.DAY],
}

/**
 * 
 * @param {Action<{ switch_to: ScreenKeys, partner?: string }>} action 
 */
function handleScreenSwitch(action) {
  const { switch_to, partner } = action.payload
  const target = TargetScreen[switch_to];

  if (switch_to === 'death') {
    $game.setKey('dead', true);
  }

  if (switch_to === 'foundcultist') {
    const { lastPick } = $pick.get();
    $game.setKey('result', {
      title: 'The visions show a ravenous aura',
      description: `${lastPick?.name} is a cultist`
    })
  }
  if (switch_to === 'foundvillager') {
    const { lastPick } = $pick.get();
    $game.setKey('result', {
      title: 'The visions show a simple creature',
      description: `${lastPick?.name} is a villager`
    })
  }

  if (switch_to === 'end vote') {
    $game.setKey('result', {
      title: 'The town has voted',
      description: `Soon someone will be hanged`
    })
  }

  if (typeof partner === 'string') {
    $game.setKey('partner', partner);
  }

  if (!target) return;

  const [route, cycle] = target;
  // Change cycle if there is a cycle
  if (cycle) {
    $game.setKey('cycle', cycle);
  }
  m.route.set(route);
}

