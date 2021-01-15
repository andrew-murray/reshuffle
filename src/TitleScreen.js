import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import TextEntryDialog from "./TextEntryDialog";

function TitleScreen(props) {

  const history = useHistory();

  let [joinDialogOpen, setJoinDialogOpen] = React.useState(false);

  const menuItems = [
    {text: "Create Room",onClick: ()=>{ history.push("/othello/room/default");}},
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
    </React.Fragment>
  );
}

export default TitleScreen;
