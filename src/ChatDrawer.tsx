import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Device from "./Device";

type PropTypes = {
  messages: Array<any>
  onSend: (string)=>void
};

class ChatDrawer extends React.Component<PropTypes>
{
    constructor(props)
    {
      super(props);
      this.state = {
        currentMessage: "",
        chatDrawerOpen: true
      }
    }

    render()
    {
      const messages = this.props.messages;
      const messageItems = [...Array(messages.length).keys()].map(messageIndex=>{
        const message = messages[messageIndex];
        return <ListItem
          dense
          key={"message-" + messageIndex.toString()}
        >
          <ListItemText
            primary={message.sender ? message.sender.name
                                    : message.text}
            secondary={message.sender ? message.text : undefined}
          />
        </ListItem>
      });

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

      const mobile = Device.detectMobile();
      const mobileIOS = mobile && Device.detectIOS();
      const DrawerComponent = !mobile ? Drawer : SwipeableDrawer;
      // another option for this list, is react-window?
      return (
          <DrawerComponent
            variant={!mobile ? "permanent" : undefined}
            anchor="right"
            style={drawerStyle}
            className={this.props.className}
            // stateManagement on all the time, but is irrelevant when not on mobile
            open={this.state.chatDrawerOpen}
            onOpen={()=>{this.setState({chatDrawerOpen: true})}}
            onClose={()=>{this.setState({chatDrawerOpen: false})}}
            // recommended default settings for SwipeableDrawer
            disableBackdropTransition={mobileIOS ? true : undefined}
            disableDiscovery={mobileIOS ? true : undefined}
          >
            <Paper
              // column-reverse means the browser will scroll to the bottom!
              // todo: this may not be a long-term solution because all the
              // chat is bottom aligned when the chat doesn't fill the page
              style={{
                overflow: "auto",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column-reverse",
                width: drawerStyle.width ? drawerStyle.width : "inherit"
              }}
              >
              <List aria-label="menu" >
                {messageItems}
              </List>
            </Paper>
            <form onSubmit={onChatSend}>
              <div style={{display: "flex", width: drawerStyle.width ? drawerStyle.width : "inherit"}}>
                  <Input inputProps={{ 'aria-label': 'enter message' }} value={this.state.currentMessage} onChange={onMessageChange} style={{flexGrow: 1}}/>
                  <Button variant="contained" color="primary" onClick={onChatSend} style={{alignSelf: "flex-end"}}>Send</Button>
              </div>
            </form>
          </DrawerComponent>
      );
    }
}

export default ChatDrawer;
