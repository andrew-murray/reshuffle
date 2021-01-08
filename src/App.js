import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import TitleScreen from "./TitleScreen";
import OthelloBoard from "./boards/OthelloBoard"

/*
class SessionProvider{
  create(){return "";}
  get(sessionID){return {};}
  update(sessionID, action){return {};}
  close(sessionID){}
};
*/

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
          <Switch>
            <Route exact path="/">
              <TitleScreen />
            </Route>
            <Route exact path="/othello">
              <OthelloBoard />
            </Route>
          </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
