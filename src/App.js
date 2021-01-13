import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import TitleScreen from "./TitleScreen";
import ChatDrawer from "./ChatDrawer";
import {OfflineOthelloGame, OnlineOthelloGame} from "./games/OthelloGame"

import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080/";

const theme = createMuiTheme({
});

class OthelloWithChat extends React.Component
{
  state = {
    messages: []
  }

  constructor(props)
  {
    super(props)
    this.socket = null;
    this.joinedRoom = null;
  }

  connectToRoom(roomID)
  {
    if((this.joinedRoom !== roomID) && this.socket)
    {
      this.joinedRoom = roomID;
      this.socket.emit('chat.join', roomID);
    }
  }

  componentDidMount() {
    this.socket = io(ENDPOINT);
    this.socket.on('chat.message', (msg)=>{
      this.setState( (state, props) => {
          return {messages: state.messages.concat(msg)};
      });
    });
    this.connectToRoom(this.props.roomID);
  }

  componentDidUpdate()
  {
    this.connectToRoom(this.props.roomID);
  }

  render()
  {
    return (
      <React.Fragment>
        <OnlineOthelloGame />
        <ChatDrawer
          messages={this.state.messages}
          onSend={(msg)=>{if(this.socket){this.socket.emit("chat.message", msg);}}}
        />
      </React.Fragment>
    );
  }
}


function App() {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
          <div className="App">
            <Switch>
              <Route exact path="/">
                <TitleScreen />
              </Route>
              <Route exact path="/practice">
                <OfflineOthelloGame />
              </Route>
              <Route
                path="/room/:roomID/"
                component={(props)=> <OthelloWithChat roomID={props.match.params.roomID} />}
              />
            </Switch>
          </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
