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
import OthelloBoard from "./games/OthelloBoard"
import OthelloRules from "./games/OthelloRules"
import {OfflineOthelloGame} from "./games/OthelloGame"

// for action group
import Button from '@material-ui/core/Button';

import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080/";



class OthelloWithChat extends React.Component
{
  state = {
    messages: [],
    board: null,
    role: null,
    activePlayer: null
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
      this.socket.emit("othello.join", roomID);
    }
  }

  componentDidMount() {
    this.socket = io(ENDPOINT);
    this.connectToRoom(this.props.roomID);
    this.socket.on('chat.message', (msg)=>{
      this.setState( (state, props) => {
          return {messages: state.messages.concat(msg)};
      });
    });
    this.socket.on('othello.update', (othelloState)=>{
      this.setState((state,props)=>{
        if(
          !state.board
          || !state.activePlayer
          || !state.player
          || !OthelloRules.boardsEqual(state.board, othelloState.board)
          || othelloState.role !== state.role
          || othelloState.activePlayer !== state.activePlayer )
        {
          return {
            board: othelloState.board,
            activePlayer: othelloState.activePlayer,
            role: othelloState.role
          };
        }
        else
        {
          return {};
        }
      })
    });
  }

  componentWillUnmount()
  {
    // todo: react complains about state updates "after" componentWillUnmount
    // "cancel all subscriptions and asynchronous tasks"
    // but, this doesn't seem to solve it strangely
    this.socket.disconnect();
    delete this.socket;
  }

  componentDidUpdate()
  {
    this.connectToRoom(this.props.roomID);
  }

  render()
  {
    const showMovesForPlayer = this.state.role === this.state.activePlayer ? this.state.role: null;

    const sendSwap = () =>
    {
      if(this.state.role!== null && this.socket)
      {
        this.socket.emit("othello.swap");
      }
    };

    const sendReset = () =>
    {
      if(this.state.role!== null && this.socket)
      {
        this.socket.emit("othello.reset");
      }
    };

    return (
      <React.Fragment>
        <div style={{padding: "1vh"}}>
          <Button variant="outlined" onClick={sendSwap}> Swap </Button>
          <Button variant="outlined" onClick={sendReset}> Reset </Button>
        </div>
        <OthelloBoard
          width={400}
          height={400}
          game={this.state.board === null ? OthelloRules.createEmptyBoardState(8,8) : this.state.board}
          // provide a player, OthelloBoard requires one for now
          showMovesForPlayer={showMovesForPlayer}
          onMove={(action)=>{
            if(action.position && this.socket && this.socket.connected)
            {
              this.socket.emit("othello.move", action);
            }
          }}
        />
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
