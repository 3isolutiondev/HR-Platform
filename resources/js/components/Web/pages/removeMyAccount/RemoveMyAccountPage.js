/** import React and Prop Types */
import React from 'react';
import PropTypes from 'prop-types';

/** import Material UI styles */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';

/** import React redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage, deleteAllFlashMessage } from '../../redux/actions/webActions';
import { removeAccountRequest } from '../../redux/actions/profile/deleteAccountActions';
import { logoutUser } from '../../redux/actions/authActions';

/** import configuration value and validation helper */
import { primaryColor } from '../../config/colors';
import isEmpty from '../../validations/common/isEmpty';

/**
 * RemoveMyAccountPage is a component to show Remove MyAccount page
 *
 * @name RemoveMyAccountPage
 * @component
 * @category Page
 *
 */
class RemoveMyAccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBtn: false,
      showCheckError: false,
      hasValidDeleteRequest: false,
      deleteAccountLoading: false
    }

    this.deleteAccount = this.deleteAccount.bind(this);
    this.showError = this.showError.bind(this);
    this.regenerateToken = this.regenerateToken.bind(this);
    this.checkHasValidDeleteRequest = this.checkHasValidDeleteRequest.bind(this);
    this.checkIsIMMAPer = this.checkIsIMMAPer.bind(this);
    this.checkIfErrorHasMessage = this.checkIfErrorHasMessage.bind(this);
  }

  componentDidMount() {
    if (!isEmpty(this.props.match.params.token)) {
      this.props.getAPI(`/api/check-remove-account-token/${this.props.match.params.token}`)
      .then(res => {
        this.setState({ showCheckError: false, showBtn: true })
      })
      .catch(err => {
        if (!this.checkHasValidDeleteRequest(err)) {
          return this.showError();
        }
      })
    } else {
      return this.showError();
    }
  }

  /**
   * showError is a function to show an error message
   * @param {string} message
   */
  showError(message = "Invalid link or token expired. Please click 'Remove Account' to receive a new confirmation email.") {
    this.setState({ showCheckError: true }, () => {
      this.props.addFlashMessage({
        type: 'error',
        text: message
      })
    })
  }

  /**
   * checkHasValidDeleteRequest is a function to check if the user has a valid delete request
   * @param {*} err
   * @returns {boolean}
   */
  checkHasValidDeleteRequest(err) {
    if (!isEmpty(err.response.data.errors)) {
      if (!isEmpty(err.response.data.errors.hasValidDeleteRequest)) {
        this.setState({ hasValidDeleteRequest: err.response.data.errors.hasValidDeleteRequest })
        if (err.response.data.errors.hasValidDeleteRequest) {
          this.showError("Your account removal request has a new confirmation link. Please check your email for further instructions.");
          return true;
        }
      }
    }
    return false;
  }

  /**
   * checkIsIMMAPer is a function to check if the user is iMMAPer or not
   * @param {object} err error response coming from axios
   * @returns {boolean}
   */
  checkIsIMMAPer(err) {
    if (!isEmpty(err.response.status)) {
      if (err.response.status === 422) {
        this.showError(err.response.data.message)
        return true;
      }
    }
    return false;
  }

  /**
   * checkIfErrorHasMessage is a function to check if error message containing show message data
   * @param {object} err error response coming from axios
   * @returns {boolean}
   */
  checkIfErrorHasMessage(err) {
    if (!isEmpty(err.response.data.errors)) {
      if (!isEmpty(err.response.data.errors.showMessage)) {
        this.setState({ showMessage: err.response.data.errors.showMessage })
        if (err.response.data.errors.showMessage) {
          this.showError(err.response.data.message)
          return true;
        }
      }
    }
    return false;
  }

  /**
   * deleteAccount is a function to delete the account
   */
  deleteAccount() {
    this.setState({ deleteAccountLoading: true }, () => {
      this.props.postAPI('/api/remove-account', {
        deleteAccountToken: this.props.match.params.token
      })
      .then((res) => {
        this.setState({ deleteAccountLoading: false }, async () => {
          await this.props.addFlashMessage({
            type: 'success',
            text: res.data.message
          })
          await new Promise(r => setTimeout(r, 1000));
          await this.props.deleteAllFlashMessage();
          this.props.logoutUser();
        })
      })
      .catch(err => {
        this.setState({ deleteAccountLoading: false }, () => {
          if (!this.checkHasValidDeleteRequest(err)) {
            if (!this.checkIsIMMAPer(err)) {
              if (!this.checkIfErrorHasMessage(err)) {
                this.showError("We cannot process your request at the moment. Please try again later.");
              }
            }
          }
        })
      })
    })
  }

  /**
   * regenerateToken is a function to regenerate expired token
   */
  async regenerateToken() {
    await this.props.removeAccountRequest();
    this.setState({ hasValidDeleteRequest: this.props.hasValidDeleteRequestFromProp }, async () => {
      await new Promise(r => setTimeout(r, 7000));
      await this.props.deleteAllFlashMessage();
      this.props.history.push('/');
    });
  }

  render() {
    const { authUser, classes, deleteRequestLoading } = this.props;
    const { showBtn, showCheckError, hasValidDeleteRequest, deleteAccountLoading } = this.state;

    return (
      <React.Fragment>
        <Paper className={classes.paper}>
          {showBtn ? (
            <React.Fragment>
              <Typography variant="h5">
                Delete account <span className={classes.email}>{authUser.email}</span>
              </Typography>
              <Button
                color="primary"
                variant="contained"
                className={classes.deleteBtn}
                fullWidth
                onClick={this.deleteAccount}
                disabled={deleteAccountLoading}
              >
                <DeleteIcon />Delete Account {deleteAccountLoading && (<CircularProgress size={22} thickness={5} style={{ color: '#fff', marginLeft: 4 }} />)}
              </Button>
            </React.Fragment>
          ) : (hasValidDeleteRequest) ? (
            <React.Fragment>
              <Typography variant="h5">
                Your account removal request has a new confirmation link.
              </Typography>
              <Typography variant="h5">
                Please check your email for further instructions.
              </Typography>
            </React.Fragment>
          ) : (showCheckError) ? (
            <React.Fragment>
              <Typography variant="h5">
                Invalid link or token expired.
              </Typography>
              <Typography variant="h5">
                Please click <b style={{ color: primaryColor }}>Remove Account</b> to receive a new confirmation email.
              </Typography>
              <Button
                color="primary"
                variant="contained"
                className={classes.deleteBtn}
                fullWidth
                onClick={this.regenerateToken}
                disabled={deleteRequestLoading}
              >
                Remove Account {deleteRequestLoading && (<CircularProgress size={22} thickness={5} style={{ color: '#fff' }} />)}
              </Button>
            </React.Fragment>
          ) : (
            <CircularProgress size={28} thickness={5} style={{ margin: '0 auto' }}/>
          )}
        </Paper>
      </React.Fragment>
    )
  }
}

RemoveMyAccountPage.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * getAPI is a prop function to call get api
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop function to call post api
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired,
  /**
   * deleteAllFlashMessage is a prop to call redux action to delete all flash message.
   */
  deleteAllFlashMessage: PropTypes.func.isRequired,
  /**
   * removeAccountRequest is a prop to call redux action to call remove account request api.
   */
  removeAccountRequest: PropTypes.func.isRequired,
  /**
   * logoutUser is a prop to call redux action to logout current user
   */
  logoutUser: PropTypes.func.isRequired,
  /**
   * authUser is a prop containing current user data
   */
  authUser: PropTypes.object.isRequired,
  /**
   * isIMMAPER is a prop containing boolean value to detect if the current user is iMMAPer or not
   */
  isIMMAPER: PropTypes.bool.isRequired,
  /**
   * hasValidDeleteRequestFromProp is a prop containing boolean value to detect if the current user has valid delete request
   */
  hasValidDeleteRequestFromProp: PropTypes.bool.isRequired,
  /**
   * deleteRequestLoading is a prop containing boolean value to show loading circle
   */
  deleteRequestLoading: PropTypes.bool.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  addFlashMessage,
  deleteAllFlashMessage,
  removeAccountRequest,
  logoutUser
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  authUser: state.auth.user.data,
  isIMMAPER: state.auth.user.isIMMAPER,
  hasValidDeleteRequestFromProp: state.deleteAccount.hasValidDeleteRequest,
  deleteRequestLoading: state.deleteAccount.deleteRequestLoading
})

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  paper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    width: '100%',
    maxWidth: theme.spacing.unit * 80,
    margin: '0 auto',
    textAlign: 'center'
  },
  email: { color: primaryColor, fontWeight: 700 },
  deleteBtn: { marginTop: theme.spacing.unit * 2 },
  shadowLoading: { position: 'fixed', zIndex: 9999, height: '100%', width: '100%', background: `rgba(0,0,0,0.3)`}
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RemoveMyAccountPage));
