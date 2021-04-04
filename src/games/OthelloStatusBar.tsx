import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OthelloRules from "./OthelloRules";
import Chip from '@material-ui/core/Chip';
import CircleIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'center',
    listStyle: 'none'
  },
  chip: {
    margin: theme.spacing(0.5)
  },
}));

type Props = {
  role: number,
  blackScore: number,
  whiteScore: number,
  active: boolean
};

function OthelloStatusBar(props: Props) {

  const classes = useStyles();
  const blackFirst = props.role === OthelloRules.labels.black;
  const blackActive = OthelloRules.labels.black === props.active;
  const whiteActive = OthelloRules.labels.white === props.active;
  const firstActive = (blackFirst && blackActive) || (!blackFirst && whiteActive);
  const secondActive = (!blackFirst && blackActive) || (blackFirst && whiteActive);

  return (
    <div className={classes.root} style={{margin: "1vh", display: "flex"}}>
      <Chip key="score-1"
        icon={<CircleIcon style={{color: blackFirst ? "#000000" : "#ffffff"}}/>}
        label={blackFirst ? props.blackScore : props.whiteScore}
        className={classes.chip}
        style={firstActive ? undefined : {opacity: "50%"}}
      />
      <Chip key="score-2"
        icon={<CircleIcon style={{color: blackFirst ? "#ffffff" : "#000000"}}/>}
        label={blackFirst ? props.whiteScore : props.blackScore }
        className={classes.chip}
        style={secondActive ? undefined : {opacity: "50%"}}
      />
    </div>
  );
}

export default OthelloStatusBar;
