import io from "socket.io-client";

const path = new URL( window.location.origin );
const ENDPOINT = process.env.NODE_ENV === 'production' ? process.env.SERVER_ENDPOINT ? process.env.SERVER_ENDPOINT
                                                                                     : "wss://reshuffle.herokuapp.com/"
                                                       : path.protocol + "//" + path.hostname + ":8080";
let socket = io(ENDPOINT);
export default socket;
