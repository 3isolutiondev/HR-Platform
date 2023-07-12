/** import React and PropTypes */
import React, { Component } from "react";
import PropTypes from "prop-types";

/** import Material UI components and withStyles */
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

/** import React Redux and it's actions */
import { connect } from "react-redux";
import { postAPI } from "../redux/actions/apiActions";
import { addFlashMessage } from "../redux/actions/webActions";

/** import configuration value and validation helper */
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

/**
 * NotVerified is a component to show Not Verified page
 *
 * @name NotVerified
 * @component
 * @category Page
 *
 */
class NotVerified extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    this.resend = this.resend.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    if (isEmpty(this.props.user)) {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Please login with your account first!',
      });
      this.props.history.push("/login");
    }
  }

  /**
   * resend is a function to resend verification email
   */
  resend() {
    if (this.props.user) {
      if (this.props.user.data) {
        if (this.props.user.data.id) {
          this.setState({ isLoading: true }, () => {
            this.props
              .postAPI("/api/email/resend", {
                user_id: this.props.user.data.id,
              })
              .then((res) => {
                const { status, message } = res.data;
                this.setState({ isLoading: false }, () => {
                  this.props.addFlashMessage({
                    type: status,
                    text: message,
                  });
                });
              })
              .catch((err) => {
                this.setState({ isLoading: false }, () => {
                  this.props.addFlashMessage({
                    type: "error",
                    text: "There is an error while resend verification email",
                  });
                });
              });
          });
        }
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;

    return (
      <main className={classes.verifiedContainer}>
        <Paper className={classes.verifiedBox}>
          <Typography variant="h5">
            Please check Your Email and Verify your account first.
          </Typography>
          <br />
          <Typography component="p">
            If You haven't got the verification mail, Click here :
          </Typography>
          <br />
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
                size={22}
                thickness={5}
                className={classes.loading}
              />
            )}
          </Button>
        </Paper>
      </main>
    );
  }
}

NotVerified.propTypes = {
  postAPI: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  postAPI,
  addFlashMessage,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NotVerified)
);
