import React from 'react';
import Button from '@material-ui/core/Button';
import { useHistory, Link } from "react-router-dom";
import TextEntryDialog from "./TextEntryDialog";
import TitledDialog from "./TitledDialog";
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import SessionTable from "./SessionTable";

const useStyles = makeStyles((theme) => ({
  actionGroup: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const infoStyles = {
  position:"absolute",
  bottom: 0,
  right: 0
};

function TitleScreen(props) {
  const classes = useStyles();

  const history = useHistory();

  let [joinDialogOpen, setJoinDialogOpen] = React.useState(false);
  let [infoDialogOpen, setInfoDialogOpen] = React.useState(false);

  const makeButton = (text, onClick) => <Button
    key={text}
    variant="contained" aria-label={text}
    onClick={onClick}
  >
    {text}
  </Button>

  const joinRoom = (roomName)=>{
    if(roomName)
    {
      history.push("/othello/room/" + roomName);
      if(joinDialogOpen){setJoinDialogOpen(false);}
    }
  };

  return (
    <main>
      <SessionTable
        onJoin={joinRoom}
        />
      <div className={classes.actionGroup}>
        {makeButton("Create Room", props.onCreate)}
        {makeButton("Find Room", ()=>{setJoinDialogOpen(true);})}
        {makeButton("Practice", ()=>{ history.push("/othello/practice"); })}
      </div>
      <TextEntryDialog
        open={joinDialogOpen}
        text="Enter room name"
        onConfirm={joinRoom}
        onCancel={()=>{setJoinDialogOpen(false);}}
      />
      <TitledDialog
        open={infoDialogOpen}
        title="Attributions"
        onClose={()=>{setInfoDialogOpen(false)}}
      >
        <Typography>
          reshuffle uses sounds from <Link
            to={{ pathname: "https://www.zapsplat.com/" }}
            target="_blank"
           >
            zapsplat
          </Link>
        </Typography>
      </TitledDialog>
      <div style={infoStyles}>
        <IconButton onClick={()=>{setInfoDialogOpen(true)}}>
          <InfoIcon color="primary"/>
        </IconButton>
      </div>
    </main>
  );
}

export default TitleScreen;
