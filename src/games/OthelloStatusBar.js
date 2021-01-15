import React from 'react';
import OthelloRules from "./OthelloRules"
import Typography from '@material-ui/core/Typography';

function OthelloStatusBar(props) {

  const textForRole = (role)=>
  {
    if(role === OthelloRules.labels.white){ return "white"; }
    if(role === OthelloRules.labels.black){ return "black"; }
    return "observing";
  };

  const hasRole = !!props.role;

  return (
    <React.Fragment>
      <Typography>
        You are {textForRole(props.role)}.
      </Typography>
      {!hasRole || <React.Fragment>
      <Typography>
        You have {props.role === OthelloRules.labels.white ? props.whiteScore : props.blackScore} points.
      </Typography>
      <Typography>
        Your opponent has {props.role === OthelloRules.labels.white ? props.blackScore : props.whiteScore}.
      </Typography>
      </React.Fragment>
      }
      {
        hasRole || <React.Fragment>
        <Typography>
          White has {props.whiteScore}.
        </Typography>
        <Typography>
          Black has {props.blackScore}.
        </Typography>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default OthelloStatusBar;
