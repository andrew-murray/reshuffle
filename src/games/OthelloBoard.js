import React, { Component } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';

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
  render() {

    const width = this.props.width;
    const height = this.props.height;

    const rows = 8;
    const columns = 8;

    const colorForCellState = (cellState) => {
      return cellState == 1 ? "white" : "black";
    };

    const showCounterForCell = (cellState) => {
      return cellState != 0;
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
          { showCounterForCell(cellState) &&
            <Counter
              key={"counter-"+y.toString()+"-"+x.toString()}
              y={yStart + (cellHeight/2)}
              x={xStart + (cellWidth/2)}
              width={cellWidth * 0.85}
              height={cellHeight * 0.85}
              color={colorForCellState(cellState)}
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
