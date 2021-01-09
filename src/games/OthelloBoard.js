import React, { Component } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import OthelloRules from "./OthelloRules";
import PropTypes from 'prop-types'

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

        // general events
        onClick={this.props.onClick}
        onTap={this.props.onTap}
        onDblTap={this.props.onDblTap}
      />
    );
  }
}

class Counter extends React.Component {
  state = {
    color: this.props.color
  }

  render() {
    // todo: consider using css shading from this snippet
    // https://codepen.io/aush/pen/XKKVyo

    const onMouseOver = () => {
      if(this.props.hoverColor || this.props.hoverOpacity)
      {
        this.setState( {
          color: this.props.hoverColor,
          opacity: this.props.hoverOpacity
        } );
      }
    };

    const onMouseOut = () => {
      if(
        this.props.color !== this.state.color
        || this.props.opacity !== this.state.opacity)
      {
        this.setState( {
          color: this.props.color,
          opacity: 1.0
        } );
      }
    };

    // todo: this is kinda no good - because clicking kinda
    // updates the cell but not really

    return (
      <Circle
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.state.color}
        opacity={this.state.opacity}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}

        // general events
        onClick={this.props.onClick}
        onTap={this.props.onTap}
        onDblTap={this.props.onDblTap}
      />
    )
  }
}

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

class OthelloBoard extends Component {
  render() {
    console.log("rerender board??");
    const availableMoves = OthelloRules.changesForAllPositions(
      this.props.game,
      this.props.player
    );

    const width = this.props.width;
    const height = this.props.height;

    const rows = 8;
    const columns = 8;

    const defaultColorForCellState = (cellState, pos) => {
      return cellState === OthelloRules.labels.white ? "white"
           : cellState === OthelloRules.labels.black ? "black"
                                                     : "#b87340";
    };

    const hoverColorForCellState = (cellState, pos) => {
      const colorForPlayer = this.props.player === OthelloRules.labels.white ? "white" : "black";
      return cellState === OthelloRules.labels.white ? undefined
           : cellState === OthelloRules.labels.black ? undefined
           : moveIsPossible(cellState, pos)          ? colorForPlayer
                                                     : this.props.impossibleColor;
    };

    const moveIsPossible = (cellState, pos) =>
    {
      const empty = cellState === OthelloRules.labels.empty;
      return empty && availableMoves.filter(
        move => move.position[0] === pos[0] && move.position[1] === pos[1]
      ).length > 0;
    };

    const showCounterForCell = (cellState, pos) => {
      return (this.props.impossibleColor && this.props.possibleColor) // short-circuit, when we're displaying everything
          || cellState === OthelloRules.labels.white
          || cellState === OthelloRules.labels.black
          || (this.props.possibleColor && moveIsPossible(pos));
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
      const clickHandler = (event) => {
        makeMove(y,x,moveIsPossible(cellState, [y,x]));
      };
      // fixme: I think the hover functionality should really be on the cell
      // and they should be wrapped together as one component
      return (
        <React.Fragment>
          <Cell
            key={"cell-"+y.toString()+"-"+x.toString()}
            y={yStart}
            x={xStart}
            width={cellWidth}
            height={cellHeight}
            color={"#b87340"}
            onClick={clickHandler}
            onTap={clickHandler}
            onDblTap={clickHandler}
          />
          { showCounterForCell(cellState, [y,x]) &&
            <Counter
              key={"counter-"+y.toString()+"-"+x.toString()}
              y={yStart + (cellHeight/2)}
              x={xStart + (cellWidth/2)}
              width={cellWidth * 0.85}
              height={cellHeight * 0.85}
              color={defaultColorForCellState(cellState, [y,x])}
              hoverColor={hoverColorForCellState(cellState, [y,x])}
              onClick={clickHandler}
              onTap={clickHandler}
              onDblTap={clickHandler}
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
