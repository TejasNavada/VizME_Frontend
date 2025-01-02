const io = require('socket.io-client')
export let socket = io(process.env.REACT_APP_SOCKET_HOST,{
    transports: ["websocket", "polling"], // Ensure both transports are used
    reconnection: true, // Enable automatic reconnection
    reconnectionAttempts: 5, // Retry up to 5 times
    reconnectionDelay: 1000, // Retry after 1 second
});

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.emit("test event", "Hello, server!");