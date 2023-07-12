import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { getAPI, postAPI } from "../redux/actions/apiActions";
import { addFlashMessage } from "../redux/actions/webActions";
import { white } from "../config/colors";
import isEmpty from "../validations/common/isEmpty";
import Cookies from 'js-cookie';

/**
 * set up styles for this component
 * @ignore
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

class MicrosoftLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Please wait ...",
      showResend: false,
      isLoading: true,
      isVerified: false,
    };
  }

  componentDidMount() {
    const code = this.props.location.search;

    this.props
      .getAPI("/api/users/graph_access_token"+code)
      .then((res) => {
        const { status, message } = res.data;
        if(res.data.data.access_token) {
        Cookies.set("microsoft_access_token", res.data.data.access_token);
        if(res.data.data.refresh_token) Cookies.set("microsoft_refresh_token", res.data.data.refresh_token);
        if(res.data.data.expires_in) Cookies.set("microsoft_token_expire", Date.now() + res.data.data.expires_in);
        this.props.addFlashMessage({
          type: isEmpty(status) ? "success" : status,
          text: isEmpty(message) ? "Authenticated successfully" : message,
        });

        this.setState({ isLoading: false, message }, () => {
          setTimeout(
            function() {
              window.close();
            }.bind(this),
            2000
          );
        });} else {
          this.props.addFlashMessage({
            type: "error",
            text: "Failed to authenticate with microsoft account",
          });
        }
      })
      .catch((err) => {
          message = "Failed to authenticate with microsoft account";
          this.props.addFlashMessage({
            type: "error",
            text: message,
          });
          this.setState({ showResend: true, message, isLoading: false });
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
        </Paper>
      </main>
    );
  }
}

MicrosoftLogin.propTypes = {
  getAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
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
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(MicrosoftLogin)
);
