import React, { Component } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import OthelloRules from "./OthelloRules";
import PropTypes from 'prop-types'

/*
Counter.defaultProps = {
  hoverOpacity: 0.5
};

Counter.propTypes = {

  // color to be displayed by default
  color: PropTypes.string.isRequired,

  // color to be displayed on hover
  hoverColor:  PropTypes.string,

  // opacity to be applied when hovered
  hoverOpacity: PropTypes.number
};
*/

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

    const defaultColorForCellState = (cellState) => {
      return cellState === OthelloRules.labels.white ? "white"
           : cellState === OthelloRules.labels.black ? "black"
                                                     : "#b87340";
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

    if(this.props.boardPosition[0] === 2 && this.props.boardPosition[1] === 4)
    {
      console.log(this.props);
      console.log(this.state);
      console.log(defaultColor);
      console.log(hoverColor);
    }

    return(
      <React.Fragment>
        <Rect
          key={"cell-"+this.props.boardPosition[0].toString()+"-"+this.props.boardPosition[1].toString()}
          y={this.props.y}
          x={this.props.x}
          width={this.props.width}
          height={this.props.height}

          fill={"#b87340"}
          shadowBlur={5}

          onClick={this.props.onClick}
          onTap={this.props.onClick}
          onDblTap={this.props.onClick}

          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        />
        <Circle
          key={"counter-"+this.props.boardPosition[0].toString()+"-"+this.props.boardPosition[1].toString()}
          y={this.props.y + (this.props.height/2)}
          x={this.props.x + (this.props.width/2)}
          width={this.props.width * 0.85}
          height={this.props.height * 0.85}

          fill={this.state.hovered ? hoverColor: defaultColor}
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
    const availableMoves = OthelloRules.changesForAllPositions(
      this.props.game,
      this.props.player
    );

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
        this.props.onMove( {position: [y,x], role: this.props.player} );
      }
    };

    const makeCell = (y,x,cellState) => {
      const cellWidth = width / columns;
      const cellHeight =  height / rows;
      const yStart = y * cellHeight;
      const xStart = x * cellWidth;
      const movePossible = moveIsPossible(cellState, [y,x]);
      const clickHandler = movePossible ? (event)=>{makeMove(y,x,true)} : undefined;
      return (
        <OthelloCell
          width={cellWidth}
          height={cellHeight}
          boardPosition={[y,x]}
          player={this.props.player}
          x={xStart}
          y={yStart}
          gameState={cellState}
          possible={movePossible}
          onClick={clickHandler}
        />
      );
    };

    const rowArray = [...Array(rows).keys()];
    const colArray = [...Array(columns).keys()];

    // Stage is a div container
    // Layer is actual canvas element (so you may have several canvases in the stage)
    // And then we have canvas shapes inside the Layer
    return (
      <Stage width={width} height={height}>
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
