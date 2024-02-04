/** import React, React.Component, moment, and axios */
import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Close from "@material-ui/icons/Close";
import Send from '@material-ui/icons/Send';
import Cookies from 'js-cookie';
/** Unhide if phsyical interview is required on the system
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
*/

/** import custom components */
import SelectField from '../../../common/formFields/SelectField';
import DatePickerField from '../../../common/formFields/DatePickerField';

/** import Redux and it's actions */
import { connect } from 'react-redux';
import { getTimezones, getImmapers } from '../../../redux/actions/optionActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

/** import configuration value and validation helper */
import { blueIMMAP, white, blueIMMAPHover, blue } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

/**
 * Interview is a component to be shown in the roster page under Interview tab
 *
 * @name Interview
 * @component
 * @category Roster
 */
class Interview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			interview_date: moment(new Date()).add('2', 'days'),
			interview_skype: '',
			interview_timezone: '',
			alreadySent: false,
			immaper_invite: [],
			isLoading: false,
			interview_type: 0,
			interview_address: '',
			interview_address_is_required: false,
			errors: {},
			open_confirmation: false,
      microsoft_login: false,
			new_step: '',
			id: '',
			commentText: ''
		};

		this.interview = this.interview.bind(this);
		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
    /** Unhide if phsyical interview is required on the system
		this.selectOnChangePhysical = this.selectOnChangePhysical.bind(this);
    */
		this.dateOnChange = this.dateOnChange.bind(this);
		this.isValid = this.isValid.bind(this);

		this.openConfirmation = this.openConfirmation.bind(this);
		this.closeConfirmation = this.closeConfirmation.bind(this);
		this.closeMicrosoftLogin = this.closeMicrosoftLogin.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.props.getTimezones();
		this.props.getImmapers(false, 'forRoster');
		let { profile } = this.props;
		let { roster_processes } = profile;
		let roster_process = roster_processes[0];

		if (!isEmpty(roster_process.pivot.interview_skype)) {
			this.setState({ interview_skype: roster_process.pivot.interview_skype });
		} else if (!isEmpty(this.props.authSkype)) {
			this.setState({ interview_skype: this.props.authSkype });
		}

		if (!isEmpty(roster_process.pivot.interview_date)) {
			this.setState({ interview_date: moment(roster_process.pivot.interview_date) });
		}

		if (!isEmpty(roster_process.pivot.skype_date) && this.props.is3Heads) {
			this.setState({ interview_date: moment(roster_process.pivot.skype_date) });
		}

		if (!isEmpty(roster_process.pivot.interview_timezone)) {
			this.setState({
				interview_timezone: {
					value: roster_process.pivot.interview_timezone ,
					label: roster_process.pivot.interview_timezone
				}
			});
		}
		if (!isEmpty(roster_process.pivot.skype_timezone) && this.props.is3Heads) {
			this.setState({
				interview_timezone: {
					value: roster_process.pivot.skype_timezone ,
					label: roster_process.pivot.skype_timezone
				}
			});
		}
		if (!isEmpty(roster_process.pivot.panel_interview)) {
			this.setState({
				immaper_invite: JSON.parse(roster_process.pivot.panel_interview)
			});
		}

		if (roster_process.pivot.interview_invitation_done == 1 && !this.props.is3Heads) {
			this.setState({ alreadySent: true });
		}

		if (roster_process.pivot.skype_invitation_done == 1 && !this.props.is3Heads) {
			this.setState({ alreadySent: true });
		}

		this.setState({ interview_type: roster_process.pivot.interview_type });
		this.setState({ interview_address: roster_process.pivot.interview_address }, () => this.isValid());
	}

  /**
   * openConfirmation is a function to open confirmation modal
   */
	openConfirmation() {
		this.setState({ open_confirmation: true });
	}

  /**
   * closeConfirmation is a function to close confirmation modal
   */
	closeConfirmation() {
		this.setState({ open_confirmation: false, new_step: '', id: '' });
 	}

  /**
   * onChange is a function to handle change of value in the form
   * @param {*} e
   */
	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

  /**
   * selectOnChange is a function handle change of value for select field
   * @param {array} value
   * @param {*} e
   */
	selectOnChange(value, e) {
		if ([ e.name ] == 'immaper_invite') {
			if (value.length < 6) {
				this.setState({ [e.name]: value }, () => this.isValid());
				this.props.setImmaperInvite(value);
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
   * selectOnChangePhysical is a function handle change of value for select field
   * when the interview in physical mode
   * @param {array} value
   * @param {*} e
   */
  /** Unhide if phsyical interview is required on the system
	selectOnChangePhysical(value, e) {
		this.setState({ [e.name]: value, interview_address_is_required: value == 1 ? true : false }, () =>
			this.isValid()
		);
	}
  **/

  /**
   * dateOnChange is a function to handle change of date for DatePickerField
   * @param {*} e
   */
	dateOnChange(e) {
		this.setState({ [e.target.name]: moment(e.target.value) }, () => this.isValid());
	}

   /** function to close microsoft login */
    closeMicrosoftLogin() {
	   this.setState({ microsoft_login: false, microsoft_login_url: ''  });
	}

  /**
   * interview is a function to send interview invitation
   */
	interview() {
		let {
			interview_skype,
			interview_timezone,
			interview_date,
			immaper_invite,
			interview_type,
			interview_address,
      /** Unhide if phsyical interview is required on the system
			interview_address_is_required
      */
		} = this.state;

		let physical = !this.props.is3Heads ? true : interview_type === 0 ? true : interview_type === 1 && !isEmpty(interview_address) ? true : false;

		if (
			!isEmpty(interview_timezone) &&
			!isEmpty(interview_date) &&
			!(isEmpty(immaper_invite) && !this.props.is3Heads) &&
			(this.props.selected_step.has_interview == 1 || this.props.is3Heads) &&
			physical
      /** Unhide if phsyical interview is required on the system
      interview_typeinterview_address_is_required
      */
		) {
			let { selected_step, roster_process, profile } = this.props;
			let { has_interview, id, order } = selected_step;
			let immaper = immaper_invite.map((data) => {
				return data.value;
			});
			const additionalData = {};
			additionalData.commentText = this.state.commentText;

			this.setState({ isLoading: true }, () => {
				axios
					.post('api/roster/interview-invitation', {
						roster_process,
						roster_step_id: id,
						has_interview: has_interview,
						current_step: order,
						profile_id: profile.id,
						profile_roster_id: this.props.profileRosterProcessId,
						is3Heads: this.props.is3Heads ? 1 : 0,
						interview_timezone: interview_timezone.value,
						interview_date: moment(interview_date).format('YYYY-MM-DD HH:mm:ss'),
						panel_interview: this.props.is3Heads ? [] : immaper_invite,
						immaper_invite: this.props.is3Heads ? [] : immaper_invite.map(v => v.value),
						immaper,
						interview_type,
						interview_address: interview_type === 1 ? interview_address : null,
						...additionalData,
						microsoft_access_token: Cookies.get('microsoft_access_token') ? Cookies.get('microsoft_access_token') : '',
						microsoft_refresh_token: Cookies.get('microsoft_refresh_token') ? Cookies.get('microsoft_refresh_token') : '',
						microsoft_token_expire: Cookies.get('microsoft_token_expire') ? Cookies.get('microsoft_token_expire') : '',
					})
					.then((res) => {
						if(res.data.data) {
							if(res.data.data.access_token) Cookies.set("microsoft_access_token", res.data.data.access_token);
							if(res.data.data.refresh_token) Cookies.set("microsoft_refresh_token", res.data.data.refresh_token);
							if(res.data.data.expires_in) Cookies.set("microsoft_token_expire",  res.data.data.expires_in);
						}
						this.setState({ isLoading: false, alreadySent: true , open_confirmation: false  }, () => {
              			this.props.reloadProfiles();
							this.props.addFlashMessage({
								type: 'success',
								text: 'Invitation Sent!'
							});
						});
						this.props.setInterviewDate(this.state.interview_date, this.state.interview_timezone);
					})
					.catch((err) => {
						if(err.response.status === 500 && err.response.data.message && err.response.data.message.startsWith('http')) {
							this.setState({microsoft_login: true, microsoft_login_url: err.response.data.message, isLoading: false });
						} else {
							this.setState({ isLoading: false }, () => {
								this.props.addFlashMessage({
									type: 'error',
									text: 'There is an error while sending invitation'
								});
							});
						}
					});
			});
		} else {
			this.props.addFlashMessage({
				type: 'error',
				text: 'There is an error in the interview form'
			});
		}
	}

  /**
   * isValid is a function to check if the interview form data is valid or not
   */
	isValid() {
		let errors = {};
		const {
			interview_type,
			interview_address,
			interview_timezone,
			immaper_invite
		} = this.state;

		if ((interview_type !== 1 && interview_type !== 0) && !this.props.is3Heads) {
			errors.interview_type = 'Invalid Physical Interview Data';
		}

		if (interview_type === 1) {
			if (isEmpty(interview_address)) {
				errors.interview_address = 'Address is required';
			}
		}

		if (isEmpty(immaper_invite) && !this.props.is3Heads) {
			errors.immaper_invite = 'Consultant for interview is required';
		}

		if (isEmpty(interview_timezone)) {
			errors.interview_timezone = 'Timezone is required';
		}

		this.setState({ errors });
	}

	render() {
		const { timezones, classes, immapers, profile } = this.props;
		const {
			interview_timezone,
			interview_date,
			alreadySent,
			isLoading,
			errors,
			immaper_invite,
      /** Unhide if phsyical interview is required on the system
			interview_type,
			interview_address
       */
		} = this.state;
		return (
      <>
        {this.props.divider}
        <Grid container spacing={16} alignItems="center" className={classes.inviteContainer}>
          {/* Unhide if phsyical interview is required on the system
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormControl margin="none" error={!isEmpty(errors.interview_type)}>
              <FormControlLabel
                className={classes.switch}
                labelPlacement="start"
                control={
                  <Switch
                    checked={interview_type === 1 ? true : false}
                    onChange={(e) =>
                      this.selectOnChangePhysical(interview_type == 1 ? 0 : 1, {
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
              {!isEmpty(errors.interview_type) && <FormHelperText>{errors.interview_type}</FormHelperText>}
            </FormControl>
          </Grid>
          {interview_type == 1 && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                required
                id={profile.id + '-interview_address'}
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
          )} */}
		  {!this.props.is3Heads && (
			<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
		  )}
          <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
            <Grid container spacing={16} alignItems="flex-end">
				<Grid item xs={12} sm={12} md={6}>
					<SelectField
					label="Timezone"
					margin="none"
					options={timezones}
					value={interview_timezone}
					placeholder="Choose Timezone"
					isMulti={false}
					name="interview_timezone"
					fullWidth
					onChange={this.selectOnChange}
					error={errors.interview_timezone}
					required
					/>
              	</Grid>
              <Grid item xs={12} md={6}>
                <DatePickerField
                  label="Interview Date & Time"
                  name="interview_date"
                  value={interview_date}
                  onChange={this.dateOnChange}
                  error={errors.interview_date}
                  margin="none"
                  usingTime={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={3} xl={3}>
            <Button
              size="small"
              color="primary"
              fullWidth
              variant="contained"
              className={classes.interviewBtn}
              onClick={this.openConfirmation}
              disabled={!isEmpty(errors)}
            >
              {alreadySent ? 'Invitation Sent!' : 'Send Invitation'}
              {!alreadySent ? <Send fontSize="small" className={classes.addSmallMarginLeft} /> : null}
              {isLoading ? <CircularProgress thickness={5} size={22} className={classes.loading} /> : null}
            </Button>

            <Dialog open={this.state.open_confirmation} onClose={this.closeConfirmation}>
              <DialogTitle>{'Confirmation'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {`Are you sure you want to invite ${profile.user.full_name} for ${profile.roster_processes[0].name} ${this.props.selected_step.step}?`}
                </DialogContentText>
                <FormControl margin="none"  className={classes.interviewComment} >
                  <FormControlLabel
                      className={classes.interviewCommentLabel}
                      labelPlacement="top"
                      control={
                        <TextField
                          onChange={this.onChange}
                          className={classes.interviewCommentText}
                          rows={5}
                          multiline
                          name="commentText"/>
                      }
                      label="Comments to share with the candidate"
                    />
                    {!isEmpty(errors.interview_type) && (
                      <FormHelperText>{errors.interview_type}</FormHelperText>
                    )}
              </FormControl>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="secondary" onClick={this.closeConfirmation}>
                  <Close fontSize="small" /> Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.blueIMMAP}
                  onClick={this.interview}
				  disabled={isLoading}
                >
                  Confirm
                  {isLoading ? (
                    <CircularProgress
                      thickness={5}
                      size={22}
                      className={classes.loading}
                    />
                  ) : (
                    <Send fontSize="small" className={classes.addMarginLeft} />
                  )}
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={this.state.microsoft_login} onClose={this.closeMicrosoftLogin}>
              <DialogTitle>{'Microsoft Login'}</DialogTitle>
              <DialogContent>

                <DialogContentText id="alert-dialog-description">
                You will be redirected to Microsoft Outlook in order to login with your iMMAP account. Please confirm the invitation after being authenticated.
                </DialogContentText>

              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="secondary" onClick={()=>{this.closeMicrosoftLogin()}}>
                  <Close fontSize="small" /> Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.blueIMMAP}
                        onClick={() => {
                          window.open(this.state.microsoft_login_url, '_blank').focus();
                          this.closeMicrosoftLogin();
                        }}
                >
                  Proceed
                  {isLoading ? (
                    <CircularProgress
                      thickness={5}
                      size={22}
                      className={classes.loading}
                    />
                  ) : (
                    <Send fontSize="small" className={classes.addMarginLeft} />
                  )}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getTimezones,
	addFlashMessage,
	getImmapers
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	selected_step: state.roster.selected_step,
	roster_process: state.roster.roster_process,
	timezones: state.options.timezones,
	immapers: state.options.immapers,
	authSkype: state.options.skype
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	inviteContainer: {
		'margin-bottom': theme.spacing.unit / 2 * -1
	},

	interviewBtn: {
		'background-color': blue,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	switchBase: {
		height: 'auto'
	},
	switch: {
		marginLeft: 0
	},
	blueIMMAP: {
		background: blueIMMAP,
		"&:hover": {
		  background: blueIMMAPHover,
		},
		marginLeft: theme.spacing.unit * 1
	},
	interviewCommentText: {
	width: '100%',
	marginLeft: 0
	},
	interviewComment: {
		width: '100%',
		marginLeft: 0,
		padding: 0,
		alignItems: 'left',
		alignContent: 'left',
		marginTop: 15
	  },
	interviewCommentLabel: {
		textAlign: 'left',
		marginLeft: '0px',
		marginRight: '0px',
		alignItems: 'start'
	},
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Interview));
