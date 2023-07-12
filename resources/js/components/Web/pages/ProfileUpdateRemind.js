/** import React, classname, Prop Types and Link */
import React, { Component } from "react";
import PropTypes from 'prop-types';

/** import Material UI styles and Component */
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

/** import React Redux and it's actions */
import { connect } from "react-redux";
import { postAPI } from "../redux/actions/apiActions";
import { addFlashMessage } from '../redux/actions/webActions';



class ProfileUpdateRemind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      url: '/api/update-profile-reminder'
    };
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.updateProfileReminder = this.updateProfileReminder.bind(this);
  }
  componentDidMount() {
    if (this.props.isOpen) {
      this.handleDialogOpen();
    }
  }
  handleDialogOpen() {
    this.setState({ open: true });
  }

  handleDialogClose() {
    this.setState({ open: false });
  }

  updateProfileReminder() {
     this.props.postAPI(this.state.url, {
                    updated_profile: 1,
                    _method: 'PUT'
     }).then((res) => {
        this.props.history.push('/profile');
     }).catch((err) => {
        this.props.addFlashMessage({
            type: 'error',
            text: 'There is an error while processing the request'
        });    
     });
 }


  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleDialogClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle id="draggable-dialog-title">System Updates</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The iMMAP Careers team has made some improvements to the systems. We
            would like you to update your skills, sectors, and area of expertise
            from the <b>profile page</b>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogClose} color="primary">
            Remind me later
          </Button>
          <Button onClick={this.updateProfileReminder} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ProfileUpdateRemind.propTypes = {
  /**
   * postAPI is a prop containing redux actions to call an api using POST HTTP Request
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
	addFlashMessage: PropTypes.func.isRequired
};
/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  postAPI,
  addFlashMessage
};

export default connect(null, mapDispatchToProps)(ProfileUpdateRemind);
