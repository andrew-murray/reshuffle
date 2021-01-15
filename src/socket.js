import io from "socket.io-client";
const path = new URL( window.location.origin );
const ENDPOINT = path.origin + ":8080";
let socket = io(ENDPOINT);
export default socket;
