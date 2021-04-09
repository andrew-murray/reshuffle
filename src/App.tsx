import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import TitleScreen from "./TitleScreen";
import OfflineOthelloGame from "./games/OfflineOthelloGame"
import OnlineOthelloGame from "./games/OnlineOthelloGame"

import socket from "./socket"

function App() {

  const history = useHistory();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  React.useEffect(()=>{
    const onRoomCreated = (roomID: string) =>
    {
      history.push("othello/room/" + roomID);
    };
    socket.on("room.created", onRoomCreated)
    return ()=>{socket.off("room.created", onRoomCreated);}
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
        <div className="App">
          <Switch>
            <Route
              exact path="/"
              component={(props: any)=>
                <TitleScreen
                  onCreate={()=>{socket.emit("chat.create");}}
                  match={props.match}
                  history={props.history}
                />
              }
            />
            <Route exact path="/othello/practice">
              <OfflineOthelloGame />
            </Route>
            <Route
              path="/othello/room/:roomID/"
              component={(props: any)=> <OnlineOthelloGame roomID={props.match.params.roomID} />}
            />
          </Switch>
        </div>
    </ThemeProvider>
  );
}

const RouterRoot : React.FunctionComponent = () =>
{
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <App/>
    </Router>
  );
}

export default RouterRoot;
