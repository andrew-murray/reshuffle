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
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import TitleScreen from "./TitleScreen";
import ChatDrawer from "./ChatDrawer";
import OthelloBoard from "./games/OthelloBoard"
import OthelloRules from "./games/OthelloRules";
import {OfflineOthelloGame} from "./games/OthelloGame"
import OthelloStatusBar from "./games/OthelloStatusBar"
import { useHistory } from "react-router-dom";
import socket from "./socket"

const othelloStyles = (theme) => { return {
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  chatDrawer: {
    width: 300
  }
} };

const mp3File = "zapsplat_impacts_wood_thin_small_panel_knock_hit_lite_muted_004_39796.mp3";
const notifyNoise = new Audio(process.env.PUBLIC_URL + "/" + mp3File);

class OthelloWithChat extends React.Component
{
  state = {
    messages: [],
    board: null,
    role: null,
    activePlayer: null,
    status: null,
    joinedRoom: null,
    windowWidth: 0,
    windowHeight: 0
  }
  constructor(props)
  {
    super(props)
    // I think this is the cleanest way to implement this functionality
    // https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  connectToRoom(roomID)
  {
    if((this.state.joinedRoom !== roomID))
    {
      this.setState(
        { joinedRoom: roomID },
        () => {
          socket.emit('chat.join', roomID);
          socket.emit("othello.join", roomID);
        }
      );
    }
  }

  updateWindowDimensions() {
    this.setState((props,state)=>{ return{ windowWidth: window.innerWidth, windowHeight: window.innerHeight } });
  }

  componentDidMount() {
    this.connectToRoom(this.props.roomID);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    socket.on('chat.message', (msg)=>{
      this.setState( (state, props) => {
          return {messages: state.messages.concat(msg)};
      });
    });
    socket.on('othello.update', (othelloState)=>{
      this.setState((state,props)=>{
        const stateInvalid = !state.board
          || !state.activePlayer
          || !state.role
          || !state.status;
        if( stateInvalid
          || othelloState.role !== state.role
          || othelloState.activePlayer !== state.activePlayer
          || othelloState.status !== state.status
          || !OthelloRules.boardsEqual(state.board, othelloState.board))
        {
          if(!stateInvalid)
          {
            notifyNoise.play();
          }
          return {
            board: othelloState.board,
            activePlayer: othelloState.activePlayer,
            role: othelloState.role,
            status: othelloState.status
          };
        }
        else
        {
          return {};
        }
      })
    });
  }

  componentDidUpdate()
  {
    this.connectToRoom(this.props.roomID);
  }

  componentWillUnmount()
  {
    window.removeEventListener('resize', this.updateWindowDimensions);
    socket.off('chat.message');
    socket.off('othello.update');
  }

  render()
  {
    const sendSwap = () =>
    {
      if(this.state.role!== null)
      {
        socket.emit("othello.swap");
      }
    };

    const sendReset = () =>
    {
      if(this.state.role!== null && socket)
      {
        socket.emit("othello.reset");
      }
    };

    const sendConcede = () =>
    {
      if(this.state.role!==null)
      {
        socket.emit("othello.concede");
      }
    }

    const whiteScore = !this.state.board ? 0 :
      OthelloRules.countCellsForRole(this.state.board, OthelloRules.labels.white);
    const blackScore = !this.state.board ? 0 :
      OthelloRules.countCellsForRole(this.state.board, OthelloRules.labels.black);

    const gameIsActive = this.state.status === "active";
    const canMakeMoves = this.state.role === this.state.activePlayer ? this.state.role: null;
    const styleForGame = this.state.activePlayer === null ? {opacity: "50%"} : undefined;

    // default board to be only as big as 85% of the screen's width
    // we have additional content to fit vertically, so leave some extra wiggle room
    const boardSize = Math.min( Math.min( this.state.windowWidth * 0.85, this.state.windowHeight * 0.75 ) , 450 );

    return (
      <div className={this.props.classes.root}>
        <main className={this.props.classes.content}>
          <OthelloBoard
            width={boardSize}
            height={boardSize}
            game={this.state.board === null ? OthelloRules.createEmptyBoardState(8,8) : this.state.board}
            // provide a player, OthelloBoard requires one for now
            showMovesForPlayer={canMakeMoves}
            onMove={(action)=>{
              if(action.position)
              {
                socket.emit("othello.move", action);
              }
            }}
            style={styleForGame}
          />
          <OthelloStatusBar
            role={this.state.role}
            active={this.state.activePlayer}
            whiteScore={whiteScore}
            blackScore={blackScore}
          />
          {this.state.role ?
            <div style={{padding: "1vh"}}>
              <Button variant="contained" onClick={sendSwap} disabled={gameIsActive} color="primary"> Swap </Button>
              <Button variant="contained" onClick={sendReset} disabled={gameIsActive} color="primary"> Reset </Button>
              <Button variant="contained" onClick={sendConcede} disabled={!gameIsActive} color="primary"> Concede </Button>
            </div>
            : <Paper style={{padding: "1vh"}}><Typography>You are observing.</Typography></Paper>
          }
        </main>
        <ChatDrawer
          messages={this.state.messages}
          onSend={(msg)=>{socket.emit("chat.message", msg);}}
          style={{width: Math.min(300, this.state.windowWidth * 0.75)}}
        />
      </div>
    );
  }
}

const StyledOthelloWithChat = withStyles(othelloStyles)(OthelloWithChat);

function App() {

  let history = useHistory();

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

  React.useEffect(()=>{
    socket.on("room.created", (roomID)=>
    {
      history.push("othello/room/" + roomID);
    })
    return ()=>{socket.off("room.created");}
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <TitleScreen
                onCreate={()=>{socket.emit("chat.create");}}
              />
            </Route>
            <Route exact path="/othello/practice">
              <OfflineOthelloGame />
            </Route>
            <Route
              path="/othello/room/:roomID/"
              component={(props)=> <StyledOthelloWithChat roomID={props.match.params.roomID} />}
            />
          </Switch>
        </div>
    </ThemeProvider>
  );
}

function RouterRoot()
{
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <App/>
    </Router>
  );
}

export default RouterRoot;
