/** import React, PropTypes and React Helmet */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Save from '@material-ui/icons/Save';

/** import configuration value, validation helper and textSelector */
import { APP_NAME } from '../../config/general';
import { white } from '../../config/colors';
import isEmpty from '../../validations/common/isEmpty';
import { validate } from '../../validations/jobStatus';
import textSelector from '../../utils/textSelector';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';


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
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

/**
 * JobStatusForm is a component to show Job Status Form Page
 *
 * @name JobStatusForm
 * @component
 * @category Page
 *
 */
class JobStatusForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: '',
			default_status: 0,
			last_step: 0,
			is_interview: 0,
			set_as_shortlist: 0,
			set_as_rejected: 0,
			set_as_first_test: 0,
			set_as_second_test: 0,
			set_as_test: 0,
			under_sbp_program: "no",
			status_under_sbp_program: '',
			errors: {},
			isEdit: false,
			apiURL: '/api/job-status',
			redirectURL: '/dashboard/job-status',
			showLoading: false
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.checkOnChange = this.checkOnChange.bind(this);
	}

  /**
   * componentWillMount is a lifecycle function called where the component will be mounted
   */
	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/job-status/' + this.props.match.params.id,
				redirectURL: '/dashboard/job-status/' + this.props.match.params.id + '/edit'
			});
		}
	}


  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiURL)
				.then((res) => {
					const { status, id, default_status, last_step, is_interview,
						set_as_shortlist, set_as_rejected, under_sbp_program,
						status_under_sbp_program, set_as_first_test,  set_as_second_test, set_as_test
					} = res.data.data;

					this.setState({
						status, id, default_status, last_step, is_interview, set_as_shortlist, set_as_rejected, set_as_first_test, set_as_test,
						set_as_second_test, under_sbp_program, status_under_sbp_program: status_under_sbp_program ? status_under_sbp_program : ''
       		   });
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: textSelector('error', 'default')
					});
				});
		}
	}

  /**
   * isValid is a function to validate the form
   * @returns {boolean}
   */
	isValid() {
		const { errors, isValid } = validate(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}

  /**
   * onChange is a function to handle the change of data on the form
   * @param {Event} e
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
   * onSubmit is a function to handle submitting data to the backend
   * @param {Event} e
   */
	onSubmit(e) {
		e.preventDefault();

		let jobStatusData = {
			status: this.state.status,
			default_status: this.state.default_status,
			last_step: this.state.last_step,
			is_interview: this.state.is_interview,
			set_as_shortlist: this.state.set_as_shortlist,
			set_as_rejected: this.state.set_as_rejected,
			under_sbp_program: this.state.under_sbp_program,
			status_under_sbp_program: this.state.status_under_sbp_program,
			set_as_first_test: this.state.set_as_first_test,
			set_as_second_test: this.state.set_as_second_test,
			set_as_test: this.state.set_as_test
		};

		if (this.state.isEdit) {
			jobStatusData._method = 'PUT';
		}
		if (this.isValid()) {
			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, jobStatusData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							const { status, message } = res.data;
							this.props.history.push(this.state.redirectURL);
							this.props.addFlashMessage({
								type: status,
								text: message
							});
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							this.props.addFlashMessage({
								type: err.response.data.status ? err.response.data.status : 'error',
								text: err.response.data.message
									? err.response.data.message
									: 'There is an error while processing the request'
							});
						});
					});
			});
		}
	}

  /**
   * checkOnChange is a function to handle the change of data for a checkbox
   * @param {Event} e
   */
	checkOnChange(e) {
	if (e.target.name == 'set_as_first_test') {
		this.setState({ set_as_second_test: 0 });
	} else if (e.target.name == 'set_as_second_test') {
		this.setState({ set_as_first_test: 0 })
	}
    this.setState({ [e.target.name]: e.target.checked ? 1 : 0 }, () => {
      this.isValid();
    });
	}

	render() {
    let { status, default_status, last_step, is_interview,
      set_as_rejected, set_as_shortlist, errors, isEdit, set_as_first_test, set_as_second_test, set_as_test,
      showLoading, under_sbp_program, status_under_sbp_program
    } = this.state;
		const { classes } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Job Status : ' + status
						) : (
							APP_NAME + ' - Dashboard > Add Job Status'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Job Status : ' + status
							) : (
								APP_NAME + ' Dashboard > Add Job Status'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Job Status : ' + status}
								{!isEdit && 'Add Job Status'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="status"
								label="Status"
								autoComplete="status"
								autoFocus
								margin="normal"
								required
								fullWidth
								name="status"
								value={status}
								onChange={this.onChange}
								error={!isEmpty(errors.status)}
								helperText={errors.status}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControlLabel
								control={
									<Checkbox
										checked={default_status === 1 ? true : false}
										name="default_status"
										color="primary"
										onChange={this.checkOnChange}
									/>
								}
								label="Default Status"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControlLabel
								control={
									<Checkbox
										checked={last_step === 1 ? true : false}
										name="last_step"
										color="primary"
										onChange={this.checkOnChange}
									/>
								}
								label="Set as Last Step"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControlLabel
								control={
									<Checkbox
										checked={is_interview === 1 ? true : false}
										name="is_interview"
										color="primary"
										onChange={this.checkOnChange}
									/>
								}
								label="Set as Interview"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControlLabel
								control={
									<Checkbox
										checked={set_as_shortlist === 1 ? true : false}
										name="set_as_shortlist"
										color="primary"
										onChange={this.checkOnChange}
									/>
								}
								label="Set as Shortlist"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControlLabel
								control={
									<Checkbox
										checked={set_as_rejected === 1 ? true : false}
										name="set_as_rejected"
										color="primary"
										onChange={this.checkOnChange}
									/>
								}
								label="Set as Rejected"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControlLabel
								control={
									<Checkbox
										checked={under_sbp_program === "yes" ? true : false}
										name="under_sbp_program"
										color="primary"
										onChange={(e) => this.setState({
										under_sbp_program: e.target.checked ? "yes" : "no",
										status_under_sbp_program: ""
										}, () => this.isValid())}
									/>
								}
								label="Part of Surge Roster Program Alert"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControlLabel
								control={
									<Checkbox
										checked={set_as_test === 1 ? true : false}
										name="set_as_test"
										color="primary"
										onChange={this.checkOnChange}
									/>
								}
								label="Set as Test"
							/>
						</Grid>
						{ set_as_test === 1 && 
							<>
								<Grid item xs={12} sm={4}>
									<FormControlLabel
										control={
											<Checkbox
												checked={set_as_first_test === 1 ? true : false}
												name="set_as_first_test"
												color="primary"
												onChange={this.checkOnChange}
											/>
										}
										label="Set as First Test"
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<FormControlLabel
										control={
											<Checkbox
												checked={set_as_second_test === 1 ? true : false}
												name="set_as_second_test"
												color="primary"
												onChange={this.checkOnChange}
											/>
										}
										label="Set as Second Test"
									/>
								</Grid>
							</>
						}
						{ under_sbp_program === "yes" && (
						<Grid item xs={12}>
							<TextField
							id="status_under_sbp_program"
							label="Status for Surge Roster Program Alert"
							autoComplete="status_under_sbp_program"
							autoFocus
							margin="normal"
							required
							fullWidth
							name="status_under_sbp_program"
							value={status_under_sbp_program}
							onChange={this.onChange}
							error={!isEmpty(errors.status_under_sbp_program)}
							helperText={errors.status_under_sbp_program}
							/>
						</Grid>
						)}
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
									<CircularProgress thickness={5} size={22} className={classes.loading} />
								)}
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

JobStatusForm.propTypes = {
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
	getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux actions to call an api using POST HTTP Request
   */
	postAPI: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
	classes: PropTypes.object.isRequired,
  /**
   * addFlashMessage is a function to show a pop up message
   */
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(JobStatusForm));
