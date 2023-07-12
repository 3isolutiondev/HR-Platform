/** import React, classname, moment and PropTypes */
import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { changeStep, changeProfileSelected } from '../../../redux/actions/roster/rosterActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getAPI, postAPI, deleteAPI, putApi } from '../../../redux/actions/apiActions';
import { getPDFInNewTab } from '../../../redux/actions/common/PDFViewerActions';

/** import custom components */
import ProfileModal from '../../../common/ProfileModal';
import SelectField from '../../../common/formFields/SelectField';
import Skype from './Skype';
import Interview from './Interview';
import IMTestScore from './IMTestScore';
import ReferenceCheck from './ReferenceCheck';
import JobScore from '../../jobs/JobScore';

/** import configuration value and validation helper */
import isEmpty from '../../../validations/common/isEmpty';
import { blueIMMAP, primaryColor, white } from '../../../config/colors';
import { can } from '../../../permissions/can';

/**
 * RosterCard is a component to show the data of each roster applicant
 *
 * @name RosterCard
 * @component
 * @category Page
 * @subcategory Roster
 */
class RosterCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			age: 0,
			openProfile: false,
			changeStatusLoading: false,
			errors: {},
			updatedScores: null,
			immaper_invite: null,
			profilesSelected:[],
		};
		this.openCloseProfile = this.openCloseProfile.bind(this);
		this.changeStatus = this.changeStatus.bind(this);
		this.updateScores = this.updateScores.bind(this);
		this.getReport = this.getReport.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.setImmaperInvite = this.setImmaperInvite.bind(this);
		this.setInterviewDate = this.setInterviewDate.bind(this);
	}

	componentDidMount() {
		this.startTimer();
	}

	/**
   * updateScore is a function that update scores
   * @param {object} scores - score object
   * @param {object} globalImpression - global comments
   */
	updateScores(scores, globalImpression) {
		const existingScores = this.state.updatedScores || this.props.profile.profile_roster_processes[this.props.profile.profile_roster_processes.length - 1].job_interview_scores || [];
    	const excludedScores = existingScores.filter(s => !scores.find(ss => ss.id === s.id));
	    this.setState({updatedScores: [...scores, ...excludedScores], updatedGlobalImpression:[globalImpression] });
		this.props.postAPI(`/api/job-interview-scores/roster-process/${this.props.roster_process_id}/profile/${this.props.profile.profile_roster_processes[0].id}/final-score`)
		.then(res => {
			this.props.getAPI(`/api/job-interview-scores/roster-process/${this.props.roster_process_id}/profile/${this.props.profile.profile_roster_processes[0].id}`)
			.then(res => {}).catch(err => {
			});
		}).catch(err => {
		});
	}

  /**
   * openCloseProfile is a function to open or close Profile Modal
   */
	openCloseProfile() {
		const { openProfile } = this.state;
		if (openProfile) {
			this.setState({ openProfile: false });
		} else {
			this.setState({ openProfile: true });
		}
	}

  /**
   * setImmaperInvite is a function to set immaper invite list
   */
	setImmaperInvite(immaper_invite) {
		this.setState({immaper_invite});
	}

   /**
   * setInterviewDate is a function to set interview date
   */
	setInterviewDate(interviewDate, timezone) {
		this.setState({interviewDate, timezone});
	}

  /**
   * changeStatus is a function to change applicant status
   * @param {Object} value - {value: 1, label: 'Roster Step'} format
   * @param {number} id    - profile id
   */
	changeStatus(value, id) {
		this.setState({ changeStatusLoading: true }, async () => {
			await this.props.changeStep(value, id, this.props.currentPage);
			this.props.getStepCount({value:this.props.selected_step.roster_process_id});
			this.setState({ changeStatusLoading: false });
		});
	}

	getReport() {
		this.props.getPDFInNewTab(`/api/job-interview-scores/roster-process/${this.props.roster_process_id}}/profile/${this.props.profile.profile_roster_processes[0].id}`)
	  }

	startTimer() {
		const timezone = this.props.profile.roster_processes[0].pivot.interview_timezone;
		const interviewDate = this.props.profile.roster_processes[0].pivot.interview_date;
		const timez = timezone ? typeof timezone === 'string' ? timezone : typeof timezone === 'object' ? timezone.value : 'utc' : 'utc'
		let interviewCompareDate = moment(interviewDate);
		interviewCompareDate = interviewCompareDate.tz(timez, true);

		if (!this.timer && moment().clone().tz(timez).isBefore(interviewCompareDate)) {
		  this.timer = setInterval(() => {
			const timezone2 = this.props.profile.roster_processes[0].pivot.interview_timezone;
		    const interviewDate2 = this.props.profile.roster_processes[0].pivot.interview_date;
			const timez2 = timezone2 ? typeof timezone2 === 'string' ? timezone2 : typeof timezone2 === 'object' ? timezone2.value : 'utc' : 'utc'
			let interviewCompareDate2 = moment(interviewDate2);
			interviewCompareDate2 = interviewCompareDate2.tz(timez2, true);
			const interviewDoneCheck = moment().clone().tz(timez).isAfter(interviewCompareDate2);
			if(interviewDoneCheck && !this.state.updating){
			   this.setState({updating: !this.state.updating})
			   clearInterval(this.timer);
			}
		  }, 1000);
		}
	  }


	render() {
		const { classes, profile, selected_step, roster_steps, isAdmin } = this.props;
		const { id, user } = profile;
		const { openProfile, changeStatusLoading, profilesSelected } = this.state;
		const { selectedRosterID } = this.state;
		const step_options = roster_steps.map(function(step) {
			return { value: step.id, label: step.step };
		});
    	const rosterProcessLength = profile.roster_processes.length - 1;
    	const rosterApplicationLength = profile.profile_roster_processes.length - 1;
		const selectedStep = { value: selected_step.id, label: selected_step.step };
    	const isRejected = (profile.profile_roster_processes[rosterProcessLength]['is_rejected'] === 1)
                        || (profile.profile_roster_processes[rosterProcessLength]['is_rejected'] === '1');

		const isAccepted = (profile.profile_roster_processes[rosterProcessLength]['is_completed'] === 1)
						|| (profile.profile_roster_processes[rosterProcessLength]['is_completed'] === '1');

		const movedBy = profile.profile_roster_processes[rosterApplicationLength];
		const movedAt = profile.profile_roster_processes[rosterApplicationLength].moved_date;
		const jobTitle = profile.profile_roster_processes[rosterApplicationLength].title;
		const immaper_invite = this.state.immaper_invite || JSON.parse(profile.roster_processes[rosterProcessLength].pivot.panel_interview);

		let scores = this.state.updatedScores || profile.profile_roster_processes[rosterApplicationLength].job_interview_scores;
		const globalImpression = this.state.updatedGlobalImpression || profile.profile_roster_processes[rosterApplicationLength].job_interview_global_impression || [];
		let finalScore = 'PENDING';
		const managerScores = {};
		let totalQuestions = [];

		if(immaper_invite) {
			finalScore = 'PENDING';
			immaper_invite.forEach(im => {
				totalQuestions = [...totalQuestions, ...profile.profile_roster_processes[rosterApplicationLength].interview_questions.filter(i => im.id === i.user_id)];
			});

			scores = scores.filter(s => s.roster_profile_id === profile.profile_roster_processes[rosterApplicationLength].id && (!s.interview_question || s.interview_question.roster_profile_id !== null));
			scores = scores.filter(s => totalQuestions.find(iq => s.interview_question_id === iq.id));
			if(scores.length >= totalQuestions.length) {
				scores.filter(s => s.interview_question && s.interview_question.question_type === 'number').forEach(s => {
					if(managerScores[s.interview_question.user_id]) {
						managerScores[s.interview_question.user_id].sum += s.score;
						managerScores[s.interview_question.user_id].count += 1;
					} else {
						managerScores[s.interview_question.user_id] = {sum: s.score, count: 1}
					}
				});

				finalScore = 0;

				Object.keys(managerScores).forEach(m => {
					if(managerScores[m].count > 0) finalScore += managerScores[m].sum / managerScores[m].count;
				})
				finalScore = Number.parseFloat((finalScore/ Object.keys(managerScores).length).toString()).toFixed(2);
			}
		}

		const isInterviewDone = (profile.profile_roster_processes[rosterApplicationLength]['interview_invitation_done'] === 1)
								|| (profile.profile_roster_processes[rosterApplicationLength]['interview_invitation_done'] === '1');

		if(!immaper_invite || immaper_invite.length === 0) finalScore = 'PENDING';

		const timezone = this.state.timezone || profile.profile_roster_processes[rosterApplicationLength].interview_timezone;
		const interviewDate = this.state.interviewDate || profile.profile_roster_processes[rosterApplicationLength].interview_date;

		const timez = timezone ? typeof timezone === 'string' ? timezone : typeof timezone === 'object' ? timezone.value : 'utc' : 'utc'
		let interviewCompareDate = moment(interviewDate);
		interviewCompareDate = interviewCompareDate.tz(timez, true);
		const interviewDoneCheck = moment().clone().tz(timez).isAfter(interviewCompareDate);
		const canMoveReferenceCheck = can('Send Reference Check') || selected_step.has_reference_check != 1;
		const sendInvitation = selected_step.has_skype_call == 1 && can('Send Interview Invitation') ? true : false;
		
		return (
			<Grid item xs={12} key={id} className={classnames(classes.noPaddingTop, classes.firstGrid)}>
				<Grid container spacing={16} alignItems="center">
					{ sendInvitation &&
						<Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
							<FormControlLabel
								control={
									<Checkbox
										name="is_default"
										color="primary"
										onChange={ async (e) =>{
											 await this.props.changeProfileSelected(id);
											 await this.props.changeProfilesSelected();
											 this.setState({ profilesSelected: this.props.profiles_selected })
										} }
										disabled={this.props.check}
									/>
								}
							/>
						</Grid>
					}
					<Grid item className={classes.marginBox} xs={sendInvitation ? 11 : 12} sm={sendInvitation ? 11: 12} md={sendInvitation ? 11 : 12} lg={sendInvitation ? 11 : 12} xl={sendInvitation ? 11 : 12}>
						<Card className={classes.overflow}>
						<CardContent className={classes.cardContent}>
							<Grid container spacing={16} alignItems="center">
								<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
									<Typography variant="h6" color="primary" component="span" className={classes.name}>
										{user.full_name} {(isAdmin && user.archived_user === "yes") && '[Archived]'}
									</Typography>
									<Typography variant="subtitle2" color="secondary" component="span">
										Applied at :{' '}
										{!isEmpty(profile.roster_processes) ?
											moment(
												profile.roster_processes[rosterProcessLength]['pivot'][
													'created_at'
												]
											)
												.local()
												.format('DD MMMM YYYY (HH:mm)') : ''}
									</Typography>
										{isRejected && (
										<Typography variant="subtitle2" color="secondary" component="span">
											Rejected at :{' '}
											{!isEmpty(profile.roster_processes)?
											moment(
												profile.roster_processes[rosterProcessLength]['pivot']['updated_at']
											)
												.local()
												.format('DD MMMM YYYY (HH:mm)') : ''}
										</Typography>
										)}
								</Grid>
								<Grid item xs={12} md={6} lg={3} xl={3}>
									<Typography variant="h6" color="primary" component="span">
										{profile.p11_education_universities[0] ? profile.p11_education_universities[0].degree_level.name : ''}
									</Typography>
									<Typography variant="subtitle2" color="secondary" component="span">
										{profile.p11_education_universities[0] ? profile.p11_education_universities[0].degree : ''}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
									<SelectField
										label="Roster Step"
										options={step_options}
										value={selectedStep}
										onChange={(value, e) => {
											this.changeStatus(value, id);
										}}
										placeholder="Select roster step"
										isMulti={false}
										name="roster_step"
										required
										fullWidth={true}
										isDisabled={!canMoveReferenceCheck ||
											((selected_step.has_im_test == 1 &&
											isEmpty(profile.profile_roster_processes[rosterApplicationLength].im_test_sharepoint_link) &&
											isEmpty(profile.profile_roster_processes[rosterApplicationLength].im_test_score)) || changeStatusLoading) ? true : false
											}
										margin="dense"
										showLoading={changeStatusLoading ? true : false}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
									<Button
										size="small"
										fullWidth
										variant="contained"
										color="primary"
										onClick={this.openCloseProfile}
										className={classes.addSmallMarginRight}
									>
										<RemoveRedEye fontSize="small" className={classes.addSmallMarginRight} /> View
										Profile
									</Button>
								</Grid>
								<ProfileModal
									isOpen={openProfile}
									profileId={id}
									onClose={this.openCloseProfile}
								/>
							</Grid>
							<Grid container spacing={16} alignItems="center">
							<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
								<Typography variant="subtitle1" color="secondary"  component="span" className={classes.name}>
								Applied From
								</Typography>
								<Typography variant="subtitle2" color="secondary" component="span">
								{isEmpty(jobTitle) ? "-" : jobTitle}
								</Typography>
							</Grid>
							{movedAt && <>
								<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
								<Typography variant="subtitle1" color="secondary"  component="span" className={classes.name}>
									Moved By
								</Typography>
								<Typography variant="subtitle2" color="secondary" component="span">
									{movedBy.full_name}
								</Typography>
								</Grid>
								<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
								<Typography variant="subtitle1" color="secondary"  component="span" className={classes.name}>
									Moved At
								</Typography>
								<Typography variant="subtitle2" color="secondary" component="span">
									{movedAt}
								</Typography>
								</Grid>
								</>
							}
				</Grid>

				{sendInvitation ?  <Interview
					setInterviewDate={this.setInterviewDate}
					setImmaperInvite={this.setImmaperInvite}
					profile={profile}
					reloadProfiles={this.props.reloadProfiles}
					divider={<hr className={classes.rosterDivider} />}
					is3Heads={true}
				/> : null}
				{(selected_step.default_step == 0 && selected_step.has_skype_call == 0) ?
				<IMTestScore
					profile={profile}
					reloadProfiles={this.props.reloadProfiles}
					isIMTest={selected_step.has_im_test == 1 ? true : false}
					divider={<hr className={classes.rosterDivider} />}
				/>
				: null
				}
				{selected_step.has_interview == 1 ?
				<Interview
					setInterviewDate={this.setInterviewDate}
					setImmaperInvite={this.setImmaperInvite}
					profile={profile}
					profileRosterProcessId={profile.profile_roster_processes[rosterApplicationLength].id}
					reloadProfiles={this.props.reloadProfiles}
					divider={<hr className={classes.rosterDivider} />}
				/> : null}
				{(selected_step.has_reference_check == 1 || isAccepted || isRejected) ? <ReferenceCheck roster_profile_id={profile.profile_roster_processes[rosterApplicationLength].id} isReference={selected_step.has_reference_check} profile={profile} divider={<hr className={classes.rosterDivider} />} /> : null}
							{((interviewDoneCheck || isInterviewDone) && (selected_step.default_step == 0 && selected_step.has_skype_call == 0 && selected_step.has_im_test == 0)) && (
								<Grid container spacing={16} alignItems="center" justify="space-between" style={{ marginBottom: 8, marginTop: 8, }}>
									{(immaper_invite) && (
					<>
						<Grid item >
						<Typography variant="subtitle1" color="primary" style={{ paddingTop: 8, borderTop: `2px solid ${primaryColor}`, width: 'fit-content' }}>Interview Score</Typography>
						</Grid>
						{(selected_step.has_interview == 1) && (
						<Grid item xs={12} sm={12} md={12} lg={3}>
							<Button
								size="small"
								fullWidth
								variant="contained"
								color="default"
								onClick={() => {
								this.props.toogleShowQuestionDialog(profile.profile_roster_processes[rosterApplicationLength].id)
								}}
								className={classes.blueIMMAP}
							>
								<RemoveRedEye fontSize="small" className={classes.addSmallMarginRight} /> View Interview questions
							</Button>
						</Grid>
						)}
					</>
									)}
									{interviewDoneCheck ? (immaper_invite || []).map(data =>
										<Grid key={data.id} item xs={12} md={12} lg={12}>
											<Grid item xs={12} md={12} lg={12}>
												<JobScore
													interview_order={this.props.interview_order}
													updateScores={this.updateScores}
													user={profile.profile_roster_processes[0]}
													roster_profile_id={profile.profile_roster_processes[rosterApplicationLength].id}
													globalImpression = {globalImpression.filter(s => s.roster_profile_id === profile.profile_roster_processes[rosterApplicationLength].id)}
													scores={scores.filter(s => s.roster_profile_id === profile.profile_roster_processes[rosterApplicationLength].id)}
													questions={profile.profile_roster_processes[rosterApplicationLength].interview_questions ? profile.profile_roster_processes[rosterApplicationLength].interview_questions.filter(i => data.id === i.user_id) : []}
													manager={data}
													roster_process_id={this.props.roster_process_id}
												/>
											</Grid>
										</Grid>
									) : <Grid item xs={12}><Typography variant="body1">You cannot add your scores before the interview date</Typography></Grid>}
					{interviewDoneCheck &&
						<Grid item xs={12}>
						<Grid container spacing={32} direction='row' justify='space-between'>
							<Grid item>
							{(!isNaN(finalScore)) ?
								<Button onClick={this.getReport}
								align="right"
								size="small"
								variant="contained"
								color="primary"
								>
								PDF Report
								</Button> : <p></p>
							}
							</Grid>
							<Grid item>
							<Typography  align="right" color="primary" variant='body1' className={classes.finalScore} >FINAL SCORE : {' '} {isNaN(finalScore) ? 'PENDING' : `${finalScore} / 5`}</Typography>
							</Grid>
						</Grid>
						</Grid>
					}
								</Grid>
							)}
						</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

RosterCard.defaultProps = {
  isAdmin: false
}

RosterCard.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * profile is a prop containing profile data of the applicant
   */
  profile: PropTypes.object.isRequired,
  /**
   * selected_step is a prop containing data of selected step
   */
  selected_step: PropTypes.object.isRequired,
  /**
   * roster_steps is a prop containing all roster steps
   */
  roster_steps: PropTypes.array,
  /**
   * isAdmin is a prop containing data of current user permission is an Admin or not
   */
  isAdmin: PropTypes.bool,
  /**
   * reloadProfiles is a prop containing function to reload profile list on roster page
   */
   reloadProfiles: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	changeStep,
	addFlashMessage,
	postAPI,
	getAPI,
	getPDFInNewTab,
	changeProfileSelected
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	selected_profiles: state.roster.selected_profiles,
	selected_step: state.roster.selected_step,
	roster_steps: state.roster.roster_steps,
	profiles_selected: state.roster.profiles_selected
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	firstGrid: {
		'&:first-child': {
			'margin-top': '.5em'
		}
	},
	addMarginTop: {
		'margin-top': '.75em'
	},
	addMarginRight: {
		'margin-right': '.75em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	noPaddingTop: {
		'padding-top': '0 !important'
	},
	noTextDecoration: {
		'text-decoration': 'none'
	},
	blueIMMAP: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': primaryColor
		}
	},
	checkBox: {
		padding: '0 0 4px',
		cursor: 'pointer'
	},
	cardContent: {
		'padding-bottom': theme.spacing.unit,
		'padding-top': theme.spacing.unit,
		'padding-left': theme.spacing.unit * 2,
		'padding-right': theme.spacing.unit * 2,
		// 'padding-left': theme.spacing.unit * 2,
		'&:last-child': {
			'padding-bottom': theme.spacing.unit
		}
	},
	name: {
		display: 'inline'
	},
	displayInlineBlock: {
		display: 'inline-block',
		'vertical-align': 'middle'
	},
	checkList: {
		'vertical-align': 'middle',
		'margin-bottom': '.25em'
	},
	rosterDivider: {
		'border-color': primaryColor,
		'border-width': '0.025em',
		'border-style': 'solid'
	},
	overflow: {
		overflow: 'visible'
	},
	finalScoreContainer: {
		display: 'flex',
		flexOrientation: 'row-reversed'
	},
	finalScore: {
		fontSize: 17,
		fontWeight: 'bold',
		textAlign: 'right',
		color: 'black',
		marginRight: 5,
	},
	blueIMMAP: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': '#005A9B'
		}
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RosterCard));
