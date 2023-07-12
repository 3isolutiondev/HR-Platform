/** import React, React.Component, PropTypes, React Helmet and React Router DOM */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

/** import Material UI components and icons */
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

/** import Redux and it's actions */
import { connect } from 'react-redux';
import { registerUser } from '../redux/actions/authActions';
import { addFlashMessage } from '../redux/actions/webActions';

/** import configuration value and validation helper */
import { primaryColor, white } from '../config/colors';
import { APP_NAME } from '../config/general';
import { validateRegister } from '../validations/auth';
import isEmpty from '../validations/common/isEmpty';

/** import custom component */
import AuthLogo from '../common/AuthLogo';
import Cookies from 'js-cookie';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  visibility: {
    color: primaryColor,
    cursor: 'pointer'
  },
  buttonBack: {
    'font-family': 'barlow',
    'font-size': '0.875rem',
    color: primaryColor
  },
  textBottom: {
    paddingTop: 10,
    textAlign: 'center'
  },
  loading: {
    'margin-left': theme.spacing.unit,
    'margin-right': theme.spacing.unit,
    color: white
  },
});

/**
 * Register is a component to show Register page
 *
 * @name Register
 * @component
 * @category Page
 *
 */
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      middle_name: '',
      family_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: {},
      showPassword: false,
      isValid: false,
      isLoading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.registerError = this.registerError.bind(this);
  }

  /**
   * isValid is a function to validate the registration form
   * @returns {boolean}
   */
  isValid() {
    const { errors, isValid } = validateRegister(this.state);

    if (!isValid) {
      this.setState({ errors, isValid });
    } else {
      this.setState({ errors: {}, isValid });
    }

    return isValid;
  }

  /**
   * handleClickShowPassword is a function to show or hide password
   */
  handleClickShowPassword() {
    this.setState({
      showPassword: !this.state.showPassword
    });
  }

  /**
   * onChange is a function to handle data when the form is change
   * @param {*} e
   */
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
  }

  /**
   * registerError is a function to show registration error in pop up message
   * @returns {boolean}
   */
  registerError() {
    this.props.addFlashMessage({
      type: 'error',
      text: 'Registration Error'
    });

    return false;
  }

  /**
   * onSubmit is a function to handle registration by calling an api
   * @param {*} e
   */
  onSubmit(e) {
    e.preventDefault();
    if (this.state.isValid) {
      let { first_name, middle_name, family_name, email, password, password_confirmation } = this.state;

      const userData = {
        first_name: first_name,
        middle_name: middle_name,
        family_name: family_name,
        email: email,
        password: password,
        password_confirmation: password_confirmation
      };

      this.setState({ isLoading: true }, () => {
        this.props
          .registerUser(userData)
          .then((res) => {
            Cookies.set('isNewUser', 'true');
            this.setState({ isLoading: false }, () => {
              this.props.history.goBack();
            });
          })
          .catch((err) => {
            this.setState({ isLoading: false }, () => {
              if (typeof err !== "undefined" && err !== null) {
                if (typeof err.response !== "undefined" && err.response !== null) {
                  if (typeof err.response.data !== "undefined" && err.response.data !== null) {
                    if (typeof err.response.data.errors !== "undefined" && err.response.data.errors !== null) {
                      if (isEmpty(err.response.data.errors)) {
                        if (err.response.status == 422) {
                          return this.props.addFlashMessage({
                            type: 'error',
                            text: err.response.data.message
                          });
                        }
                        return this.registerError();
                      }

                      let firstObj = Object.keys(err.response.data.errors)[0];
                      this.props.addFlashMessage({
                        type: err.response.data.status,
                        text: err.response.data.errors[firstObj]
                      });
                    }
                  }
                }
              }
              this.registerError();
            });
          });
      });
    } else {
      let firstObj = Object.keys(this.state.errors)[0];
      this.props.addFlashMessage({
        type: 'error',
        text: this.state.errors[firstObj]
      });
    }
  }

  render() {
    let {
      first_name,
      middle_name,
      family_name,
      email,
      password,
      password_confirmation,
      errors,
      showPassword,
      showConfirmPassword,
      isLoading
    } = this.state;
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <Helmet>
          <title>{APP_NAME} - Register</title>
          <meta name="description" content={APP_NAME + ' Register'} />
        </Helmet>
        <CssBaseline />
        <Paper className={classes.paper}>
          <AuthLogo />
          <form className={classes.form} onSubmit={this.onSubmit}>
            <TextField
              id="first_name"
              label="First Name"
							autoComplete="new-password"
              autoFocus
              margin="normal"
              required
              fullWidth
              name="first_name"
              value={first_name}
              onChange={this.onChange}
              error={!isEmpty(errors.first_name)}
              helperText={errors.first_name}
            />
            <TextField
              id="middle_name"
              label="Middle Name"
							autoComplete="new-password"
              margin="normal"
              fullWidth
              name="middle_name"
              value={middle_name}
              onChange={this.onChange}
              error={!isEmpty(errors.middle_name)}
              helperText={errors.middle_name}
            />
            <TextField
              id="family_name"
              label="Family Name"
							autoComplete="new-password"
              margin="normal"
              required
              fullWidth
              name="family_name"
              value={family_name}
              onChange={this.onChange}
              error={!isEmpty(errors.family_name)}
              helperText={errors.family_name}
            />
            <TextField
              id="email"
              label="Email Address"
              autoComplete="email"
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
              margin="normal"
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={this.onChange}
              error={!isEmpty(errors.password)}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment onClick={this.handleClickShowPassword} position="end">
                    {showPassword ? (
                      <Visibility className={classes.visibility} />
                    ) : (
                        <VisibilityOff className={classes.visibility} />
                      )}
                  </InputAdornment>
                )
              }}
            />
            <TextField
              id="password_confirmation"
              label="Password Confirmation"
              margin="normal"
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              name="password_confirmation"
              value={password_confirmation}
              onChange={this.onChange}
              error={!isEmpty(errors.password_confirmation)}
              helperText={errors.password_confirmation}
              InputProps={{
                endAdornment: (
                  <InputAdornment onClick={this.handleClickShowPassword} position="end">
                    {showPassword ? (
                      <Visibility className={classes.visibility} />
                    ) : (
                        <VisibilityOff className={classes.visibility} />
                      )}
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit" disabled={isLoading} fullWidth variant="contained" color="primary" className={classes.submit}>
              Register
							{isLoading && <CircularProgress className={classes.loading} size={22} thickness={5} />}
            </Button>
            <Typography variant="subtitle2" className={classes.textBottom}>
              Already have an account?{' '}
              <Link to="/login" className={classes.buttonBack}>
                Login
							</Link>
            </Typography>
          </form>
        </Paper>
      </main>
    );
  }
}

Register.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * addFlashMessage is a function show pop up message
   */
  addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  registerUser,
  addFlashMessage
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(Register));
