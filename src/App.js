import './App.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

function App() {
  return (
    <div className="App">
        <List aria-label="menu">
          <ListItem key="Create Room">
              <Button variant="contained" style={{width: "100%"}} aria-label="Create Room">Create Room</Button>
          </ListItem>

          <ListItem key="Join Room">
              <Button variant="contained" style={{width: "100%"}} aria-label="Join Room">Join Room</Button>
          </ListItem>

          <ListItem>
              <Button variant="contained" style={{width: "100%"}} aria-label="Practice">Practice</Button>
          </ListItem>

          <ListItem key="Settings">
              <Button variant="contained" style={{width: "100%"}} aria-label="Settings">Settings</Button>
          </ListItem>
        </List>
    </div>
  );
}

export default App;
