import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Send from '@material-ui/icons/Send';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Save from '@material-ui/icons/Save';
import { getRoles } from '../../redux/actions/optionActions';
import {
	onSubmit,
	onChange,
	setFormIsEdit,
	switchPassword,
	sendImmapVerification
} from '../../redux/actions/dashboard/userActions';
import { white } from '../../config/colors';
import isEmpty from '../../validations/common/isEmpty';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import SelectField from '../../common/formFields/SelectField';
import { postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import YesNoField from '../../common/formFields/YesNoField';

class UserForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loadingResendEmail: false,
			loadingResetPassword: false
		}
		this.resendVerificationEmail = this.resendVerificationEmail.bind(this);
		this.sendResetPasssword = this.sendResetPasssword.bind(this);
	}

	componentDidMount() {
		this.props.getRoles();
		if (typeof this.props.match.params.id !== 'undefined') {
			this.props.setFormIsEdit(true, this.props.match.params.id);
		} else {
      this.props.setFormIsEdit(false);
    }
	}

	resendVerificationEmail() {
		this.setState({ loadingResendEmail: true });
		this.props
			.postAPI("/api/email/resend", {
			  user_id: this.props.match.params.id,
			})
			.then((res) => {
			  const { status, message } = res.data;
			  this.setState({ loadingResendEmail: false }, () => {
				this.props.addFlashMessage({
				  type: status,
				  text: message,
				});
			  });
			})
			.catch((err) => {
			  this.setState({ loadingResendEmail: false }, () => {
				this.props.addFlashMessage({
				  type: "error",
				  text: "There was an error while sending the verification email",
				});
			  });
			});
	  }
	sendResetPasssword(email) {
	this.setState({ loadingResetPassword: true });
	this.props
		.postAPI("/api/reset-password", {
			email,
		})
		.then((res) => {
			const { status, message } = res.data;
			this.setState({ loadingResetPassword: false }, () => {
			this.props.addFlashMessage({
				type: status,
				text: message,
			});
			});
		})
		.catch((err) => {
			this.setState({ loadingResetPassword: false }, () => {
			this.props.addFlashMessage({
				type: "error",
				text: "There was an error while sending the reset email",
			});
			});
		});
	}

	render() {
		const {
			isEdit,
			userData,
			change_password,
			roles,
			mail_loading,
			showLoading,
			classes,
			errors,
			onChange,
			switchPassword,
			sendImmapVerification,
			history
		} = this.props;
		const {
			full_name,
			first_name,
			middle_name,
			family_name,
			email,
			password,
			password_confirmation,
			role,
			old_password,
			new_password,
			new_password_confirmation,
			immap_email,
			p11Completed,
			profile,
			isVerified,
			access_platform
		} = userData;

		return (
			<form onSubmit={(e) => this.props.onSubmit(e, history)}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit User : ' + full_name
						) : (
							APP_NAME + ' - Dashboard > Add User'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit User : ' + full_name
							) : (
								APP_NAME + ' Dashboard > Add User'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16} alignItems="center">
						<Grid item xs={12} sm={12} md={7} lg={9}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit User : ' + full_name}
								{!isEdit && 'Add User'}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={5} lg={3}>
							{isEdit && (
								<div className={classes.buttonContainer}>
								{!isVerified && <Button
									onClick={() => this.resendVerificationEmail()}
									fullWidth
									variant="contained"
									color="primary"
									className={classes.btn}
								>
									Send verification email <Send className={classes.addSmallMarginLeft} />{' '}
									{this.state.loadingResendEmail && (
										<CircularProgress className={classes.loading} size={22} thickness={5} />
									)}
								</Button> }
								{isVerified &&  <Button
									disabled={
										p11Completed == '1' &&
										profile.is_immaper == '1' &&
										profile.verified_immaper == '0' ? (
											false
										) : (
											true
										)
									}
									onClick={() => sendImmapVerification(this.props.match.params.id)}
									fullWidth
									variant="contained"
									color="primary"
								>
									Send Consultant Verification <Send className={classes.addSmallMarginLeft} />{' '}
									{mail_loading && (
										<CircularProgress className={classes.loading} size={22} thickness={5} />
									)}
								</Button>}
								</div>
							)}
						</Grid>
						<Grid item xs={12} sm={4}>
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
								onChange={onChange}
								error={!isEmpty(errors.first_name)}
								helperText={errors.first_name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								id="middle_name"
								label="Middle Name"
								autoComplete="new-password"
								margin="normal"
								fullWidth
								name="middle_name"
								value={middle_name}
								onChange={onChange}
								error={!isEmpty(errors.middle_name)}
								helperText={errors.middle_name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								id="family_name"
								label="Family Name"
								autoComplete="new-password"
								margin="normal"
								required
								fullWidth
								name="family_name"
								value={family_name}
								onChange={onChange}
								error={!isEmpty(errors.family_name)}
								helperText={errors.family_name}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="email"
								label="Email Address"
								autoComplete="email"
								margin="normal"
								required
								fullWidth
								name="email"
								value={email}
								onChange={onChange}
								error={!isEmpty(errors.email)}
								helperText={errors.email}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="immap_email"
								label="3iSolution Email Address"
								autoComplete="immap_email"
								margin="normal"
								fullWidth
								name="immap_email"
								value={immap_email}
								onChange={onChange}
								error={!isEmpty(errors.immap_email)}
								helperText={errors.immap_email}
							/>
						</Grid>
						{!isEdit && (
							<Grid item xs={12} sm={6}>
								<TextField
									id="password"
									label="Password"
									autoComplete="current-password"
									margin="normal"
									required
									fullWidth
									type="password"
									name="password"
									value={password}
									onChange={onChange}
									error={!isEmpty(errors.password)}
									helperText={errors.password}
								/>
							</Grid>
						)}
						{!isEdit && (
							<Grid item xs={12} sm={6}>
								<TextField
									id="password_confirmation"
									label="Password Confirmation"
									margin="normal"
									required
									fullWidth
									type="password"
									name="password_confirmation"
									value={password_confirmation}
									onChange={onChange}
									error={!isEmpty(errors.password_confirmation)}
									helperText={errors.password_confirmation}
								/>
							</Grid>
						)}
						{isEdit && (
							<Grid item xs={12}>
								<FormControlLabel
									label="Change Password"
									control={
										<Switch
											checked={change_password === 1 ? true : false}
											onChange={switchPassword}
											color="primary"
										/>
									}
								/>
							</Grid>
						)}
						{isEdit &&
						change_password === 1 && (
							<Grid item xs={12} sm={6}>
								<Button
									onClick={() => this.sendResetPasssword(email)}
									fullWidth
									variant="contained"
									color="primary"
									className={classes.btn}
								>
									Send password reset email <Send className={classes.addSmallMarginLeft} />{' '}
									{this.state.loadingResetPassword && (
										<CircularProgress className={classes.loading} size={22} thickness={5} />
									)}
								</Button>
							</Grid>
						)}
						{isEdit &&
						change_password === 1 && (
							<Grid item xs={12} sm={6}>

							</Grid>
						)}
						<Grid item xs={12}>
							<SelectField
								label="Roles *"
								options={roles}
								value={role}
								onChange={(value) => onChange({ target: { name: "role", value } })}
								placeholder="Select 1 or More Roles"
								name="role"
								error={errors.role}
								required
								isMulti={true}
								fullWidth={true}
								margin="none"
								added={false}
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								label="Access to the platform?"
								value={access_platform.toString()}
								onChange={onChange}
								name="access_platform"
								error={errors.access_platform}
								margin="none"
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<Save /> Save{' '}
								{showLoading && (
									<CircularProgress className={classes.loading} size={22} thickness={5} />
								)}
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	right: {
		float: 'right'
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	buttonContainer: {
		display: 'flex',
		flexDirection: 'row'
	},
	btn: {
		fontSize: 12,
		marginRight: 10
	}
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getRoles,
	onSubmit,
	onChange,
	setFormIsEdit,
	switchPassword,
	sendImmapVerification,
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
	userData: state.dashboardUser.userData,
	errors: state.dashboardUser.errors,
	change_password: state.dashboardUser.change_password,
	isEdit: state.dashboardUser.isEdit,
	apiURL: state.dashboardUser.apiURL,
	redirectURL: state.dashboardUser.redirectURL,
	roles: state.options.roles,
	mail_loading: state.dashboardUser.mail_loading,
	showLoading: state.dashboardUser.showLoading
});

UserForm.propTypes = {
	userData: PropTypes.object.isRequired,
	errors: PropTypes.object,
	change_password: PropTypes.number.isRequired,
	isEdit: PropTypes.bool.isRequired,
	apiURL: PropTypes.string.isRequired,
	redirectURL: PropTypes.string.isRequired,
	roles: PropTypes.array.isRequired,
	getRoles: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	setFormIsEdit: PropTypes.func.isRequired,
	switchPassword: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(UserForm)));
