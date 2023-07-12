/** import React, React.Component and PropTypes */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles and components */
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

/** import Redux and it's actions */
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';
import { addFlashMessage, setSpinner } from '../redux/actions/webActions';
import { postAPI } from '../redux/actions/apiActions';

/** import validation helper and custom component */
import { validateResetPasswordForm } from '../validations/auth';
import isEmpty from '../validations/common/isEmpty';
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
 * ResetPasswordForm is a component to show Reset Password Form page where the user update their password
 *
 * @name ResetPasswordForm
 * @component
 * @category Page
 */
class ResetPasswordForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			password_confirmation: '',
			errors: {},
			apiURL: '/api'
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
  */
	componentDidMount() {
		let { apiURL } = this.state;
		const { pathname, search } = this.props.location;
		apiURL = apiURL + pathname + search;

		this.setState({ apiURL });
	}

  /**
   * isValid is a function to validate reset password form
   * @returns {boolean}
   */
	isValid() {
		const { errors, isValid } = validateResetPasswordForm(this.state);

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
		this.setState({ [e.target.name]: e.target.value }, () => {
			this.isValid();
		});
	}

  /**
   * onSubmit is a function to handle submitting reset password data by calling an api
   * @param {*} e
   */
	onSubmit(e) {
		this.props.setSpinner(true);
		e.preventDefault();

		const resetData = {
			password: this.state.password,
			password_confirmation: this.state.password_confirmation
		};

		if (this.isValid()) {
			this.props
				.postAPI(this.state.apiURL, resetData)
				.then((res) => {
					this.props.setSpinner(false);
					this.props.addFlashMessage({
						type: 'success',
						text: 'Reset password success, please login with your new credentials !'
					});
					setTimeout(
						function() {
							this.props.logoutUser();
						}.bind(this),
						2000
					);
				})
				.catch((err) => {
					this.props.setSpinner(false);
					let errorText = '';
					if (err.response.status === 429) {
						errorText = 'Too Many Requests';
					} else if (err.response.status === 404) {
						errorText = err.response.data.message;
					} else if (err.response.status == 403) {
						errorText = err.response.data.message;
					} else {
						errorText = 'There is an error while processing your request';
					}

					this.props.addFlashMessage({
						type: 'error',
						text: errorText
					});
				});
		}
	}

	render() {
		let { password, password_confirmation, errors } = this.state;
		const { classes, spinner } = this.props;

		return (
			<main className={classes.main}>
				<CssBaseline />
				<Paper className={classes.paper}>
          <AuthLogo />
					<form className={classes.form} onSubmit={this.onSubmit}>
						<TextField
							id="password"
							label="Password"
							autoComplete="password"
							autoFocus
							margin="normal"
							required
							fullWidth
							type="password"
							name="password"
							value={password}
							onChange={this.onChange}
							error={!isEmpty(errors.password)}
							helperText={errors.password}
						/>
						<TextField
							id="password_confirmation"
							label="Password Confirmation"
							autoComplete="password_confirmation"
							margin="normal"
							required
							fullWidth
							type="password"
							name="password_confirmation"
							value={password_confirmation}
							onChange={this.onChange}
							error={!isEmpty(errors.password_confirmation)}
							helperText={errors.password_confirmation}
						/>
						<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
							{spinner ? (
								<CircularProgress className={classes.loading} size={20} />
							) : (
								'Send New Credential'
							)}
						</Button>
					</form>
				</Paper>
			</main>
		);
	}
}

ResetPasswordForm.propTypes = {
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
	logoutUser,
	setSpinner
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm));
