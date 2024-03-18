import {map} from 'https://unpkg.com/nanostores';
import {channel} from "../controlpad.js";
import {Action, ActionNames} from "../util/action.js";
import {cond} from "../util/cond.js";

/**
 * @typedef NameStore
 * @property {string | undefined} name
 * @property {string | undefined} error
 * @property {boolean} submitting
 * @property {boolean} ready
 * @property {string | undefined} submittedName
 */

/**
 * @type {import('nanostores').MapStore<NameStore>}
 */
export const $name = map({
    name: undefined,
    error:  undefined,
    submitting: false,
    ready: false,
    submittedName: undefined
});

export const submitNameAction = name => Action.create(ActionNames.P_SUBMIT_NAME, {name});

/**
 * @param {Action} action
 * @returns {void}
 */
export const dispatch = cond([
    [[ActionNames.G_JOINED, ActionNames.G_JOINED_FAILED], handleNamingResult],
    [ActionNames.P_SUBMIT_NAME, handleSubmitName],
    [ActionNames.G_STATE_SYNC, handleStateSync]
])

/** @param {Action<{ status: string, name: string | undefined }>} action */
function handleNamingResult(action) {
    const {type, payload} = action;
    const failed = type === ActionNames.G_JOINED_FAILED;
    const state = $name.get()
    $name.setKey('submitting', false)
    if (failed) {
        if (payload.status === "alreadyJoined") {
            $name.setKey('name', payload.name)
            $name.setKey('ready', true)
            return;
        }
        $name.setKey('error', payload.status)
        return;
    }
    $name.setKey('name', state.submittedName)
    $name.setKey('ready', true)
}

/** @param {Action<{ name: string}>} action */
function handleSubmitName(action) {
    const {payload} = action;
    $name.setKey('submitting', true);
    $name.setKey('submittedName', payload.name)
    channel.sendMessage(Action.create(ActionNames.P_SUBMIT_NAME, {name: payload.name}).toString());
}

/** @param {Action<{ name: string | undefined }>} action */
function handleStateSync(action) {
    const { payload } = action;
    if (payload.name) {
        $name.setKey('name', payload.name)
        $name.setKey('ready', true)
    }
}
