import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import TitleScreen from "./TitleScreen";
import ChatDrawer from "./ChatDrawer";
import {OfflineOthelloGame, OnlineOthelloGame} from "./games/OthelloGame"

function App() {

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

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
          <div className="App">
            <Switch>
              <Route exact path="/">
                <TitleScreen />
              </Route>
              <Route exact path="/practice">
                <OfflineOthelloGame />
              </Route>
              <Route
                path="/room/:roomID/"
                component={(props) =>
                  <React.Fragment>
                    <OnlineOthelloGame />
                    <ChatDrawer match={props.match}/>
                  </React.Fragment>
                }
              />
            </Switch>
          </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
