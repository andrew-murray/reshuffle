# reshuffle

reshuffle is a client/server implementation of chatrooms/gamerooms and
[reversi](https://en.wikipedia.org/wiki/Reversi) in the browser. Available at
[https://andrew-murray.github.io/reshuffle/](https://andrew-murray.github.io/reshuffle/)

# Implementation

There's a lightweight server to coordinate and manage state - communication is over [socket.io](https://socket.io/).
The client uses [react](https://reactjs.org/), [material-ui](https://material-ui.com/) and [konva](https://konvajs.org/).
