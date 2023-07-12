/** import React and PropTypes */
import React from "react";
import PropTypes from 'prop-types';

/** import Material UI components */
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { Checkbox, FormControl, FormControlLabel, Grid, Typography } from "@material-ui/core";

/**
 * ReferenceNoticeModal is a component that renders a remarks to users before they fill the references
 *
 * @name ReferenceNoticeModal
 * @component
 * @category Common
 *
 */
const ReferenceNoticeModal = ({
  isOpen,
  onClose,
  title,
}) => (
  <Dialog open={isOpen} fullWidth maxWidth="sm" onClose={onClose}>
    <DialogTitle>{title ? title : "Reference Check"}</DialogTitle>
    <DialogContent>
      <Grid container spacing={24} alignItems="flex-end">
          <Grid item xs={12} sm={12}>
            <Typography variant="body1" component="p" style={{fontWeight: 'bold'}}>
               Please follow these requirements in order to have your reference check taken into account.
            </Typography>
            <ul>
              <li><Typography variant="body1" component="p">Provide a professional email address.</Typography></li>
              <li><Typography variant="body1" component="p">The referees should be your previous direct line managers (n+1)</Typography></li>
              <li><Typography variant="body1" component="p">Mention only recent experiences</Typography></li>
            </ul>
          </Grid>
      </Grid>         
    </DialogContent>
    <DialogActions>
      <Button onClick={() => onClose()} color="primary" variant="contained">
        I understand
      </Button>
    </DialogActions>
  </Dialog>
);

ReferenceNoticeModal.defaultPropTypes = {
  isOpen: false,
};

ReferenceNoticeModal.propTypes = {
  /**
   * isOpen is a prop containing value to open / close profile modal
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * onClose is a prop containing the function to be called when the modal is closed
   */
  onClose: PropTypes.func.isRequired,
  /**
   * title is a prop containing the title of the modal
   */
  title: PropTypes.string,
}

export default ReferenceNoticeModal;
