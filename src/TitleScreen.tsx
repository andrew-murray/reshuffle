import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import TextEntryDialog from "./TextEntryDialog";
import TitledDialog from "./TitledDialog";
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import socket from "./socket";

import SessionTable from "./SessionTable";

const styler = (theme) => ({
  actionGroup: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
});

const infoStyles = {
  position:"absolute",
  bottom: 0,
  right: 0
};

type TitleScreenProps = {
  onCreate: any,
  history: any,
  match: any
};

class TitleScreen extends React.Component<TitleScreenProps>
{

  state = {
    rooms: [],
    joinDialogOpen: false,
    infoDialogOpen: false,
    connectedToServer: false
  }

  constructor(props)
  {
    super(props);
    this.updateRoomData = (roomData)=>{this.setState({rooms: roomData.rooms});};
    this.updateConnectedStatus = ()=>{this.setState({connectedToServer: socket.connected});};
  }


  componentDidMount()
  {
    this.updateConnectedStatus();
    socket.on("connect", this.updateConnectedStatus);
    socket.on("disconnect", this.updateConnectedStatus);
    socket.on("othello.rooms.list", this.updateRoomData);
    socket.emit("othello.rooms.request");
    this.interval = setInterval(
      ()=>{socket.emit("othello.rooms.request");},
      5000
    );
  }

  componentWillUnmount()
  {
    socket.off("connect", this.updateConnectedStatus);
    socket.off("disconnect", this.updateConnectedStatus);
    socket.off("othello.rooms.list", this.updateRoomData);
    clearInterval(
      this.interval
    );
  }

  render()
  {
    const classes = this.props.classes;
    const history = this.props.history;

    const makeButton = (text, disabled, onClick) => <Button
      key={text}
      variant="contained" aria-label={text}
      onClick={onClick}
      disabled={disabled}
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
      <div>
        <SessionTable
          onJoin={joinRoom}
          rooms={this.state.rooms}
          />
        <div className={classes.actionGroup}>
          {makeButton("Create Room", !this.state.connectedToServer, this.props.onCreate)}
          {makeButton("Find Room", !this.state.connectedToServer, ()=>{this.setState( {joinDialogOpen: true} );})}
          {makeButton("Practice", false, ()=>{ history.push("/othello/practice"); })}
        </div>
        {!this.state.connectedToServer &&
          <div style={{width:"100%", display: "flex", justifyContent: "center", paddingTop: "1vh"}}>
            <Card style={{maxWidth: 350}}>
              <Paper>
                <CardMedia>
                  <CircularProgress style={{marginTop:"3vh"}}/>
                </CardMedia>
                <CardContent>
                  <Typography>This demo uses a low-cost backend server which starts up on demand.</Typography>
                  <Typography>If no one else is playing, there'll typically be a 30 second delay before the server is ready.</Typography>
                </CardContent>
              </Paper>
            </Card>
          </div>
        }
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
      </div>
    );
  }
}

export default withStyles(styler)(TitleScreen);
