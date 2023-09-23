const OriginalWebSocket = WebSocket;

window.WebSocket = class extends OriginalWebSocket {
    constructor(url, ...options) {
        super('ws://localhost:3000', ...options);
    }
};

// create a new proxy for the WebSocket constructor
//window.WebSocket = new Proxy(OriginalWebSocket, {
//    construct(target, args) {
//        // modify the WebSocket URL here
//        // orig - wss://matchmaking.narrow-one.com/
//        args[0] = 'ws://localhost:3000';

//        // create a new WebSocket instance with the modified URL

//        console.log(args);

//        const socket = new target(...args);
//        return socket;
//    }
//});