import { map } from 'https://unpkg.com/nanostores';
import { send_msg, MsgType } from "./controlpad.js";

export const $name = map({
    name: /** @type {string | undefined} */ undefined,
    error: /** @type {string | undefined} */ undefined,
    submitting: false,
    ready: false,
    submittedName: /** @type {string | undefined} */ undefined
});

/**
 * Send the name to the server for validation
 * @param {string} name
 */
export const submitNameAction = (name) => {
    $name.setKey('submitting', true);
    $name.setKey('submittedName', name)
    send_msg(MsgType.SUBMIT_NAME, { name });
}

export const handleWSEvent = (type, payload) => {
    switch (type) {
        case 'NAMING_RESULT':
            handleNamingResult(payload);
            break;
    }
}

document.addEventListener('controlpad-message', function (e) {
    handleWSEvent(e.type, e.payload);
});

/**
 *
 * @param {{ error?: string }} payload
 */
function handleNamingResult(payload) {
    console.log(payload, payload.error)
    const state = $name.get()
    $name.setKey('submitting', false)
    if (payload.error) {
        $name.setKey('error', payload.error)
    } else {
        $name.setKey('name', state.submittedName)
        $name.setKey('ready', true)
    }
}