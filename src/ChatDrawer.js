import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';

function ChatDrawer(props) {

  const messages = [
    "Simple Message",
    "Another Message",
    "A third"
  ];

  const messageItems = [...Array(messages.length).keys()].map(messageIndex=>
    <ListItem key={"message-" + messageIndex.toString()}>
      <ListItemText primary={messages[messageIndex]}>
      </ListItemText>
    </ListItem>
  );

  // another option for this list, is react-window?
  return (
      <Drawer
        variant="permanent"
        anchor="right"
        style={{display: "flex", flexDirection: "row", alignItems: "flex-end"}}
      >
        <Paper
          style={{overflow: "auto", flexGrow: 1}}
          >
          <List aria-label="menu">
            {messageItems}
          </List>
        </Paper>
        <div>
          <Input inputProps={{ 'aria-label': 'enter message' }} />
          <Button variant="contained" color="primary">Send</Button>
        </div>
      </Drawer>
  );
}

export default ChatDrawer;
