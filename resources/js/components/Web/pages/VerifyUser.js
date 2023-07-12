import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAPI, postAPI } from "../redux/actions/apiActions";
import { logoutUser } from "../redux/actions/authActions";
import { addFlashMessage } from "../redux/actions/webActions";
import { white } from "../config/colors";
import isEmpty from "../validations/common/isEmpty";

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  verifiedBox: {
    marginTop: theme.spacing.unit * 9,
    display: "inline-block",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    width: "50%",
  },
  verifiedContainer: {
    textAlign: "center",
  },
  loading: {
    "margin-left": theme.spacing.unit * 2,
    "margin-right": theme.spacing.unit * 2,
    color: white,
  },
});

class VerifyUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Please wait while We are verifying Your Email.",
      showResend: false,
      isLoading: true,
      isVerified: false,
    };

    this.resend = this.resend.bind(this);
  }

  componentDidMount() {
    const queryParams = this.props.location.search;
    const userId = this.props.match.params.userId;

    this.props
      .getAPI("/api/email/verify/" + userId + queryParams)
      .then((res) => {
        const { status, message } = res.data;
        this.props.addFlashMessage({
          type: isEmpty(status) ? "success" : status,
          text: isEmpty(message) ? "Email verify" : message,
        });

        this.setState({ isLoading: false, message }, () => {
          setTimeout(
            function() {
              this.props.logoutUser();
            }.bind(this),
            2000
          );
        });
      })
      .catch((err) => {
        const { data } = err.response;
        if (data) {
          let { message } = data;
          if (err.response.status === 422) {
            this.props.addFlashMessage({
              type: "error",
              text: message,
            });
            this.setState({
              showResend: true,
              message: message,
              isLoading: false,
            });
          } else if (err.response.status === 403) {
            message = "Link expired"; //Already verified /
            this.props.addFlashMessage({
              type: "error",
              text: message,
            });
            this.setState({
              showResend: true,
              message: message,
              isLoading: false,
            });
          } else if(err.response.status === 410){
            // message = "User already verified!";
            this.props.addFlashMessage({
              type: "error",
              text: message,
            });
            this.setState({
              showResend: false,
              message: message,
              isLoading: false,
            });
          }
        } else {
          message = "There is an error while validating your email";
          this.props.addFlashMessage({
            type: "error",
            text: message,
          });
          this.setState({ showResend: true, message, isLoading: false });
        }
      });
  }

  resend() {
    this.setState({isLoading:true})
    this.props
      .postAPI("/api/email/resend", {
        user_id: this.props.match.params.userId,
      })
      .then((res) => {
        this.setState({isLoading:false})
        const { status, message } = res.data;
        this.props.addFlashMessage({
          type: isEmpty(status) ? "success" : status,
          text: isEmpty(message)
            ? "The notification has been resubmitted"
            : message,
        });
      })
      .catch((err) => {
        const { data } = err.response;
        this.setState({isLoading:false})
        if (data) {
          let { message } = data;
          if (err.response.status === 422) {
            this.props.addFlashMessage({
              type: "error",
              text: message,
            });
            this.setState({
              showResend: true,
              message: message,
              isLoading: false,
            });
          } else {
            this.props.addFlashMessage({
              type: "error",
              text: "There is an error while resend verification email",
            });
          }
        }
      });
  }

  render() {
    let { message, isLoading, showResend } = this.state;
    const { classes } = this.props;

    return (
      <main className={classes.verifiedContainer}>
        <Paper className={classes.verifiedBox}>
          <Typography variant="h5">{message}</Typography>
          <br />
          {showResend && (
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={this.resend}
              disabled={isLoading}
            >
              Resend Verification Email{" "}
              {isLoading && (
                <CircularProgress
                  thickness={5}
                  size={22}
                  className={classes.loading}
                />
              )}
            </Button>
          )}
        </Paper>
      </main>
    );
  }
}

VerifyUser.propTypes = {
  getAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  addFlashMessage,
  logoutUser,
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(VerifyUser)
);
