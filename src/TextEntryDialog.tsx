import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

type Props = React.HTMLAttributes<HTMLElement> & {

};

const TextEntryDialog : React.FunctionComponent<Props> = (props) => {

  const [current, setCurrent] = React.useState("");

  const confirmAndReset = ()=>{
    props.onConfirm(current);
    setCurrent("");
  };

  const handleEnter = (e) =>
  {
    if(e.keyCode === 13)
    {
      e.preventDefault();
      confirmAndReset();
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title"></DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.text}
        </DialogContentText>
        <TextField
          margin="dense"
          id="name"
          fullWidth
          onChange={(e)=>{setCurrent(e.target.value);}}
          onKeyDown={handleEnter}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        {props.onCancel &&
          <Button onClick={props.onCancel} variant="contained">
            Cancel
          </Button>
        }
        <Button onClick={confirmAndReset} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TextEntryDialog.propTypes = {
  text:PropTypes.string,
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
};

export default TextEntryDialog;
