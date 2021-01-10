import {Component} from "react"
import OthelloBoard from "./OthelloBoard"
import OthelloRules from "./OthelloRules"

class OthelloGame extends Component
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
        possibleColor="purple"
        impossibleColor="red"
        player={this.state.player}
        onMove={(action)=>{
          if(action.position)
          {
            this.setState( {
              game: OthelloRules.createBoardStateWithMove(this.state.game, action.position, action.role),
              player: OthelloRules.opponentForPlayer(this.state.player)
            } );
          }
        }}
      />
    );
  }
}

export default OthelloGame;
