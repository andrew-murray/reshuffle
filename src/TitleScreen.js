import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";

function TitleScreen(props) {

  const history = useHistory();

  const menuItems = [
    {text: "Create Room"},
    {text: "Join Room"},
    {text: "Practice", path: "/practice"},
    {text: "Settings"}
  ];

  const listItems = menuItems.map( (item) =>
    <ListItem key={item.text}>
        <Button
          variant="contained" style={{width: "100%"}} aria-label={item.text}
          onClick={(event)=>{
            if(item.path){
              history.push(item.path);
            }
          }}
        >
          {item.text}
        </Button>
    </ListItem>
  );

  return (
    <List aria-label="menu">
      {listItems}
    </List>
  );
}

export default TitleScreen;
