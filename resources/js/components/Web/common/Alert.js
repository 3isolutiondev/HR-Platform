/** import React and PropTypes */
import React from 'react'
import PropTypes from 'prop-types'

/** import Material UI components */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Component for showing Alert box on the website
 *
 * Permission: -
 *
 * @component
 * @name Alert
 * @category Common
 * @example
 * return (
 *    <Alert
 *      isOpen={this.state.alertOpen}
 *      onClose={() => {
 *        console.log('function that run when the close button is clicked')
 *      }}
 *      onAgree={() => {
 *        console.log('function that run when the agree button is clicked')
 *      }}
 *      title="Alert Title (ex: Delete Warning)"
 *      text="Alert text (ex: Are you sure you want to delete this data?)"
 *      closeText="Close button text (ex: Cancel)"
 *      AgreeText="Agree button text (ex: Yes)"
 *    />
 * )
 *
 */
const Alert = ({ isOpen, onClose, onAgree, title, text, closeText, AgreeText, withOutBackDropOnClose, isLoading = false }) => {
  return (

    <Dialog
      open={isOpen}
      onClose={(withOutBackDropOnClose == undefined || withOutBackDropOnClose == false) ? onClose : null}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title &&
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      }
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {closeText && <Button variant="outlined" onClick={onClose} color="secondary">
          {closeText}
        </Button>}
        <Button disabled={isLoading} variant="outlined" onClick={onAgree} color="primary" autoFocus>
          {isLoading ? (
            <CircularProgress color="primary" thickness={5} size={25}/>
          ): AgreeText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

Alert.defaultProps = {
  isLoading: false
}

Alert.propTypes = {
  /**
   * isLoading is a boolean value indicating the Loading indicator
   */
  isLoading: PropTypes.bool.isRequired,
  /**
   * isOpen is a boolean value indicating the Alert box is open or closed
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * onClose is a function that will run when you the Alert box is closed
   */
  onClose: PropTypes.func.isRequired,
  /**
   * onAgree is a function that will run when the agree or yes button is clicked
   */
  onAgree: PropTypes.func.isRequired,
  /**
   * title is a string that will show as an Alert box title
   */
  title: PropTypes.string,
  /**
   * text is a string that will show as inside the Alert box
   */
  text: PropTypes.string.isRequired,
  /**
   * closeText is a string that will show on close button
   */
  closeText: PropTypes.string.isRequired,
  /**
   * AgreeText is a string that will show on agree / ok / yes button
   */
  AgreeText: PropTypes.string.isRequired,
  /**
   * withOutBackDropOnClose is a boolean value to turn on/off the onClose function
   */
  withOutBackDropOnClose: PropTypes.bool
}

export default Alert
