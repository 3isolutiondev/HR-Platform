import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Send from '@material-ui/icons/Send';
import { faAward } from '@fortawesome/free-solid-svg-icons/faAward';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';
import {
	blueIMMAPHover,
	blueIMMAP,
	white,
	recommendationColor,
	recommendationHoverColor
} from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';
import SelectField from '../../../common/formFields/SelectField';
import DatePickerField from '../../../common/formFields/DatePickerField';
import { getIMTestTemplates, getTimezones } from '../../../redux/actions/optionActions';
import { pluck } from '../../../utils/helper';
import { addFlashMessage } from '../../../redux/actions/webActions';
import Modal from '../../../common/Modal';
import Recap from '../../imtestUser/parts/Recap';

class IMTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			im_test_template: '',
			im_test_timezone: '',
			im_test_submit_date: moment(new Date()).add(7, 'days'),
			alreadySent: false,
			isLoading: false,
			openImTestRecap: false,
			errors: {}
		};

		this.dateOnChange = this.dateOnChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.imTestInvitation = this.imTestInvitation.bind(this);
		this.imTestInvitation = this.imTestInvitation.bind(this);
		this.closeImTestRecap = this.closeImTestRecap.bind(this);
		this.openImTestRecap = this.openImTestRecap.bind(this);
	}

	componentDidMount() {
		this.props.getTimezones();
		this.props.getIMTestTemplates();

		// if (!isEmpty(this.props.timezones)) {
		if (!isEmpty(this.props.timezones) && !isEmpty(this.props.im_test_templates)) {
			let { profile } = this.props;
			let { roster_processes } = profile;
			let roster_process = roster_processes[0];

			if (!isEmpty(roster_process.pivot.im_test_template_id)) {
				let label = pluck(this.props.im_test_templates, 'value');
				label = label.indexOf(roster_process.pivot.im_test_template_id);

				this.setState({
					im_test_template: {
						value: roster_process.pivot.im_test_template_id,
						label: this.props.im_test_templates[label]['label']
					}
				});
			}

			if (!isEmpty(roster_process.pivot.im_test_submit_date)) {
				this.setState({ im_test_submit_date: moment(roster_process.pivot.im_test_submit_date) });
			}

			if (!isEmpty(roster_process.pivot.im_test_timezone)) {
				this.setState({
					im_test_timezone: {
						value: roster_process.pivot.im_test_timezone,
						label: roster_process.pivot.im_test_timezone
					}
				});
			}

			if (roster_process.pivot.im_test_invitation_done == 1) {
				this.setState({ alreadySent: true });
			}
		}
		// }
	}

	componentDidUpdate(prevProps) {
		const currentIMTestTemplates = JSON.stringify(this.props.im_test_templates);
		const prevIMTestTemplates = JSON.stringify(prevProps.im_test_templates);

		if (currentIMTestTemplates != prevIMTestTemplates) {
			let { profile } = this.props;
			let { roster_processes } = profile;
			let roster_process = roster_processes[0];

			if (!isEmpty(roster_process.pivot.im_test_template_id)) {
				let label = pluck(this.props.im_test_templates, 'value');
				label = label.indexOf(roster_process.pivot.im_test_template_id);

				this.setState({
					im_test_template: {
						value: roster_process.pivot.im_test_template_id,
						label: this.props.im_test_templates[label]['label']
					}
				});
			}

			if (!isEmpty(roster_process.pivot.im_test_submit_date)) {
				this.setState({ im_test_submit_date: moment(roster_process.pivot.im_test_submit_date) });
			}

			if (!isEmpty(roster_process.pivot.im_test_timezone)) {
				this.setState({
					im_test_timezone: {
						value: roster_process.pivot.im_test_timezone,
						label: roster_process.pivot.im_test_timezone
					}
				});
			}

			if (roster_process.pivot.im_test_invitation_done == 1) {
				this.setState({ alreadySent: true });
			}
		}
	}

	dateOnChange(e) {
		this.setState({ [e.target.name]: moment(e.target.value) });
	}

	selectOnChange(value, e) {
		this.setState({ [e.name]: value });
	}

	imTestInvitation() {
		let { im_test_template, im_test_timezone, im_test_submit_date } = this.state;
		if (
			!isEmpty(im_test_template) &&
			!isEmpty(im_test_timezone) &&
			!isEmpty(im_test_submit_date) &&
			this.props.selected_step.has_im_test == 1
		) {
			let { selected_step, roster_process, profile } = this.props;
			let { has_im_test, id, order } = selected_step;
			this.setState({ isLoading: true }, () => {
				axios
					.post('api/roster/im-test-invitation', {
						roster_process,
						roster_step_id: id,
						has_im_test: has_im_test,
						current_step: order,
						profile_id: profile.id,
						im_test_template_id: im_test_template.value,
						im_test_timezone: im_test_timezone.value,
						im_test_submit_date: moment(im_test_submit_date).format('YYYY-MM-DD HH:mm:ss')
					})
					.then((res) => {
						this.setState({ isLoading: false, alreadySent: true }, () => {
							this.props.addFlashMessage({
								type: 'success',
								text: 'Invitation Sent!'
							});
						});
					})
					.catch((err) => {
						this.setState({ isLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'There is an error while sending invitation'
							});
						});
					});
			});
		}
	}

	openImTestRecap() {
		this.setState({ openImTestRecap: true });
	}

	closeImTestRecap() {
		this.setState({ openImTestRecap: false });
	}

	render() {
		const {
			im_test_template,
			im_test_timezone,
			im_test_submit_date,
			alreadySent,
			isLoading,
			errors,
			open,
			openImTestRecap
		} = this.state;
		const { classes, im_test_templates, timezones, profile } = this.props;

		return (
			<Grid container spacing={16} alignItems="center" className={classes.inviteContainer}>
				<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
					<SelectField
						label="IM Test Template"
						margin="none"
						options={im_test_templates}
						value={im_test_template}
						placeholder="Choose IM Test Template"
						isMulti={false}
						name="im_test_template"
						fullWidth
						onChange={this.selectOnChange}
						error={isEmpty(im_test_template) ? 'IM Test Template is required' : ''}
						required
					/>
				</Grid>
				<Grid item xs={12} md={6} lg={3} xl={3}>
					<SelectField
						label="Timezone"
						options={timezones}
						value={im_test_timezone}
						onChange={this.selectOnChange}
						placeholder="Select timezone"
						isMulti={false}
						name="im_test_timezone"
						error={isEmpty(im_test_timezone) ? 'Timezone is required' : ''}
						required
						fullWidth={true}
						margin="none"
					/>
				</Grid>
				<Grid item xs={12} md={6} lg={3} xl={3}>
					<DatePickerField
						label="Submit IM Test Date & Time"
						name="im_test_submit_date"
						value={im_test_submit_date}
						onChange={this.dateOnChange}
						error={errors.im_test_submit_date}
						margin="none"
						usingTime={true}
						// disablePast={interview_invitation_done ? false : true}
					/>
				</Grid>
				<Grid item xs={12} md={6} lg={3} xl={3}>
					<Button
						size="small"
						color="primary"
						// className={classes.addSmallMarginLeft}
						fullWidth
						variant="contained"
						className={classes.interviewBtn}
						onClick={this.imTestInvitation}
						// disabled={alreadySent}
						// onClick={() => nextStep(id)}
					>
						{alreadySent ? 'IM Test Sent!' : 'Send IM Test'}
						{!alreadySent ? <Send fontSize="small" className={classes.addSmallMarginLeft} /> : null}
						{isLoading ? <CircularProgress thickness={5} size={22} className={classes.loading} /> : null}
					</Button>
				</Grid>
				{profile.roster_processes[0].pivot.im_test_done == 1 ? (
					<Grid item xs={12} md={6} lg={3} xl={3}>
						<Typography variant="subtitle1" color="secondary" component="span" className={classes.name}>
							Submit Quiz IM Test Date & Time
						</Typography>
						<Typography variant="subtitle2" color="secondary" component="span">
							{moment(profile.roster_processes[0].pivot.im_test_end_time).format(
								'MMMM Do YYYY, h:mm:ss a'
							)}
						</Typography>
					</Grid>
				) : null}
				{profile.roster_processes[0].pivot.im_test_done == 1 ? (
					<Grid item xs={12} md={6} lg={3} xl={3}>
						<Typography variant="subtitle1" color="secondary" component="span" className={classes.name}>
							Total Time
						</Typography>
						<Typography variant="subtitle2" color="secondary" component="span">
							{moment
								.duration(
									moment(profile.roster_processes[0].pivot.im_test_end_time, 'YYYY/MM/DD HH:mm').diff(
										moment(profile.roster_processes[0].pivot.im_test_start_time, 'YYYY/MM/DD HH:mm')
									)
								)
								.asHours()
								.toFixed(2)}{' '}
							Hour
						</Typography>
					</Grid>
				): null}
				{profile.roster_processes[0].pivot.im_test_done == 1 ? (
					<Grid item xs={12} md={6} lg={6} xl={6}>
						<Button
							size="small"
							color="primary"
							fullWidth
							variant="contained"
							className={classes.resultBtn}
							onClick={() => this.openImTestRecap()}
						>
							{/* onClick trus */}
							<FontAwesomeIcon icon={faAward} size="lg" className={classes.addSmallMarginRight} /> View
							Result
						</Button>
					</Grid>
				) :  null}

				<Modal
					open={openImTestRecap}
					title=""
					handleClose={() => this.closeImTestRecap()}
					maxWidth="lg"
					scroll="body"
					handleSave={() => this.handleSave()}
					saveButton={false}
				>
					<Recap
						preview={true}
						profileID={profile.id}
						im_test_template={im_test_template}
						title={'IM Test Result : ' + profile.user.full_name}
					/>
				</Modal>
				{/* <Grid item xs={12}>
					<Button fullWidth variant="contained" className={classes.resultBtn} size="small">
						<FontAwesomeIcon icon={faAward} size="lg" className={classes.addSmallMarginRight} /> View Result
					</Button>
    </Grid> */}
			</Grid>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getIMTestTemplates,
	getTimezones,
	addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	im_test_templates: state.options.im_test_templates,
	selected_step: state.roster.selected_step,
	roster_process: state.roster.roster_process,
	timezones: state.options.timezones
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	inviteContainer: {
		'margin-bottom': '-4px'
	},
	name: {
		display: 'inline'
	},
	interviewBtn: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	resultBtn: {
		'background-color': recommendationColor,
		color: white,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTest));
