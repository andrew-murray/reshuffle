import React, { Component } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import OthelloRules from "./OthelloRules";

class Cell extends React.Component {
  render() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.color}
        shadowBlur={5}
      />
    );
  }
}

class Counter extends React.Component {
  render() {
    // todo: consider using css shading from this snippet
    // https://codepen.io/aush/pen/XKKVyo

    return (
      <Circle
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.color}
      />
    )
  }
}

class OthelloBoard extends Component {
  state = {
    player: OthelloRules.labels.black
  }
  render() {
    const availableMoves = OthelloRules.changesForAllPositions(
      this.props.game,
      this.state.player
    );
    console.log(availableMoves);

    const width = this.props.width;
    const height = this.props.height;

    const rows = 8;
    const columns = 8;

    const colorForCellState = (cellState, pos) => {
      return cellState === OthelloRules.labels.white ? "white"
           : cellState === OthelloRules.labels.black ? "black"
           : (this.props.possibleColor && moveIsPossible(pos) ) ? this.props.possibleColor
                                                                : this.props.impossibleColor;
    };

    const moveIsPossible = (pos) =>
    {
      return availableMoves.filter(
        move => move.position[0] === pos[0] && move.position[1] === pos[1]
      ).length > 0;
    };

    const showCounterForCell = (cellState, pos) => {
      return (this.props.impossibleColor && this.props.possibleColor) // short-circuit, when we're displaying everything
          || cellState === OthelloRules.labels.white
          || cellState === OthelloRules.labels.black
          || (this.props.possibleColor && moveIsPossible(pos));
    };

    const makeCell = (y,x,cellState) => {
      const cellWidth = width / columns;
      const cellHeight =  height / rows;
      const yStart = y * cellHeight;
      const xStart = x * cellWidth;
      return (
        <React.Fragment>
          <Cell
            key={"cell-"+y.toString()+"-"+x.toString()}
            y={yStart}
            x={xStart}
            width={cellWidth}
            height={cellHeight}
            color={"green"}
          />
          { showCounterForCell(cellState, [y,x]) &&
            <Counter
              key={"counter-"+y.toString()+"-"+x.toString()}
              y={yStart + (cellHeight/2)}
              x={xStart + (cellWidth/2)}
              width={cellWidth * 0.85}
              height={cellHeight * 0.85}
              color={colorForCellState(cellState, [y,x])}
            />
          }
        </React.Fragment>
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
