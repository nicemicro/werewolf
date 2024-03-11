///////////////////////////// DO NOT EDIT THIS FILE ////////////////////////////
/* This file will be replaced by GameNite code once you submit your game so 
   relying on edits you make to this file may break your game.
*/

const url_arg_str = window.location.search;
const url_params = new URLSearchParams(url_arg_str);

export const CONNECTED_EVENT_NAME = "controlpad-connected"
export const DISCONNECTED_EVENT_NAME = "controlpad-disconnected"
export const MESSAGE_EVENT_NAME = "controlpad-message"

// WebSocket class to handle communication with the controlpad server
class GameWebSocket {

    /**
     * @type {string}
     * The IP address of the controlpad server
     */
    ip

    /**
     * @type {number}
     * The subid of the controlpad server
     */
    subid

    /**
     * @type {number}
     * The port number of the controlpad server
     */
    port

    constructor(port = 50079) {
        this.ip = window.location.href.split('/')[2].split(':')[0];
        this.subid = url_params.get('subid');
        this.port = port;
        this.socket = null;
        this.initializeWebSocket();
    }

    // initializes the WebSocket connection and binds the event handlers
    initializeWebSocket() {
        this.socket = new WebSocket("ws://" + this.ip + ":" + this.port);
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
    }

    // send initial message to the controlpad server after the WebSocket connection is opened
    // Method to send initial messages once the WebSocket connection is ready
    sendInitialMessages() {
        const byte_array = new Uint8Array(1);
        byte_array[0] = this.subid;
        this.socket.send(byte_array);
        this.socket.send("state-request");
    }

    // event handler for the WebSocket onopen event   
    onopen = async (_event) => {
        console.log("opened websocket on " + this.ip + ":" + this.port);
        this.sendInitialMessages();
        setTimeout(() => {
            var controlpad_msg_event = new CustomEvent(CONNECTED_EVENT_NAME);
            document.dispatchEvent(controlpad_msg_event);
        })
    }

    // event handler for the WebSocket onclose event
    onclose = () => {
        console.log("closing websocket on " + this.ip + ":" + this.port);
        var controlpad_msg_event = new CustomEvent(DISCONNECTED_EVENT_NAME);
        document.dispatchEvent(controlpad_msg_event);
    }

    // event handler for the Websocket onmessage event
    onmessage = async (event) => {
        console.log("Received message:", event.data);
        if (event.data instanceof Blob) {
            // Read the Blob as a Uint8Array
            const blobData = new Uint8Array(await event.data.arrayBuffer());
            // Check the first byte to trigger a reload if it's equal to 0x01
            if (blobData.length > 0 && blobData[0] === 0x01) {
                console.log("Hold your hats! It's reload time!");
                location.reload();
            }
            else {
                // Handle other binary data
                console.log("Received binary data:", blobData);
                // Handle it according to your use case.
            }
        }
        else {
            var controlpad_msg_event = new CustomEvent(MESSAGE_EVENT_NAME, {
                detail: event.data,
            });
            document.dispatchEvent(controlpad_msg_event);
        }
    }

    // event handler for the WebSocket onerror event
    onerror = (error) => {
        console.log("WebSocket error:", error, " on " + this.ip + ":" + this.port);
    }
}

// Create a new WebSocket object
const ws = new GameWebSocket();

export function send_controlpad_message(msg) {
    console.log('sending ' + msg);
    ws.socket.send(msg);
}