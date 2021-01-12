import React from 'react';

import { useParams } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';

import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080/";

function ChatDrawer(props) {

  React.useEffect(() => {
    let socket = io(ENDPOINT);
    window.socket = socket;
    console.log(socket);
  }, []);

  const { roomID } = useParams();

  const staticMessages = [
    "Simple Message",
    "Another Message",
    "A third"
  ];

  let [messages, setMessages] = React.useState( staticMessages );
  let [currentMessage, setCurrentMessage] = React.useState( "" );

  const messageItems = [...Array(messages.length).keys()].map(messageIndex=>
    <ListItem key={"message-" + messageIndex.toString()}>
      <ListItemText primary={messages[messageIndex]}>
      </ListItemText>
    </ListItem>
  );

  const onMessageChange = (event)=>
  {
    setCurrentMessage(event.target.value);
  };

  const onChatSend = (event)=>
  {
    if(currentMessage){
      setMessages(messages.concat(currentMessage));
      setCurrentMessage("");
    }
    event.preventDefault();
  }

  // another option for this list, is react-window?
  return (
      <Drawer
        variant="permanent"
        anchor="right"
        style={{display: "flex", flexDirection: "row", alignItems: "flex-end"}}
      >
        <Paper
          // column-reverse means the browser will scroll to the bottom!
          // todo: this may not be a long-term solution because all the
          // chat is bottom aligned when the chat doesn't fill the page
          style={{overflow: "auto", flexGrow: 1, display: "flex", flexDirection: "column-reverse"}}
          >
          <List aria-label="menu" >
            {messageItems}
          </List>
        </Paper>
        <div>
          <form onSubmit={onChatSend}>
            <Input inputProps={{ 'aria-label': 'enter message' }} value={currentMessage} onChange={onMessageChange}/>
            <Button variant="contained" color="primary" onClick={onChatSend}>Send</Button>
          </form>
        </div>
      </Drawer>
  );
}

export default ChatDrawer;
