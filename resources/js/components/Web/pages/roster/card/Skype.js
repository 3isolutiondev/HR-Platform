/** import React, React.Component, moment and axios */
import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Send from '@material-ui/icons/Send';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Close from "@material-ui/icons/Close";

/** import custom components */
import DatePickerField from '../../../common/formFields/DatePickerField';
import SelectField from '../../../common/formFields/SelectField';

/** import configuration value and validation helper */
import { blueIMMAP, blueIMMAPHover, white } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

/** import Redux and it's actions */
import { connect } from 'react-redux';
import { getTimezones } from '../../../redux/actions/optionActions';
import { addFlashMessage } from '../../../redux/actions/webActions';


/**
 * Skype is a component to be shown in the roster page under 3 Heads Questions tab
 *
 * @name Skype
 * @component
 * @category Roster
 */
class Skype extends Component {
	constructor(props) {
		super(props);
		this.state = {
			skype_timezone: '',
			skype: '',
			skype_date: moment(new Date()).add(2, 'days'),
			isLoading: false,
			errors: {},
			open_confirmation: false,
			new_step: '',
			id: ''
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.dateOnChange = this.dateOnChange.bind(this);
		this.skypeInvitation = this.skypeInvitation.bind(this);
		this.openConfirmation = this.openConfirmation.bind(this);
		this.closeConfirmation = this.closeConfirmation.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.props.getTimezones();
		let { profile } = this.props;
		let { roster_processes } = profile;
		let roster_process = roster_processes[0];

		if (!isEmpty(roster_process.pivot.skype)) {
			this.setState({ skype: roster_process.pivot.skype }, () => this.isValid());
		} else if (!isEmpty(this.props.authSkype)) {
			this.setState({ skype: this.props.authSkype }, () => this.isValid());
		} else {
			this.isValid();
		}

		if (!isEmpty(roster_process.pivot.skype_date)) {
			this.setState({ skype_date: moment(roster_process.pivot.skype_date) });
		}

		if (!isEmpty(roster_process.pivot.skype_timezone)) {
			this.setState({
				skype_timezone: {
					value: roster_process.pivot.skype_timezone,
					label: roster_process.pivot.skype_timezone
				}
			});
		}

		if (roster_process.pivot.skype_invitation_done == 1) {
			this.setState({ alreadySent: true });
		}
	}

  /**
   * openConfirmation is a function open confirmation modal
   */
	openConfirmation() {
		this.setState({ open_confirmation: true });
	}

  /**
   * closeConfirmation is a function close confirmation modal
   */
	closeConfirmation() {
		this.setState({ open_confirmation: false, new_step: '', id: '' });
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {*} prevProps
   * @param {*} prevState
   */
	componentDidUpdate(prevProps, prevState) {
		const prevSkype = JSON.stringify(prevState.skype);
		const currentSkype = JSON.stringify(this.state.skype);

		if (prevSkype !== currentSkype) {
			this.isValid();
		}
	}

  /**
   * isValid is a function to check if the 3 heads question form data is valid or not
   */
	isValid() {
		if (isEmpty(this.state.skype)) {
			this.setState({ errors: { skype: 'Skype is required' } });
			return false;
		} else {
			return true;
		}
	}

  /**
   * onChange is a function to handle change of value in the form
   * @param {*} e
   */
	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

  /**
   * dateOnChange is a function to handle change of date for DatePickerField
   * @param {*} e
   */
	dateOnChange(e) {
		this.setState({ [e.target.name]: moment(e.target.value) });
	}

  /**
   * skypeInvitation is a function to send 3 heads questions invitation
   */
	skypeInvitation() {
		if (this.isValid() && this.props.selected_step.has_skype_call == 1) {
			let { skype, skype_date, skype_timezone } = this.state;
			let { selected_step, roster_process, profile } = this.props;
			let { has_skype_call, id, order } = selected_step;
			this.setState({ isLoading: true }, () => {
				axios
					.post('api/roster/skype-call-invitation', {
						roster_process,
						roster_step_id: id,
						has_skype_call: has_skype_call,
						current_step: order,
						profile_id: profile.id,
						skype,
						skype_date: moment(skype_date).format('YYYY-MM-DD HH:mm:ss'),
						skype_timezone: skype_timezone.value
					})
					.then((res) => {
						this.setState({ isLoading: false, alreadySent: true, open_confirmation: false }, () => {
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

	render() {
		const { classes, timezones, profile } = this.props;
		const { skype, skype_date, skype_timezone, errors, isLoading, alreadySent } = this.state;

		return (
      <>
        {this.props.divider}
        <Grid container spacing={16} alignItems="center" className={classes.inviteContainer}>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            <TextField
              required
              id="hr_skype"
              name="skype"
              label="Your Skype ID"
              fullWidth
              autoComplete="skype"
              value={isEmpty(skype) ? '' : skype}
              onChange={this.onChange}
              error={!isEmpty(errors.skype)}
              helperText={errors.skype}
              margin="none"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <SelectField
              label="Timezone"
              options={timezones}
              value={skype_timezone}
              onChange={(value, e) => this.setState({ [e.name]: value })}
              placeholder="Select timezone"
              isMulti={false}
              name="skype_timezone"
              error={isEmpty(skype_timezone) ? 'Timezone is required' : ''}
              required
              fullWidth={true}
              margin="none"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <DatePickerField
              label="Skype Call Date & Time"
              name="skype_date"
              value={skype_date}
              onChange={this.dateOnChange}
              error={errors.skype_date}
              margin="none"
              usingTime={true}
              disablePast={true}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Button
              size="small"
              color="primary"
              fullWidth
              variant="contained"
              className={classes.interviewBtn}
              onClick={this.openConfirmation}
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

              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="secondary" onClick={this.closeConfirmation}>
                  <Close fontSize="small" /> Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.blueIMMAP}
                  onClick={this.skypeInvitation}
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
	addFlashMessage
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
		'margin-bottom': '-4px'
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
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	blueIMMAP: {
		background: blueIMMAP,
		"&:hover": {
		  background: blueIMMAPHover,
		},
		marginLeft: theme.spacing.unit * 1
	  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Skype));
