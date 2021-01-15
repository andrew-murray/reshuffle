import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';

class ChatDrawer extends React.Component
{
    constructor(props)
    {
      super(props);
      this.state = {
        currentMessage: ""
      }
    }

    render()
    {
      const messageItems = [...Array(this.props.messages.length).keys()].map(messageIndex=>
        <ListItem key={"message-" + messageIndex.toString()}>
          <ListItemText primary={this.props.messages[messageIndex]}>
          </ListItemText>
        </ListItem>
      );

      const onMessageChange = (event)=>
      {
        this.setState( {currentMessage: event.target.value} );
      };

      const onChatSend = (event)=>
      {
        if(this.state.currentMessage && this.props.onSend){
          const currentMessage = this.state.currentMessage;
          this.setState(
            {currentMessage:""},
            ()=>{this.props.onSend(currentMessage);}
          );
        }
        event.preventDefault();
      };

      const localStyle = {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end"
      };
      const drawerStyle = Object.assign( Object.assign({}, localStyle), this.props.style );

      // another option for this list, is react-window?
      return (
          <Drawer
            variant="permanent"
            anchor="right"
            style={drawerStyle}
            className={this.props.className}
          >
            <Paper
              // column-reverse means the browser will scroll to the bottom!
              // todo: this may not be a long-term solution because all the
              // chat is bottom aligned when the chat doesn't fill the page
              style={{overflow: "auto", flexGrow: 1, display: "flex", flexDirection: "column-reverse", width: drawerStyle.width ? drawerStyle.width : "inherit"}}
              >
              <List aria-label="menu" >
                {messageItems}
              </List>
            </Paper>
            <form onSubmit={onChatSend}>
              <div style={{display: "flex"}}>
                  <Input inputProps={{ 'aria-label': 'enter message' }} value={this.state.currentMessage} onChange={onMessageChange} style={{flexGrow: 1}}/>
                  <Button variant="contained" color="primary" onClick={onChatSend} style={{alignSelf: "flex-end"}}>Send</Button>
              </div>
            </form>
          </Drawer>
      );
    }
}

export default ChatDrawer;
