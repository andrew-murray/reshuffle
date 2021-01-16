import {Component} from "react"
import OthelloBoard from "./OthelloBoard"
import OthelloRules from "./OthelloRules";

class OfflineOthelloGame extends Component
{
  state = {
    game: OthelloRules.createInitialBoardState(),
    player: OthelloRules.labels.black
  }

  render()
  {
    return (
      <OthelloBoard
        width={400}
        height={400}
        game={this.state.game}
        showMovesForPlayer={this.state.player}
        onMove={(action)=>{
          if(action.position)
          {
            const updatedBoardState = OthelloRules.createBoardStateWithMove(
              this.state.game,
              action.position,
              this.state.player
            );
            const opponent = OthelloRules.opponentForPlayer(this.state.player);
            const opponentCanPlay = OthelloRules.playerCanPlay(
              updatedBoardState,
              opponent
            );
            const nextPlayer = opponentCanPlay ? opponent: this.state.player;
            this.setState( {
              game: updatedBoardState,
              player: nextPlayer
            } );
          }
        }}
      />
    );
  }
}


export {OfflineOthelloGame};
