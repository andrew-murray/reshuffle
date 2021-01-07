import './App.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';




function App() {
  return (
    <div className="App">
        <List>
          <ListItem key="CreateRoom">
              <Button variant="contained" style={{width: "100%"}}>Create Room</Button>
          </ListItem>

          <ListItem key="Join Room">
              <Button variant="contained" style={{width: "100%"}}>Join Room</Button>
          </ListItem>

          <ListItem key="Practice">
              <Button variant="contained" style={{width: "100%"}}>Practice</Button>
          </ListItem>

          <ListItem key="Settings">
              <Button variant="contained" style={{width: "100%"}}>Settings</Button>
          </ListItem>
        </List>
    </div>
  );
}

export default App;
