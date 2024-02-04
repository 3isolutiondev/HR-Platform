/** import React, classnames, moment and findIndex */
import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import findIndex from 'lodash/findIndex';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Send from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import {
	openCloseProfile,
	jobStatusOnChange,
	saveInterviewDate,
	sendInterview,
	uploadFiles,
	changePhysicalInterview,
	deleteApplicant
} from '../../../redux/actions/jobs/applicantActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getAPI } from '../../../redux/actions/apiActions';

/** import configuration value, permission checker and validation helper */
import { can } from '../../../permissions/can';
import { validateAplicantData } from '../../../validations/Jobs/Aplicant/AplicantCard';
import { blueIMMAP, blueIMMAPHover, white, primaryColor } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';
import { acceptedDocFiles } from '../../../config/general';

/** import custom components */
import SelectField from '../../../common/formFields/SelectField';
import DatePickerField from '../../../common/formFields/DatePickerField';
import UploadButton from '../../../common/UploadButton';
import ApplicantTestScore from './ApplicantTestScore';

/** ApplicantCardHistory component to show list of history for each applicant profile in job applicants page, URL: http://localhost:8000/jobs/{id}/applicants
 *
 * @name ApplicantCardHistory
 * @component
 * @category Page
 * @subcategory Jobs
 *
 */
class ApplicantCardHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isInterview: false,
			interviewDate: moment(new Date()),
			timezone: '',
			interview_invitation_done: false,
			isLoading: false,
			changeStatusLoading: false,
			interview_type: 0,
			interview_address: '',
			immaper_invite: [],
			skype_id: '',
			errors: {},
			user_interview_files: [],
			open_confirmation: false,
			open_confirmation_remove: false,
			new_step: '',
			id: ''
		};

		this.dateOnChange = this.dateOnChange.bind(this);
		this.changeStatus = this.changeStatus.bind(this);
		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.isValid = this.isValid.bind(this);
		this.selectOnChangePysical = this.selectOnChangePysical.bind(this);
		this.openConfirmation = this.openConfirmation.bind(this);
		this.openConfirmationRemove = this.openConfirmationRemove.bind(this);
		this.closeConfirmation = this.closeConfirmation.bind(this);
		this.closeConfirmationRemove = this.closeConfirmationRemove.bind(this);
		this.processStatusChange = this.processStatusChange.bind(this);
		this.deleteApplicant = this.deleteApplicant.bind(this);

	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.isValid();
	}

  /**
   * selectOnChangePysical is a function to change physical / online interview
   * @param {number} value - user id
   * @param {Event} e
   */
	async selectOnChangePysical(value, e) {
		let res = await this.props.changePhysicalInterview(this.props.user.id, value);
		if (res) {
			this.setState(
				{
					[e.name]: value,
					interview_address: value == 1 ? this.state.interview_address : '',
					skype_id: value == 1 ? '' : this.state.skype_id
				},
				() => {
					this.isValid();
				}
			);
		}
	}

  /**
   * dateOnChange is a function to handle interview date
   * @param {Event} e
   */
	dateOnChange(e) {
		this.setState({ [e.target.name]: moment(e.target.value) }, () => {
			this.props.saveInterviewDate(
				this.props.user.id,
				this.props.job_status[this.props.jobStatusTab],
				this.state.interviewDate
			);
		});
	}

  /**
   * openConfirmation is a function to open confirmation modal
   */
	openConfirmation() {
		this.setState({ open_confirmation: true });
	}

  /**
   * openConfirmationRemove is a function to open remove confirmation modal
   */
	openConfirmationRemove() {
		this.setState({ open_confirmation_remove: true });
	}

  /**
   * closeConfirmation is a function to close confirmation modal
   */
	closeConfirmation() {
		this.setState({ open_confirmation: false, new_step: '', id: '' });
	}

  /**
   * closeConfirmationRemove is a function to close remove confirmation modal
   */
	closeConfirmationRemove() {
		this.setState({ open_confirmation_remove: false });
	}

  /**
   * changeStatus is a function to change status of the applicant
   * @param {Object} value
   * @param {number} id
   */
	changeStatus(value, id) {
		if (
			JSON.stringify(value) !==
			JSON.stringify(this.props.job_status[this.props.user.job_user_history_status[0].order_status.order])
		) {
			if (!isEmpty(value) && !isEmpty(id)) {
				this.setState({ new_step: value, id }, () => {
					let newStepIndex = findIndex(this.props.job_status, value);
					if (newStepIndex == this.props.lastStepIndex) {
						this.openConfirmation();
					} else {
						this.processStatusChange();
					}
				});
			}
		} else {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Cannot pick the same status'
			});
		}
	}

  /**
   * processStatusChange is a function to call an api to change applicant status
   */
	processStatusChange() {
		this.setState({ changeStatusLoading: true }, async () => {
			await this.props.jobStatusOnChange(this.state.new_step, this.state.id);
			this.setState({ changeStatusLoading: false, new_step: '', id: '', open_confirmation: false });
		});
	}

  /**
   * onChange is a function to change state data
   * @param {Event} e
   */
	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

  /**
   * selectOnChange is a function to handle change of data coming from SelectField
   * @param {array} value
   * @param {Event} e
   */
	selectOnChange(value, e) {
		if ([ e.name ] == 'immaper_invite') {
			if (value.length < 6) {
				this.setState({ [e.name]: value }, () => this.isValid());
			} else {
				this.props.addFlashMessage({
					type: 'error',
					text: 'Only a maximum of 5 immapers'
				});
			}
		} else {
			this.setState({ [e.name]: value }, () => this.isValid());
		}
	}

  /**
   * isValid is a function to handle validation before sending an interview
   * @returns {Boolean}
   */
	isValid() {
		const { timezone, immaper_invite, skype_id, interview_type, interview_address } = this.state;
		let { errors, isValid } = validateAplicantData({
			timezone,
			immaper_invite,
			skype_id,
			interview_type,
			interview_address
		});
		this.setState({ errors });
		return isValid;
	}

	/** function to Delete an applicant by the admin */
	async deleteApplicant(id, userId){
	   this.setState({ isLoading : true});
	   await this.props.deleteApplicant(id, userId);
	   this.setState({ isLoading : false, open_confirmation_remove: false});
	}

	render() {
		let {
			user,
			job_status,
			jobStatusTab,
			openCloseProfile,
			jobStatusOnChange,
			sendInterview,
			timezones,
			classes,
			immapers,
			finished,
			uploadFiles,
			immap_email,
			usersSign,
			useTestStep,
			showApplicantTestLinkAndScore,
			isTestStep,
			testStepPosition
		} = this.props;
		let {
			age,
			isInterview,
			interviewDate,
			timezone,
			interview_invitation_done,
			isLoading,
			changeStatusLoading,
			errors,
			skype_id,
			immaper_invite,
			interview_type,
			interview_address,
			user_interview_files
		} = this.state;
		const { full_name, profile, id } = user;
		const isAdmin = can('Set as Admin');
    const selectedJobStatus = job_status.find(status => status.value === (user.job_user_history_status[0] || {order_status: {}}).order_status.id)

		return (
			<Card className={classnames(classes.addMarginTop, classes.card)}>
				<CardContent classes={{ root: classes.cardContent }}>
					<Grid container spacing={16} alignItems="center">
						<Grid item xs={12} md={6} lg={3}>
							<Typography variant="h6" color="primary" component="span">
								{full_name}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<Typography variant="h6" color="primary" component="span">
								{profile.latest_education_universities ? profile.latest_education_universities.degree_level.name: ''}
							</Typography>
							<Typography variant="subtitle2" color="secondary" component="span">
								{profile.latest_education_universities ? profile.latest_education_universities.degree : ''}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							{job_status ? (
								<div>
									<SelectField
										label="Job Status"
										options={job_status}
										value={selectedJobStatus}
										onChange={(value, e) => {
											this.changeStatus(value, id);
										}}
										placeholder="Select job status"
										isMulti={false}
										name="job_status"
										required
										fullWidth={true}
										margin="dense"
										showLoading={changeStatusLoading ? true : false}
									/>
								</div>
							) : null}
						</Grid>
						{can('View Applicant Profile') && (
							<Grid item xs={12} md={6} lg={3}>
								<Button
									size="small"
									fullWidth
									variant="contained"
									color="default"
									className={classes.interviewBtn}
									onClick={() => openCloseProfile(profile.id)}
								>
									<RemoveRedEye fontSize="small" className={classes.addSmallMarginRight} /> View
									Profile
								</Button>
							</Grid>
						)}
					</Grid>
					<hr style={{ borderColor: primaryColor, borderWidth: '0.5px' }} />

					<Grid container spacing={16} alignItems="center">
						<Grid item xs={12} md={6} lg={3}>
							<Typography variant="h6" color="secondary" component="span">
								Date of Application:
							</Typography>
							<Typography variant="subtitle2" color="secondary" component="span">
								{moment(user.job_user[0].created_at).format('DD MMMM YYYY')}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<Typography variant="h6" color="secondary" component="span">
								Moved By:
							</Typography>
							<Typography variant="subtitle2" color="secondary" component="span">
								{user.job_user_history_status.length > 0 ? user.job_user_history_status[0].mover ? (
									user.job_user_history_status[0].mover.full_name
								) : (
									''
								) : (
									''
								)}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6} lg={3}>
							<Typography variant="h6" color="secondary" component="span">
								Date of The Move:
							</Typography>
							<Typography variant="subtitle2" color="secondary" component="span">
								{user.job_user_history_status.length > 0 ? (
									moment(user.job_user_history_status[0].created_at).format('DD MMMM YYYY')
								) : (
									'-'
								)}
							</Typography>
						</Grid>
						{ isAdmin ? (
							<Grid item xs={12} md={6} lg={3}>
								<Button
								size="small"
								fullWidth
								variant="contained"
								color="primary"
								onClick={() => this.openConfirmationRemove()}
								>
								<DeleteIcon fontSize="small" className={classes.addSmallMarginRight} />
                 					 Remove this applicant
							  </Button>
							</Grid>
							) : null}
						{ (useTestStep == 1 && showApplicantTestLinkAndScore) &&
							<Grid item xs={12} md={12} lg={12}>
								<ApplicantTestScore
									profile={user.job_user[0]}
									divider={<hr className={classes.divider} />}
									isTestStep={isTestStep}
									testStepPosition={testStepPosition}
									allowEditTest={false}
								/>
							</Grid>
						}
					</Grid>
					{can('View Applicant Profile') && isInterview && <hr className={classes.interviewDivider} />}
					{(can('View Applicant Profile') &&
					isInterview) ? (
						<Grid container spacing={16} alignItems="center">
							<Grid item xs={12} md={12} lg={12}>
								<FormControl margin="none" error={!isEmpty(errors.interview_type)}>
									<FormControlLabel
										className={classes.switch}
										labelPlacement="start"
										control={
											<Switch
												checked={interview_type === 1 ? true : false}
												onChange={(e) =>
													this.selectOnChangePysical(interview_type == 1 ? 0 : 1, {
														name: e.target.name
													})}
												value={interview_type === 1 ? true : false}
												color="primary"
												name="interview_type"
												classes={{ switchBase: classes.switchBase }}
											/>
										}
										label="Physical Interview ?"
									/>
									{!isEmpty(errors.interview_type) && (
										<FormHelperText>{errors.interview_type}</FormHelperText>
									)}
								</FormControl>
							</Grid>
						</Grid>
					) : null}
					{(can('View Applicant Profile') &&
					isInterview &&
					interview_type == 1) ? (
						<Grid container spacing={16} alignItems="center">
							<Grid item xs={12} md={12} lg={12}>
								<TextField
									required
									id="interview_address"
									name="interview_address"
									label="Address"
									fullWidth
									autoComplete="interview_address"
									value={isEmpty(interview_address) ? '' : interview_address}
									onChange={this.onChange}
									error={!isEmpty(errors.interview_address)}
									helperText={errors.interview_address}
									autoFocus
									margin="none"
								/>
							</Grid>
						</Grid>
					) : null}
					{(can('View Applicant Profile') &&
					isInterview) ? (
						<Grid container spacing={16} alignItems="center">
							<Grid item xs={12} md={12} lg={12}>
								<SelectField
									label="Select Consultant for join interview *"
									options={immapers}
									value={immaper_invite}
									onChange={this.selectOnChange}
									placeholder="Select Consultant"
									name="immaper_invite"
									error={errors.immaper_invite}
									required
									isMulti={true}
									fullWidth={true}
									margin="none"
								/>
							</Grid>
						</Grid>
					) : null}
					{(can('View Applicant Profile') &&
					isInterview) ? (
						<Grid container spacing={16} alignItems="center">
							<Grid item xs={12} md={6} lg={interview_type == 0 ? 3 : 4}>
								<SelectField
									label="Timezone"
									options={timezones}
									value={timezone}
									onChange={this.selectOnChange}
									placeholder="Select timezone"
									isMulti={false}
									name="timezone"
									error={errors.timezone}
									required
									fullWidth={true}
									margin="dense"
								/>
							</Grid>
							<Grid item xs={12} md={6} lg={interview_type == 0 ? 3 : 4}>
								<DatePickerField
									label="Interview Date & Time"
									name="interviewDate"
									value={interviewDate}
									onChange={this.dateOnChange}
									error={errors.interviewDate}
									margin="dense"
									usingTime={true}
									disablePast={interview_invitation_done ? false : true}
								/>
							</Grid>
							{interview_type == 0 && (
								<Grid item xs={12} md={6} lg={3}>
									<TextField
										required
										id="skype_id"
										name="skype_id"
										label="Skype ID"
										fullWidth
										autoComplete="skype_id"
										value={skype_id}
										onChange={this.onChange}
										error={!isEmpty(errors.skype_id)}
										helperText={errors.skype_id}
									/>
								</Grid>
							)}
							<Grid item xs={12} md={interview_type == 0 ? 6 : 12} lg={interview_type == 0 ? 3 : 4}>
								<Button
									size="small"
									fullWidth
									variant="contained"
									className={classes.interviewBtn}
									onClick={() =>
										this.sendInterview(
											id,
											job_status[jobStatusTab],
											interviewDate,
											timezone,
											skype_id,
											immaper_invite,
											interview_type,
											interview_address,
											isEmpty(errors) && !isEmpty(timezone)
										)}
									disabled={!isEmpty(errors)}
								>
									{interview_invitation_done ? 'Invitation Already Sent! ' : 'Send Invitation'}
									<Send fontSize="small" className={classes.addSmallMarginLeft} />{' '}
									{isLoading && (
										<CircularProgress className={classes.loading} size={22} thickness={5} />
									)}
								</Button>
							</Grid>
							{interview_invitation_done &&
								immaper_invite.map((data) => {
									return (
										<Grid key={data.id} item xs={12} md={12} lg={12}>
											<UploadButton
												acceptedFileTypes={acceptedDocFiles}
												handleUpload={(e, id) => uploadFiles(e, id)}
												vipot={user.pivot}
												user_interview_files={user_interview_files}
												data={data}
												error={errors.upload}
												usersSign={usersSign}
											/>
										</Grid>
									);
								})}
						</Grid>
					) : null}
				</CardContent>
				<Dialog open={this.state.open_confirmation} onClose={this.closeConfirmation}>
					<DialogTitle>{'Confirmation'}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							You are about to notify the candidate of their selection for the job
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={this.closeConfirmation}
							color="secondary"
							variant="contained"
							disabled={changeStatusLoading ? true : false}
						>
							Cancel
						</Button>
						<Button
							onClick={(value, e) => {
								this.processStatusChange(value, id);
							}}
							color="primary"
							autoFocus
							variant="contained"
						>
							Confirm
							{changeStatusLoading && (
								<CircularProgress size={22} thickness={5} className={classes.loading} />
							)}
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={this.state.open_confirmation_remove} onClose={this.closeConfirmationRemove}>
					<DialogTitle>Delete Applicant</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-remove-confirmation">
							Are sure to delete this applicant?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={this.closeConfirmationRemove}
							color="secondary"
							variant="contained"
							disabled={isLoading ? true : false}
						>
						  <CancelIcon fontSize="small" className={classes.addSmallMarginRight} />
							Cancel
						</Button>
						<Button
							onClick={() => {
								this.deleteApplicant(user.job_user[0].job_id, user.job_user[0].user_id);
							}}
							color="primary"
							autoFocus
							variant="contained"
							disabled={isLoading ? true : false}
						>
						  <DeleteIcon fontSize="small" className={classes.addSmallMarginRight} />
							Delete
							{isLoading && (
								<CircularProgress size={22} thickness={5} className={classes.loading} />
							)}
						</Button>
					</DialogActions>
				</Dialog>
			</Card>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	openCloseProfile,
	jobStatusOnChange,
	saveInterviewDate,
	uploadFiles,
	sendInterview,
	getAPI,
	addFlashMessage,
	changePhysicalInterview,
	deleteApplicant
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	jobStatusTab: state.applicant_lists.jobStatusTab,
	lastStepIndex: state.applicant_lists.lastStepIndex,
	timezones: state.options.timezones,
	immapers: state.options.immapers,
	usersSign: state.auth.user.data
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	addMarginTop: {
		'margin-top': '1em'
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	capitaliza: {
		'text-transform': 'capitalize'
	},
	noTextDecoration: {
		'text-decoration': 'none'
	},
	cardContent: {
		padding: '8px 16px',
		'&:last-child': {
			'padding-bottom': '8px'
		}
	},
	card: {
		overflow: 'visible'
	},
	interviewBtn: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	interviewDivider: {
		'border-color': primaryColor,
		'border-width': '0.025em',
		'border-style': 'solid',
		marginBottom: '1em'
	},
	switchBase: {
		height: 'auto'
	},
	switch: {
		marginLeft: 0
	},
	divider: {
		'border-color': primaryColor,
		'border-width': '0.025em',
		'border-style': 'solid'
	},
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ApplicantCardHistory));
