import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OthelloRules from "./OthelloRules"
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import CircleIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function OthelloStatusBar(props) {

  const classes = useStyles();
  const blackFirst = props.role === OthelloRules.labels.black;

  return (
    <div className={classes.root} style={{margin: "1vh"}}>
        <Chip key="score-1"
          icon={<CircleIcon style={{color: blackFirst ? "#000000" : "#ffffff"}}/>}
          label={blackFirst ? props.blackScore : props.whiteScore}
          className={classes.chip}
        />
        <Chip key="score-2"
          icon={<CircleIcon style={{color: blackFirst ? "#ffffff" : "#000000"}}/>}
          label={blackFirst ? props.whiteScore : props.blackScore }
          className={classes.chip}
        />
    </div>
  );
}

export default OthelloStatusBar;
