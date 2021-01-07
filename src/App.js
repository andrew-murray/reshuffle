import './App.css';
import React from 'react';
import TitleScreen from "./TitleScreen";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

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
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {TitleScreen({})}
    </ThemeProvider>
  );
}

export default App;
