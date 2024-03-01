import { map } from 'https://unpkg.com/nanostores';
import { send_msg, MsgType } from "./controlpad.js";

export const $name = map({
    name: /** @type {string | undefined} */ undefined,
    error: /** @type {string | undefined} */ undefined,
    submitted: false,
    submittedName: /** @type {string | undefined} */ undefined
});

/**
 * Send the name to the server for validation
 * @param {string} name
 */
export const submitNameAction = (name) => {
    $name.setKey('submitted', true);
    $name.setKey('submittedName', name)
    send_msg(MsgType.SUBMIT_NAME, { name });
}

const handleWSEvent = (type, payload) => {
    switch (type) {
        case 'NAMING_RESULT':
            handleNamingResult(payload);
            break;
    }
}

document.addEventListener('controlpad-message', function (e) {
    handleWSEvent(e.type, e.payload);
});

function handleNamingResult(payload) {
    const state = $name.get()
    if (payload.error) {
        $name.setKey('error', payload.error)
    } else {
        $name.setKey('name', state.submittedName)
    }
}