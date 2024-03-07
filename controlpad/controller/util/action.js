/**
 * Enum for game actions
 * Action keys with prefix P_ are from the Player
 * Action keys with prefix G_ are from the Godot Game
 * @enum {string} */
export const ActionNames = {
    // Initialization Action
    P_CONNECTED: 'CONNECTED',
    P_SYNC: 'SYNC',
    // General Action
    G_UPDATE_STATE: 'UPDATE_STATE',
    // Main Menu Action
    P_SHOW_RULES: "SHOW_RULES",
    P_SHOW_CREDITS: 'SHOW_CREDITS',
    P_START_GAME: "START_GAME",
    G_GAME_STARTED: 'GAME_STARTED',
    // Naming Action
    P_SUBMIT_NAME: 'SUBMIT_NAME',
    G_JOINED: "Joined",
    G_JOINED_FAILED: "JoinFailed",


}

/**
 * @template {{[x: string]: any}} T
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
    static create(type, payload = {}) {
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

