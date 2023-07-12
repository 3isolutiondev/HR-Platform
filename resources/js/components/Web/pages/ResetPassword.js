/** import React, React.Component, PropTypes, React Helmet and React Router DOM */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/** import Material UI withStyles and components */
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';

/** import Redux and it's actions */
import { connect } from 'react-redux';
import { postAPI } from '../redux/actions/apiActions';
import { addFlashMessage, setSpinner } from '../redux/actions/webActions';

/** import configuration value and validation helper */
import { APP_NAME } from '../config/general';
import { validateResetPassword } from '../validations/auth';
import isEmpty from '../validations/common/isEmpty';

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
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit * 2
	},

	submit: {
		marginTop: theme.spacing.unit * 3
	},
	loading: {
		color: 'white',
		animationDuration: '550ms',
		left: 0
	},
});

/**
 * ResetPassword is a component to show Reset Password page
 *
 * @name ResetPassword
 * @component
 * @category Page
 *
 */
class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			message: '',
			errors: {},
			apiURL: '/api/reset-password'
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

  /**
   * isValid is a function to validate reset password form
   * @returns {boolean}
   */
	isValid() {
		const { errors, isValid } = validateResetPassword(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}

  /**
   * onChange is a function to handle data when the form is change
   * @param {*} e
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
   * onSubmit is a function to handle submitting reset password data by calling an api
   * @param {*} e
   */
	onSubmit(e) {
		this.props.setSpinner(true);
		e.preventDefault();

		const userData = {
			email: this.state.email
		};

		if (this.isValid()) {
			const message = 'If you have an account with us with the Email Address provided, you will soon receive an email with the steps to reset your password.'
			this.props
				.postAPI(this.state.apiURL, userData)
				.then((res) => {
					this.props.setSpinner(false);
					this.setState({message})
				})
				.catch((err) => {
					this.props.setSpinner(false);
					if (err.response.status === 429) {
						this.props.addFlashMessage({
							type: 'error',
							text: 'Too Many Requests'
						});
					} else if(err.response.status === 500) {
						this.props.addFlashMessage({
							type: 'error',
							text: 'Server error'
						});
					} else {
						this.setState({message})
					}
				});
		}
	}

	render() {
		let { email, errors, message } = this.state;
		const { classes, spinner } = this.props;

		return (
			<main className={classes.main}>
				<Helmet>
					<title>{APP_NAME} - Reset Password</title>
					<meta name="description" content={APP_NAME + ' Reset Password'} />
				</Helmet>
				<CssBaseline />
				<Paper className={classes.paper}>
          <AuthLogo />
					<form className={classes.form} onSubmit={this.onSubmit}>
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
						<Button type="submit" disabled={spinner} style={{marginBottom: 15}} fullWidth variant="contained" color="primary" className={classes.submit}>
							{spinner ? <CircularProgress className={classes.loading} size={20} /> : 'Send Reset Link'}
						</Button>

						{message !== '' && <FormLabel className="mt-2" error={true}>{message}</FormLabel>}
					</form>
				</Paper>
			</main>
		);
	}
}

ResetPassword.propTypes = {
  /**
   * addFlashMessage is a function show pop up message
   */
	addFlashMessage: PropTypes.func.isRequired,
  /**
   * setSpinner is a function to change spinner prop data
   */
	setSpinner: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
	classes: PropTypes.object.isRequired,
  /**
   * postAPI is a prop containing function to call api using post request
   */
	postAPI: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	spinner: state.web.spinner
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	addFlashMessage,
	postAPI,
	setSpinner
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));
