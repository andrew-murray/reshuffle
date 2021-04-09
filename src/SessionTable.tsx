import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

type RoomData = {
  playerCount: number,
  observerCount: number,
  name: string
};

type Props = React.HTMLAttributes<HTMLElement> & {
  rooms: Array<RoomData>
};

const SessionTable : React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  // the only weird behaviour in the below,
  // is we ensure the table "non-empty" ish, when provided an empty list of rows
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Room</StyledTableCell>
            <StyledTableCell align="right">Players</StyledTableCell>
            <StyledTableCell align="right">Observers</StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(props.rooms.length === 0 ? [{}] : props.rooms).map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.playerCount}</StyledTableCell>
              <StyledTableCell align="right">{row.observerCount}</StyledTableCell>
              <StyledTableCell align="right">
                {row.name && <Button variant="contained" onClick={()=>props.onJoin(row.name)}>Join</Button>}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SessionTable;
