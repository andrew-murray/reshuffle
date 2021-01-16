import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { useHistory, Link } from "react-router-dom";
import TextEntryDialog from "./TextEntryDialog";
import TitledDialog from "./TitledDialog";
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';



const infoStyles = {
  position:"absolute",
  bottom: 0,
  right: 0
};

function TitleScreen(props) {

  const history = useHistory();

  let [joinDialogOpen, setJoinDialogOpen] = React.useState(false);
  let [infoDialogOpen, setInfoDialogOpen] = React.useState(false);

  const menuItems = [
    {text: "Create Room",onClick: props.onCreate},
    {text: "Join Room", onClick: ()=>{setJoinDialogOpen(true);} },
    {text: "Practice", onClick: ()=>{ history.push("/othello/practice"); }}
  ];

  const listItems = menuItems.map( (item) =>
    <ListItem key={item.text}>
        <Button
          variant="contained" style={{width: "100%"}} aria-label={item.text}
          onClick={item.onClick}
        >
          {item.text}
        </Button>
    </ListItem>
  );

  return (
    <React.Fragment>
      <List aria-label="menu">
        {listItems}
      </List>
      <TextEntryDialog
        open={joinDialogOpen}
        text="Enter room name"
        onConfirm={(roomName)=>{
          if(roomName)
          {
            history.push("/othello/room/" + roomName);
            setJoinDialogOpen(false);
          }
        }}
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
    </React.Fragment>
  );
}

export default TitleScreen;
