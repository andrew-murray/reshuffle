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
import OthelloGame from "./games/OthelloGame"

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
          <div className="App">
            <Switch>
              <Route exact path="/">
                <TitleScreen />
              </Route>
              <Route exact path="/practice">
                <OthelloGame />
              </Route>
            </Switch>
          </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
