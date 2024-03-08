const url_arg_str = window.location.search;
const url_params = new URLSearchParams(url_arg_str);
const subid = url_params.get('subid');
const box_ip = window.location.href.split('/')[2].split(':')[0];
const ws = new WebSocket("ws://" + box_ip + ":50079");


export function send_controlpad_message(msg) {
    ws.send(msg);
}

/**
 * @callback StringMsgHandler
 * @param {string} msg
 * @returns {undefined}
 */

export class Channel {
    /**
     * @private
     * @type {WebSocket}
     * */
    ws
    /** @type {Array<() => void>} */
    onConnectHandler = []
    /** @type {Array<StringMsgHandler>} */
    onMessageHandler = []
    /** @type {Array<() => void>} */
    onDisconnectHandler = []
    debug = true;

    constructor(ws) {
        this.ws = ws;
        ws.onclose = () => {
            if (this.debug) console.debug("Channel Closed");
            this.onDisconnectHandler.map(f => f());
        }

        // wait for websocket to connect
        ws.onopen = (_event) => {
            if (this.debug) console.debug('Channel Opened');
            let byte_array = new Uint8Array(1);
            byte_array[0] = subid;
            ws.send(byte_array);
            ws.onmessage = async (event) => {
                if (event.data instanceof Blob) {
                    const blobData = new Uint8Array(await event.data.arrayBuffer()); // Read the Blob as a Uint8Array
                    // Check the first byte to trigger a reload if it's equal to 0x01
                    if (blobData.length > 0 && blobData[0] === 0x01) {
                        console.log("Hold your hats! It's reload time!");
                        location.reload();
                    } else {
                        // Handle other binary data
                        console.log("Received binary data:", blobData);
                        // Handle it according to your use case.
                    }
                } else {
                    if (this.debug) console.debug('Received new message', event.data);
                    this.onMessageHandler.map(f => f(event.data))
                }
            };
            this.onConnectHandler.map(f => f());
        };

    }

    /**
     * Add a handler that will be called when the connects GameServer
     * Will be called on reconnect as well
     * @param {() => void} cb
     * @return {() => void} Return the unregister functions
     */
    addConnectedHandler(cb) {
        this.onConnectHandler = [...this.onConnectHandler, cb];
        return () => {
            this.onConnectHandler = this.onConnectHandler.filter(f => f !== cb);
        }
    }

    /**
     * Add a handler that will be called when a message gets from the GameServer
     * @param {StringMsgHandler} cb
     * @return {() => void} Return the unregister functions
     */
    addOnMessageHandler(cb) {
        this.onMessageHandler = [...this.onMessageHandler, cb];
        return () => {
            this.onMessageHandler = this.onMessageHandler.filter(f => f !== cb);
        }
    }

    /**
     * Add a handler that will be called when the connects GameServer
     * Will be called on reconnect as well
     * @param {() => void} cb
     * @return {() => void} Return the unregister functions
     */
    addDisconnectedHandler(cb) {
        this.onDisconnectHandler = [...this.onDisconnectHandler, cb];
        return () => {
            this.onDisconnectHandler = this.onDisconnectHandler.filter(f => f !== cb);
        }
    }

    /**
     * Sends a message to the server
     * @param {string} msg to send
     */
    sendMessage(msg) {
        if (this.debug) console.log('Sending', msg);
        send_controlpad_message(msg);
    }
}

export const channel = new Channel(ws);