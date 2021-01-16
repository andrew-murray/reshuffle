import io from "socket.io-client";

const path = new URL( window.location.origin );
const ENDPOINT = process.env.SERVER_ENDPOINT ? process.env.SERVER_ENDPOINT
                                             : "ws://" + path.hostname + ":8080";
let socket = io(ENDPOINT);
export default socket;
