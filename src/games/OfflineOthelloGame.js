import {Component} from "react"
import OthelloBoard from "./OthelloBoard"
import OthelloRules from "./OthelloRules";
import OthelloStatusBar from "./OthelloStatusBar"
import Button from '@material-ui/core/Button';

const mp3File = "zapsplat_impacts_wood_thin_small_panel_knock_hit_lite_muted_004_39796.mp3";
const notifyNoise = new Audio(process.env.PUBLIC_URL + "/" + mp3File);

class OfflineOthelloGame extends Component
{
  state = {
    board: OthelloRules.createInitialBoardState(),
    player: OthelloRules.labels.black,
    windowWidth: null,
    windowHeight: null
  }

  constructor(props)
  {
    super(props);
    this.updateWindowDimensions = ()=>{this.setState((props,state)=>{
         return{ windowWidth: window.innerWidth, windowHeight: window.innerHeight };
    });};
  }


  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount()
  {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  render()
  {
    const whiteScore = OthelloRules.countCellsForRole(this.state.board, OthelloRules.labels.white);
    const blackScore = OthelloRules.countCellsForRole(this.state.board, OthelloRules.labels.black);
    // default board to be only as big as 85% of the screen's width
    // we have additional content to fit vertically, so leave some extra wiggle room
    const boardSize = Math.min( Math.min( this.state.windowWidth * 0.85, this.state.windowHeight * 0.75 ) , 450 );

    const sendReset = () =>
    {
      this.setState( {board: OthelloRules.createInitialBoardState()} );
    };

    return (
      <main>
      <OthelloBoard
        width={boardSize}
        height={boardSize}
        game={this.state.board}
        showMovesForPlayer={this.state.player}
        onMove={(action)=>{
          if(action.position)
          {
            const updatedBoardState = OthelloRules.createBoardStateWithMove(
              this.state.board,
              action.position,
              this.state.player
            );
            const opponent = OthelloRules.opponentForPlayer(this.state.player);
            const opponentCanPlay = OthelloRules.playerCanPlay(
              updatedBoardState,
              opponent
            );
            const nextPlayer = opponentCanPlay ? opponent: this.state.player;

            notifyNoise.play();

            this.setState(
              {
                board: updatedBoardState,
                player: nextPlayer
              },
              ()=>{notifyNoise.play();}
            );
          }
        }}
      />
      <OthelloStatusBar
        role={OthelloRules.labels.black}
        active={this.state.player}
        whiteScore={whiteScore}
        blackScore={blackScore}
      />
        <div style={{padding: "1vh"}}>
          <Button variant="contained" onClick={sendReset} color="primary"> Reset </Button>
        </div>
      </main>
    );
  }
}


export default OfflineOthelloGame;
