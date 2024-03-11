import {CONNECTED_EVENT_NAME, MESSAGE_EVENT_NAME, send_controlpad_message} from "../controlpad.js";
import {Action} from "./action.js";

/**
 * List of listeners registered for on connected
 * @type {Set<() => void>}
 */
const connectedListeners = new Set();
/**
 * List of listeners registered for on message
 * @type {Set<(action: Action) => void>}
 */
const msgListeners = new Set();

/**
 * Helper Object to allow interaction with Game Server
 */
const channel = {
    /**
     * Sends a message to the server
     * @param {Action} action
     */
    sendMessage(action) {
        send_controlpad_message(action.toString())
    },
    /**
     * Add a listeners to the 'connected message
     * @param {() => void} cb - The function to call
     * @return {() => void} A function to deregister the callback
     */
    addConnectedHandler(cb)  {
        if (connectedListeners.has(cb)) {
            console.warn('Listener already registered');
            return () => {};
        }
        connectedListeners.add(cb);
        return () => connectedListeners.delete(cb);
    },
    /**
     * Add a listeners to messages from the server
     * @param {(action: Action) => void} cb - The function to call
     * @return {() => void} A function to deregister the callback
     */
    addOnMessageHandler(cb)  {
        if (msgListeners.has(cb)) {
            console.warn('Listener already registered');
            return () => {};
        }
        msgListeners.add(cb);
        return () => msgListeners.delete(cb);

    }
}

// Listen to connected events
document.addEventListener(CONNECTED_EVENT_NAME,
    () => {
        connectedListeners.forEach(cb => cb());
    }
)

// List to message events
// @ts-ignore
document.addEventListener(MESSAGE_EVENT_NAME,
    /** @param {CustomEvent<string>} event - event from websocket */
    (event) => {
        const action = Action.fromString(event.detail)
        msgListeners.forEach(cb => cb(action));
    }
)

export default channel;