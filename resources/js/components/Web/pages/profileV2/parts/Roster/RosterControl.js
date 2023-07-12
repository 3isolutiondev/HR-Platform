/** import React, PropTypes and classname */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Star from '@material-ui/icons/Star';
import Timeline from '@material-ui/icons/Timeline';
import History from '@material-ui/icons/History';
import Grid from '@material-ui/core/Grid';

/** import custom components needed for this component */
import RosterConfirmationModal from './RosterConfirmation';
import RosterProcess from '../../../profile/Roster/RosterProcess';
import SelectField from '../../../../common/formFields/SelectField';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import {
  getRosterProcessData,
	getRosterProcess,
	getCurrentRosterProcess,
	setStatus,
	applyRoster,
} from '../../../../redux/actions/profile/rosterProcessActions';
import { postAPI }  from '../../../../redux/actions/apiActions';

/** import configuration value and validation helper */
import { secondaryColor, white } from '../../../../config/colors';
import isEmpty from '../../../../validations/common/isEmpty';

/**
 * RosterControl is a component to show Roster Recruitment Status for every profile
 *
 * @name RosterControl
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class RosterControl extends Component {
	constructor(props) {
		super(props);
		this.state= {
			showDialog: false,
			roster_invitation : null,
			no_roster_invitation: false,
		}
		this.showApplyRosterDialog = this.showApplyRosterDialog.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.props.getRosterProcessData(this.props.rosterProcessID);
		this.props.getCurrentRosterProcess();
		if(this.props.isFromUrl) {
			this.props.postAPI('/api/profile/check-roster-invitation', {roster_process_id: this.props.rosterProcessID}).then((data) => {
			 this.setState({roster_invitation: data.data})
			}).catch((error) => {
				this.setState({no_roster_invitation: true})
			});
		}
	}

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
	componentDidUpdate(prevProps) {
		if (this.props.rosterProcessID !== prevProps.rosterProcessID || this.props.profileID !== prevProps.profileID) {
			this.props.getRosterProcessData(this.props.rosterProcessID);
			this.props.getCurrentRosterProcess();
		}
	}

   /**
   * showApplyRosterDialog is a function that sets the showDialog flag to true
   */
	showApplyRosterDialog() {
		this.setState({
			showDialog: true
		})
	}

	render() {
		const {
			classes,
			profileID,
			rosterProcessID,
			profile_roster_process_data,
			profile_roster_process,
			status,
			applyRoster,
		} = this.props;

		let isAccepted = false;
		let isRejected = false;
		if (!isEmpty(profile_roster_process)) {
			for (var i = 0; i < profile_roster_process.length; i++) {
				let profRosProc = profile_roster_process[i];
				if (profRosProc.id == rosterProcessID && profRosProc.pivot.is_completed == 1) {
					isAccepted = true;
					break;
				}
				if (profRosProc.id == rosterProcessID && profRosProc.pivot.is_rejected == 1) {
					isRejected = true;
				} else if(profRosProc.id == rosterProcessID && profRosProc.pivot.is_rejected != 1) {
					isRejected = false;
				}
			}
		}
	
    let chosenRoster = this.props.rosterAccessData.find(val => val.value === this.props.tabValueRoster);
	let rosterOptions = [];
    if (isEmpty(chosenRoster)) {
		if(this.props.rosterAccessData.length > 0 && !this.props.isFromUrl) {
			this.props.changeRoster(null, this.props.rosterAccessData[0]['value'])
			chosenRoster = this.props.rosterAccessData[0];
		} else {
			if(this.state.no_roster_invitation && this.props.isFromUrl) window.location = '/';
			if(status !== 'about' && this.props.isFromUrl && this.state.roster_invitation) {
				this.props.setStatus('about');
			}
			rosterOptions = [{value: rosterProcessID, label: profile_roster_process_data.name}]
		}
    } else if(isRejected && this.props.isFromUrl) {
		if(this.state.no_roster_invitation && this.props.isFromUrl) window.location = '/';
		if(status !== 'about' && this.props.isFromUrl && this.state.roster_invitation) {
			this.props.setStatus('about');
		}
	} else if(this.props.isFromUrl) {
		window.location = '/profile?roster='+rosterProcessID
	}


		return (
			<Grid container spacing={16}>
				<Grid item xs={12} sm={4} md={3} >
          <SelectField
            label="Choose Roster Recruitment Process"
            options={this.props.rosterAccessData.length ? this.props.rosterAccessData : rosterOptions}
            value={chosenRoster || rosterOptions[0]}
            onChange={(value, e) => this.props.changeRoster(e, value.value)}
            placeholder="Choose Roster Recruitment Process"
            isMulti={false}
            name="roster"
            fullWidth={true}
			isDisabled={this.props.isFromUrl}
            margin="none"
          />

					<Paper className={classes.box}>
						<List component="nav" disablePadding={true}>
							<ListItem
								button
								selected={status === 'about'}
								onClick={() => this.props.setStatus('about')}
							>
								<ListItemIcon className={classes.noMarginRight}>
									<Star />
								</ListItemIcon>
								<ListItemText primary={'About ' + profile_roster_process_data.name} />
							</ListItem>
							{this.props.isFromUrl ? null :
							<>
							<ListItem
								button
								selected={status === 'current'}
								onClick={() => this.props.setStatus('current')}
							>
								<ListItemIcon className={classes.noMarginRight}>
									<Timeline />
								</ListItemIcon>
								<ListItemText primary="Current Status" />
							</ListItem>
							<ListItem
								button
								selected={status === 'history'}
								onClick={() => this.props.setStatus('history')}
							>
								<ListItemIcon className={classes.noMarginRight}>
									<History />
								</ListItemIcon>
								<ListItemText primary="History" />
							</ListItem>
							</>
							}
						</List>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={8} md={9}>
					<RosterProcess isAccepted={isAccepted} showApplyRosterDialog={this.showApplyRosterDialog}  showApplyBtn={(isEmpty(chosenRoster) || isRejected) && this.props.isFromUrl && this.state.roster_invitation} />
				</Grid>
				{this.state.showDialog ?
        <RosterConfirmationModal
          open={this.state.showDialog}
          rosterTitle={profile_roster_process_data.name}
          rosterPopUpText={`Are you sure you want to apply to ${profile_roster_process_data.name}?`}
		  handleClose={()=>{this.setState({showDialog: false})}}
	      handleConfirm={()=>{applyRoster(profile_roster_process_data.name, true)}} /> : null}
			</Grid>
		);
	}
}

RosterControl.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * profileID is a prop containing profile id, if it's a number will show other people profile, otherwise it will show the logged in user profile.
   */
  profileID: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string // empty string
  ]).isRequired,
  /**
   * rosterProcessID is a prop containing the id of selected/current roster process
   */
  rosterProcessID: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string // empty string
  ]).isRequired,
  /**
   * profile_roster_process_data is a prop containing data of the selected roster process
   */
  profile_roster_process_data: PropTypes.object.isRequired,
  /**
   * profile_roster_process is a prop containing data about all Roster Process recruitment data that the user applied for
   */
  profile_roster_process: PropTypes.array.isRequired,
  /**
   * status is a prop containing value that holding data about the left menu navigation
   */
  status: PropTypes.oneOf(['about', 'current', 'history']).isRequired,
  /**
   * archived_user is a prop containing value that holding data about the profile. Is the profile is an archived user or not?
   */
  archived_user: PropTypes.oneOf(['yes', 'no']).isRequired,
  /**
   * getRosterProcessData is a prop function to call api to get the data of the selected roster process
   */
  getRosterProcessData: PropTypes.func.isRequired,
  /**
   * getRosterProcess is a prop function to call api to get all Roster Process recruitment data that the user applied for
   */
	getRosterProcess: PropTypes.func.isRequired,
  /**
   * getCurrentRosterProcess is a prop function to call an api to Get Specific Roster Process that the user applied in on process status
   */
	getCurrentRosterProcess: PropTypes.func.isRequired,
  /**
   * setStatus is a prop function to change the left navigation menu data and retrieve the content based on the menu selected
   */
	setStatus: PropTypes.func.isRequired,
  /**
   * applyRoster is a prop function to call an api to apply to the selected roster process
   */
	applyRoster: PropTypes.func.isRequired,
  /**
   * tabValueRoster is a prop containing selected roster value
   */
  tabValueRoster: PropTypes.number.isRequired,
  /**
   * changeRoster is a prop containing function to select another roster process status
   */
  changeRoster: PropTypes.func.isRequired,
  /**
   * rosterAccessData is a prop containing data of roster recruitment
   */
  rosterAccessData: PropTypes.array.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getRosterProcess,
	getRosterProcessData,
	setStatus,
	applyRoster,
	getCurrentRosterProcess,
	postAPI
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	profile_roster_process_data: state.profileRosterProcess.profile_roster_process_data,
	status: state.profileRosterProcess.status,
	rosterProcessID: state.profileRosterProcess.rosterProcessID,
	profile_roster_process: state.profileRosterProcess.profile_roster_process
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	box: {
		borderRadius: 0,
		marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2
	},
	tab: {
		borderBottom: '1px solid ' + secondaryColor,
		marginBottom: theme.spacing.unit
	},
	addSmallMarginBottom: {
		marginBottom: theme.spacing.unit
	},
	addMarginBottom: {
		marginBottom: theme.spacing.unit * 2
	},
	noMarginRight: {
		marginRight: 0
	},
	white: {
		color: white
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RosterControl));
