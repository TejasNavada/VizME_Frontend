const io = require('socket.io-client')
export let socket = io(process.env.REACT_APP_SOCKET_HOST);

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.emit("test event", "Hello, server!");

socket.on("connect_error", (err) => {
    console.error("WebSocket connection error:", err);
});