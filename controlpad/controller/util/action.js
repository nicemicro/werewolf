/** @enum {string} */
export const ActionNames = {
    'CONNECTED': 'CONNECTED',
    'SYNC': 'SYNC',
    "SUBMIT_NAME": 'SUBMIT_NAME',
    "JOINED": "Joined",
    "JOINED_FAILED": "JoinFailed"
}

/**
 * @template T
 */
export class Action {
    /** @type {ActionNames} */
    type
    /** @type {T} */
    payload

    /**
     * Parses message from server
     * @param {string} msg
     * @return {Action}
     */
    static fromString(msg) {
        const data = JSON.parse(msg);
        return new Action(data.type, data.payload);
    }

    /**
     * Helper for easier chaining
     * @param {Action['type']} type
     * @param {T} payload
     */
    static create(type, payload) {
        return new Action(type, payload)
    }

    /**
     * @param {Action['type']} type
     * @param {T} payload
     */
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }

    /** Msg to String to send it to the server */
    toString() {
        return JSON.stringify({type: this.type, payload: this.payload})
    }
}

