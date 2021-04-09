import React from 'react';
import ChatDrawer from "../ChatDrawer";
import OthelloBoard from "./OthelloBoard"
import OthelloRules from "./OthelloRules";
import OthelloStatusBar from "./OthelloStatusBar"
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles, createStyles } from '@material-ui/core/styles';
import TextEntryDialog from "../TextEntryDialog"
import socket from "../socket"

const mp3File = "zapsplat_impacts_wood_thin_small_panel_knock_hit_lite_muted_004_39796.mp3";
const notifyNoise = new Audio(process.env.PUBLIC_URL + "/" + mp3File);

type Props = React.HTMLAttributes<HTMLElement> & {
  roomID: string,
  classes: any
};

type StateType = {
  messages: Array<any>,
  board?: Array<Array<number>> | null,
  role?: number | null,
  activePlayer?: number | null,
  status?: string | null,
  joinedRoom?: string | null,
  windowWidth: number,
  windowHeight: number,
  lastMove?: Array<number> | null
};

class OthelloWithChat extends React.Component<Props, StateType>
{
  state : StateType = {
    messages: [],
    board: null,
    role: null,
    activePlayer: null,
    status: null,
    joinedRoom: null,
    windowWidth: 0,
    windowHeight: 0,
    lastMove: null
  }
  constructor(props: Props)
  {
    super(props)
    // I think this is the cleanest way to implement this functionality
    // https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  connectToRoom(roomID : string, name: string)
  {
    this.setState(
      { joinedRoom: roomID },
      () => {
        socket.emit('chat.join', roomID, name);
        socket.emit("othello.join", roomID);
      }
    );
  }

  updateWindowDimensions() {
    // fixme: why is this wrong?
    /*
    this.setState((props,state)=>{
      return{ ...state, windowWidth: window.innerWidth, windowHeight: window.innerHeight }
    });
    */
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    socket.on('chat.receive', (data: any)=>{
      this.setState( (state) => {
          return {...state, messages: state.messages.concat(data)};
      });
    });
    socket.on('othello.status', (text: string)=>{
      this.setState( (state) => {
        return {...state, messages: state.messages.concat({isStatus: true, text: text})}
      });
    });
    socket.on('othello.update', (othelloState: any)=>{
      this.setState((state)=>{
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
            ...state,
            board: othelloState.board,
            activePlayer: othelloState.activePlayer,
            role: othelloState.role,
            status: othelloState.status,
            lastMove: othelloState.lastMove
          };
        }
        else
        {
          return state;
        }
      })
    });
  }

  componentWillUnmount()
  {
    window.removeEventListener('resize', this.updateWindowDimensions);
    socket.off('chat.receive');
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
    const gameDefaults = {display: "flex", justifyContent: "center"};
    const styleForGame = Object.assign(
      this.state.activePlayer === null ? {opacity: "50%"} : {},
      gameDefaults
    );

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
            highlightCell={this.state.lastMove ? this.state.lastMove.position : undefined}
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
              <Button variant="contained" onClick={sendSwap} disabled={this.state.status !== "new"} color="primary"> Swap </Button>
              <Button variant="contained" onClick={sendReset} disabled={gameIsActive} color="primary"> Reset </Button>
              <Button variant="contained" onClick={sendConcede} disabled={!gameIsActive} color="primary"> Concede </Button>
            </div>
            : this.state.joinedRoom && <Paper style={{padding: "1vh"}}><Typography>You are observing.</Typography></Paper>

          }
        </main>
        <ChatDrawer
          messages={this.state.messages}
          onSend={(msg)=>{socket.emit("chat.send", msg);}}
          style={{width: Math.min(300, this.state.windowWidth * 0.75)}}
        />
        <TextEntryDialog
          open={this.state.joinedRoom === null}
          text="Choose a name"
          onConfirm={(value)=>{
            if(value){this.connectToRoom(this.props.roomID, value);}
          }}
        />
      </div>
    );
  }
}

export default withStyles((theme) => createStyles({
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
}))(OthelloWithChat);
