import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';

import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080/";

class ChatDrawer extends React.Component
{
    constructor(props)
    {
      super(props);
      this.state = {
        currentMessage: "",
        messages: [],
        joinedRoom: ""
      }
      this.socket = null;
    }

    attachToRoom(roomID)
    {
      if(this.state.joinedRoom !== roomID)
      {
        console.log("joining newRoom " + roomID)
        const attachToNewRoom = ()=>{
          this.socket.emit('chat.join', roomID);
        };
        this.setState({messages: [], joinedRoom: roomID}, attachToNewRoom);
      }
    }

    componentDidMount() {
      this.socket = io(ENDPOINT);
      this.socket.on('chat.message', (msg)=>{
        this.setState({messages: this.state.messages.concat(msg)});
      });
      this.attachToRoom(this.props.match.params.roomID)
    }

    componentDidUpdate() {
      this.attachToRoom(this.props.match.params.roomID)
    }

    render()
    {
      const messageItems = [...Array(this.state.messages.length).keys()].map(messageIndex=>
        <ListItem key={"message-" + messageIndex.toString()}>
          <ListItemText primary={this.state.messages[messageIndex]}>
          </ListItemText>
        </ListItem>
      );

      const onMessageChange = (event)=>
      {
        this.setState( {currentMessage: event.target.value} );
      };

      const onChatSend = (event)=>
      {
        if(this.state.currentMessage && this.socket){
          this.socket.emit("chat.message", this.state.currentMessage);
          this.setState({currentMessage:""})
        }
        event.preventDefault();
      };

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
                <Input inputProps={{ 'aria-label': 'enter message' }} value={this.state.currentMessage} onChange={onMessageChange}/>
                <Button variant="contained" color="primary" onClick={onChatSend}>Send</Button>
              </form>
            </div>
          </Drawer>
      );
    }
}

export default ChatDrawer;
