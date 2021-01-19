import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import TextEntryDialog from "./TextEntryDialog";
import TitledDialog from "./TitledDialog";
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import socket from "./socket";

import SessionTable from "./SessionTable";

const styler = (theme) => ({
  actionGroup: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
});

const infoStyles = {
  position:"absolute",
  bottom: 0,
  right: 0
};

class TitleScreen extends React.Component
{

  state = {
    rooms: [],
    joinDialogOpen: false,
    infoDialogOpen: false
  }

  constructor(props)
  {
    super(props);
    this.updateRoomData = (roomData)=>{this.setState({rooms: roomData.rooms});};
  }


  componentDidMount()
  {
    socket.on("othello.rooms.list", this.updateRoomData);
    socket.emit("othello.rooms.request");
  }

  componentWillUnmount()
  {
    socket.off("othello.rooms.list", this.updateRoomData);
  }

  render()
  {
    const classes = this.props.classes;
    const history = this.props.history;

    const makeButton = (text, onClick) => <Button
      key={text}
      variant="contained" aria-label={text}
      onClick={onClick}
    >
      {text}
    </Button>

    const joinRoom = (roomName) =>
    {
      if(roomName)
      {
        history.push("/othello/room/" + roomName);
        if(this.state.joinDialogOpen){this.setState({joinDialogOpen: false});}
      }
    };

    return (
      <main>
        <SessionTable
          onJoin={joinRoom}
          rooms={this.state.rooms}
          />
        <div className={classes.actionGroup}>
          {makeButton("Create Room", this.props.onCreate)}
          {makeButton("Find Room", ()=>{this.setState( {joinDialogOpen: true} );})}
          {makeButton("Practice", ()=>{ history.push("/othello/practice"); })}
        </div>
        <TextEntryDialog
          open={this.state.joinDialogOpen}
          text="Enter room name"
          onConfirm={joinRoom}
          onCancel={()=>{this.setState( {joinDialogOpen: false} );}}
        />
        <TitledDialog
          open={this.state.infoDialogOpen}
          title="Attributions"
          onClose={()=>{this.setState( {infoDialogOpen: false} );}}
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
          <IconButton onClick={()=>{this.setState( {infoDialogOpen: true} );}}>
            <InfoIcon color="primary"/>
          </IconButton>
        </div>
      </main>
    );
  }
}

export default withStyles(styler)(TitleScreen);
