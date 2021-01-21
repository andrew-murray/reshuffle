import React, { Component } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import OthelloRules from "./OthelloRules";

class OthelloCell extends React.Component{

  state = {
    hovered: false
  }

  render(){
    const onMouseOver = () => {
      this.setState({hovered: true});
    };

    const onMouseOut = () => {
      this.setState({hovered: false});
    };

    const boardColor = "#b87340";
    const defaultColorForCellState = (cellState) => {
      return cellState === OthelloRules.labels.white ? "white"
           : cellState === OthelloRules.labels.black ? "black"
                                                     : boardColor;
    };

    const hoverColorForCellState = (cellState, possible) => {
      const colorForPlayer = this.props.player === OthelloRules.labels.white ? "white" : "black";
      return cellState === OthelloRules.labels.white ? "white"
           : cellState === OthelloRules.labels.black ? "black"
           : possible                     ? colorForPlayer
                                          : this.props.impossibleColor;
    };

    const hoverColor = hoverColorForCellState(this.props.gameState, this.props.possible);
    const defaultColor = defaultColorForCellState(this.props.gameState);
    const hoverIsDifferent = hoverColor !== defaultColor;

    const lightPosition = 0;

    // let's presume light-position at board position 0,0 at height 800
    // with flat counters, the center of the specular highlight is where?
    // presume spherical counters?

    // draw a line from the cell center to the point and cut it off at "circle"-"radius"
    const gradientStartPositionForCell = (y,x, cellHeight, cellWidth, radius)=>
    {
      const counterCenterBoardSpace = { x: (x * cellWidth) + cellWidth/2, y: (y * cellHeight) + cellHeight/2, z: 0};
      const lightPositionBoardSpace = {x: 4 * cellWidth, y: 4 * cellHeight, z: 200};
      const directionToLight = {
        x: lightPositionBoardSpace.x - counterCenterBoardSpace.x,
        y: lightPositionBoardSpace.y - counterCenterBoardSpace.y,
        z: lightPositionBoardSpace.z - counterCenterBoardSpace.z
      };
      const dirToLightSq = Math.sqrt(directionToLight.x * directionToLight.x
      + directionToLight.y * directionToLight.y
      + directionToLight.z * directionToLight.z);
      // note: that this is a direction! We can just use it in "counterSpace"
      const normalisedDir = {
        x: directionToLight.x / dirToLightSq,
        y: directionToLight.y / dirToLightSq,
        z: directionToLight.z / dirToLightSq
      };
      const pos = { x: normalisedDir.x * radius, y : normalisedDir.y * radius};
      return pos;

    };

    // fillRadialGradientStartPoint={{x: -this.props.width *0.5/2, y: -this.props.height*0.5/2}}

    return(
      <React.Fragment>
        <Rect
          y={this.props.y}
          x={this.props.x}
          width={this.props.width}
          height={this.props.height}

          fill={this.props.highlight ? "#83ce7a" :"#b87340"}
          shadowBlur={5}

          onClick={this.props.onClick}
          onTap={this.props.onClick}
          onDblTap={this.props.onClick}

          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        />
        <Circle
          y={this.props.y + (this.props.height/2)}
          x={this.props.x + (this.props.width/2)}
          width={this.props.width * 0.85}
          height={this.props.height * 0.85}

          shadowBlur={defaultColor !== boardColor ? 1: undefined}

          fillRadialGradientStartPoint={gradientStartPositionForCell(this.props.y, this.props.x, this.props.height, this.props.width, this.props.width/4)}
          fillRadialGradientStartRadius={0}
          fillRadialGradientEndRadius={this.props.width}
          fillRadialGradientColorStops={defaultColor == "white" ? [0,"#ffffff", 1, "#bbbbbb"]
                                      : defaultColor == "black" ? [0,"#555555", 0.3, "#101010"]
                                      : undefined}
          opacity={(hoverIsDifferent && this.state.hovered) ? 0.5 : undefined }


          onClick={this.props.onClick}
          onTap={this.props.onClick}
          onDblTap={this.props.onClick}

          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        />
      </React.Fragment>
    );
  }
};


class OthelloBoard extends Component {
  render() {
    let availableMoves = [];
    if(this.props.showMovesForPlayer)
    {
      availableMoves = OthelloRules.changesForAllPositions(
        this.props.game,
        this.props.showMovesForPlayer
      );
    }

    const width = this.props.width;
    const height = this.props.height;

    const rows = 8;
    const columns = 8;

    const moveIsPossible = (cellState, pos) =>
    {
      const empty = cellState === OthelloRules.labels.empty;
      return empty && availableMoves.filter(
        move => move.position[0] === pos[0] && move.position[1] === pos[1]
      ).length > 0;
    };

    const makeMove = (y,x,possible)=>
    {
      if(this.props.onMove && possible)
      {
        this.props.onMove( {position: [y,x]} );
      }
    };

    const makeCell = (y,x,cellState) => {
      const cellWidth = width / columns;
      const cellHeight =  height / rows;
      const yStart = y * cellHeight;
      const xStart = x * cellWidth;
      const movePossible = moveIsPossible(cellState, [y,x]);
      const highlightCell = this.props.highlightCell && this.props.highlightCell[0] == y && this.props.highlightCell[1] == x;
      const clickHandler = movePossible ? (event)=>{makeMove(y,x,true)} : undefined;
      return (
        <OthelloCell
          key={"othello-cell-" + y.toString() + "-" + x.toString()}
          width={cellWidth}
          height={cellHeight}
          boardPosition={[y,x]}
          player={this.props.showMovesForPlayer}
          x={xStart}
          y={yStart}
          gameState={cellState}
          possible={movePossible}
          onClick={clickHandler}
          highlight={highlightCell}
        />
      );
    };

    const rowArray = [...Array(rows).keys()];
    const colArray = [...Array(columns).keys()];

    // Stage is a div container
    // Layer is actual canvas element (so you may have several canvases in the stage)
    // And then we have canvas shapes inside the Layer
    return (
      <Stage width={width} height={height} style={this.props.style}>
        <Layer>
          {
            rowArray.map( y => { return colArray.map( x => makeCell(y,x,this.props.game[y][x]))})
          }
        </Layer>
      </Stage>
    );
  }
}

export default OthelloBoard;
