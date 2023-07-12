/** import React, React.Component, PropTypes, react helmet, react router dom and js-cookie */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

/** import React Redux and it's actions */
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/authActions";
import { addFlashMessage } from "../redux/actions/webActions";
import { store } from '../redux/store';

/** import Material UI Component(s) and Icon(s) */
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

/** import configuration value, validation helper and textSelector */
import { validateLogin } from "../validations/auth";
import isEmpty from "../validations/common/isEmpty";
import { primaryColor, white } from "../config/colors";
import { APP_NAME } from "../config/general";
import textSelector from "../utils/textSelector";

/** import custom component */
import AuthLogo from '../common/AuthLogo';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit * 2,
  },

  submit: {
    marginTop: theme.spacing.unit * 3,
  },

  reset: {
    "font-family": "barlow",
    "font-size": "0.875rem",
    color: primaryColor,
  },
  textContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  visibility: {
    color: primaryColor,
    cursor: "pointer",
  },
  loading: {
    "margin-left": theme.spacing.unit,
    "margin-right": theme.spacing.unit,
    color: white,
  },
});

/**
 * Login is a component to show Login page
 *
 * @name Login
 * @component
 * @category Page
 *
 */
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      remember: false,
      message: "",
      errors: {},
      showPassword: false,
      isLoading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeRemember = this.changeRemember.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

  /**
   * isValid is a function to validate the login form
   * @returns {boolean}
   */
  isValid() {
    const { errors, isValid } = validateLogin(this.state);

    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }

    return isValid;
  }

  /**
   * handleClickShowPassword is a function to show or hide password
   */
  handleClickShowPassword() {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  /**
   * onChange is a function to process value inside the input field
   * @param {FieldEvent} e - The observable event.
   * @listens FieldEvent
   */
  onChange(e) {
    if (!!this.state.errors[e.target.name]) {
      const errors = Object.assign({}, this.state.errors);
      delete errors[e.target.name];
      this.setState({ [e.target.name]: e.target.value, errors }, () => {
        this.isValid();
      });
    } else {
      this.setState({ [e.target.name]: e.target.value }, () => {
        this.isValid();
      });
    }
  }

  /**
   * onSubmit is a function to submit login form data
   * @param {SubmitEvent} e
   * @listens SubmitEvent
   */
  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
      remember: this.state.remember,
    };

    if(userData.email.includes('@organization.org')) {
      this.props.addFlashMessage({
        type: "error",
        text: "Please use your personal Email Address to log in.",
      });
      this.setState({ message: "Please use your personal Email Address to log in." });
    } else if (this.isValid()) {
      this.setState({ isLoading: true }, () => {
        this.props
          .loginUser(userData)
          .then((res) => {
            this.props.addFlashMessage({
              type: "success",
              text: "Welcome !",
            });
            if (!isEmpty(Cookies.get('apply-job-id'))) {
              const jobId = Cookies.get('apply-job-id');
              if (store.getState().auth.user.p11Completed) {
                Cookies.remove('apply-job-id');
                this.props.history.push(`/jobs/${jobId}`);
              } else {
                this.props.history.push("/", {thoughLogin: true});
              }
            } else {
              this.props.history.push("/",  {thoughLogin: true});
            }
          })
          .catch((err) => {
            this.setState({ isLoading: false }, () => {
              const unAuthorizedMessage = "Incorrect Email Address or Password.";
              const notFoundMessage = "The email address you entered is not linked to an account.";

              let formMessage = '';
              let errorMessage = textSelector('error', 'default');

              if (!isEmpty(err.response)) {
                if (err.response.status) {
                  if (err.response.status === 401) {
                    errorMessage = unAuthorizedMessage;
                    formMessage = unAuthorizedMessage;
                    this.setState({ message: unAuthorizedMessage });
                  }
                  if (err.response.status === 404) {
                    errorMessage = notFoundMessage;
                    formMessage = notFoundMessage;
                  }
                  if (err.response.status === 429) {
                    errorMessage = "There are currently too many requests handled by the server. Please try again later.";
                  }
                }
              }

              this.setState({ message: formMessage });
              return this.props.addFlashMessage({
                type: "error",
                text: errorMessage,
              });
            });
          });
      });
    }
  }

  /**
   * changeRemember is a function to toggle remember me checkbox
   */
  changeRemember() {
    this.setState({ remember: !this.state.remember })
  }

  render() {
    let {
      email,
      password,
      errors,
      message,
      showPassword,
      isLoading,
    } = this.state;
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <Helmet>
          <title>{APP_NAME} - Login</title>
          <meta name="description" content={APP_NAME + " Login"} />
        </Helmet>
        <CssBaseline />
        <Paper className={classes.paper}>
          <AuthLogo />
          <form className={classes.form} onSubmit={this.onSubmit}>
            {message !== "" && <FormLabel error={true}>{message}</FormLabel>}
            <TextField
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              margin="normal"
              required
              fullWidth
              name="email"
              value={email}
              onChange={this.onChange}
              error={!isEmpty(errors.email)}
              helperText={errors.email}
            />
            <TextField
              id="password"
              label="Password"
              autoComplete="current-password"
              margin="normal"
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={this.onChange}
              error={!isEmpty(errors.password)}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    onClick={this.handleClickShowPassword}
                    position="end"
                    className={classes.iconPassword}
                  >
                    {showPassword ? (
                      <Visibility className={classes.visibility} />
                    ) : (
                      <VisibilityOff className={classes.visibility} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="remember"
                  color="primary"
                  onChange={this.changeRemember}
                />
              }
              label="Remember me"
            />
            <br />
            <div className={classes.textContainer}>
              <Typography variant="subtitle2">
                <Link to="/reset-password" className={classes.reset}>
                  Reset Password
                </Link>
              </Typography>

              <Typography variant="subtitle2">
                <Link to="/register" className={classes.reset}>
                  Register
                </Link>
              </Typography>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Log In{" "}
              {isLoading && (
                <CircularProgress
                  className={classes.loading}
                  thickness={5}
                  size={22}
                />
              )}
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

Login.propTypes = {
  /**
   * loginUser is a prop to call redux actions get login the user credentials inside the form
   */
  loginUser: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  loginUser,
  addFlashMessage,
};

export default withStyles(styles)(
  connect(
    "",
    mapDispatchToProps
  )(Login)
);
