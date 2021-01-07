import './App.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

function App() {
  const menuItems = [
    "Create Room",
    "Join Room",
    "Practice",
    "Settings"
  ];
  const listItems = menuItems.map( (text) =>
    <ListItem key={text}>
        <Button variant="contained" style={{width: "100%"}} aria-label={text}>{text}</Button>
    </ListItem>
  );

  return (
    <div className="App">
        <List aria-label="menu">
          {listItems}
        </List>
    </div>
  );
}

export default App;
