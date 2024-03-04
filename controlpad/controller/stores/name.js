import {map} from 'https://unpkg.com/nanostores';
import {channel} from "../controlpad.js";
import {Action, ActionNames} from "../util/action.js";

/**
 * @template T
 * @typedef {import('nanostores').MapStore<T>} MapStore
 */

/**
 * @typedef NameStore
 * @property {string | undefined} name
 * @property {string | undefined} error
 * @property {boolean} submitting
 * @property {boolean} ready
 * @property {string | undefined} submittedName
 */

/**
 * @type {MapStore<NameStore>}
 */
export const $name = map({
    name: undefined,
    error:  undefined,
    submitting: false,
    ready: false,
    submittedName: undefined
});

export const submitNameAction = name => Action.create(ActionNames.SUBMIT_NAME, {name});

/**
 * @param {Action} action
 * @returns {void}
 */
export const dispatch = (action) => {
    const {type, payload} = action;
    switch (type) {
        case ActionNames.JOINED:
        case ActionNames.JOINED_FAILED:
            handleNamingResult(type, /** @type {Parameters<handleSubmitName>[0]} */ payload);
            break;
        case ActionNames.SUBMIT_NAME:
            handleSubmitName(/** @type {{name: string}} */ payload);
    }
}

/**
 * @param {string} type
 * @param {{ status: string }} payload
 */
function handleNamingResult(type, payload) {
    const failed = type === ActionNames.JOINED_FAILED;
    const state = $name.get()
    $name.setKey('submitting', false)
    if (failed) {
        $name.setKey('error', payload.status)
    } else {
        $name.setKey('name', state.submittedName)
        $name.setKey('ready', true)
    }
}

/** @param {{ name: string }} payload */
function handleSubmitName({ name }) {
    $name.setKey('submitting', true);
    $name.setKey('submittedName', name)
    channel.sendMessage(Action.create(ActionNames.SUBMIT_NAME, {name}).toString());
}