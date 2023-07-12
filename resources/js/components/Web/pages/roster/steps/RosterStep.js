/** import React, Component and PropTypes */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Send from '@material-ui/icons/Send';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { onChange, getRosterProfile, getRosterProfilesForExport } from '../../../redux/actions/roster/rosterActions';

/** import custom components */
import RosterCard from '../card/RosterCard';
import Pagination from '../../../common/Pagination';
import SendInvitationGroup from '../card/SendInvitationGroup';


/** import permission checker and validation helper */
import isEmpty from '../../../validations/common/isEmpty';
import { can } from '../../../permissions/can';
import { white, blueIMMAPHover, blue } from '../../../config/colors';

/**
 * RosterStep is a component to show the data of roster applicants with it's pagination
 *
 * @name RosterStep
 * @component
 * @category Page
 * @subcategory Roster
 */

 class RosterStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profilesSelected:[],
      openSendInvitation: false
		};
		this.changeProfilesSelected = this.changeProfilesSelected.bind(this);
    this.openSendInvitationsModal = this.openSendInvitationsModal.bind(this);
    this.closeSendInvitationsModal = this.closeSendInvitationsModal.bind(this);
	}

  /**
   * changeProfilesSelected is a function to change array of profile id
   */
  changeProfilesSelected() {
    this.setState({ profilesSelected: this.props.profiles_selected })
  }

   /**
   * openSendInvitationsModal is a function to open Send Invitations Modal
   */
  async openSendInvitationsModal() {
    await this.setState({ openSendInvitation: true })
  }

  /**
   * closeSendInvitationsModal is a function to close Send Invitations Modal
   */
  closeSendInvitationsModal() {
    this.setState({  openSendInvitation: false})
  }

  render() {
  const { toogleShowQuestionDialog, roster_process_id, profileData, getRosterProfile, selected_step, classes, isLoading, showAllRejected, onChange, getStepCount, getRosterProfilesForExport, reloadProfiles } = this.props;
  const { current_page, data, last_page } = profileData;
  const { profilesSelected } = this.state;
  const isAdmin = can('Set as Admin');
 
  return (
    <Grid container spacing={16}>
      {!isEmpty(data) && (
        <>
        <Grid item xs={selected_step.has_skype_call && can('Send Interview Invitation') == 1 ?  6 : 12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => getRosterProfilesForExport()}
            >
             <CloudDownloadIcon className={classes.addMarginRight} /> Download Profiles
					</Button>
        </Grid>
          {(selected_step.has_skype_call == 1 && can('Send Interview Invitation')) && (
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.interviewBtn}
                  fullWidth
                  onClick={this.openSendInvitationsModal}
                  disabled={profilesSelected.length > 0 ? false : true}
                  >
                   <Send className={classes.addMarginRight} /> Send Invitations ({ profilesSelected.length })
                </Button>
            </Grid>
            )}
        </>
        )}
      {(selected_step.set_rejected === 1 || selected_step.set_rejected === '1') && (
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={showAllRejected}
                onChange={async () => {
                  await onChange('isLoading', true)
                  await onChange('showAllRejected', showAllRejected ? false : true )
                  await getRosterProfile('', false)
                  onChange('isLoading', false)
                }}
              />
            }
            label="Show From Past Years"
          />
        </Grid>
      )}
      {isLoading ? (
        <Typography variant="subtitle1" color="primary" className={classes.notFound}>
          Loading Super Human Profiles... <CircularProgress color="primary" size={20} thickness={5} className={classes.loading} disableShrink />
        </Typography>
      ) : !isEmpty(data) ? (
           data.map((profile) => {
              let check = profilesSelected.length > 0  ? !profilesSelected.includes(profile.id) && ( profilesSelected.length == 10 ? true : false) : false;
              return  <RosterCard check={check} changeProfilesSelected={this.changeProfilesSelected} toogleShowQuestionDialog={toogleShowQuestionDialog} roster_process_id={roster_process_id} key={profile.id} isAdmin={isAdmin} getStepCount={getStepCount} profile={profile} currentPage={(data.length > 1 || current_page === 1) ? current_page : current_page - 1} reloadProfiles={reloadProfiles} />
           })
      ) : (
        <Typography variant="subtitle1" color="primary" className={classes.notFound}>No Profile Found</Typography>
      )}

      {(!isEmpty(data) && !isLoading) ? (
        <Grid item xs={12}>
          <Pagination
            currentPage={current_page}
            lastPage={last_page}
            movePage={getRosterProfile}
            onClick={(e, offset) => getRosterProfile(offset)}
          />
        </Grid>
      ) : null}
      <SendInvitationGroup
        openSendInvitation={this.state.openSendInvitation}
        closeSendInvitationsModal={this.closeSendInvitationsModal}
        profiles={profilesSelected}
        reloadProfiles={reloadProfiles}

      />
    </Grid>
  )};
};

RosterStep.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * getRosterProfile is a prop containing redux function to get list of profile based on filter, selected roster process and selected roster step
   */
  getRosterProfile: PropTypes.func.isRequired,
  /**
   * onChange is a prop containing redux function to update data on rosterReducer state
   */
  onChange: PropTypes.func.isRequired,
  /**
   * profileData is a prop containing profile data of the applicant
   */
  profileData: PropTypes.object,
  /**
   * selected_step is a prop containing data of the selected roster step
   */
  selected_step: PropTypes.object,
  /**
   * isLoading is a prop containing boolean value to show loading indicator
   */
  isLoading: PropTypes.bool,
  /**
   * showAllRejected is a prop containing boolean value to show all rejected user or only past year
   */
  showAllRejected: PropTypes.bool,
  /**
   * getStepCount is a prop containing function to get total applicants for each step
   */
  getStepCount: PropTypes.func.isRequired,
  /**
   * getRosterProfilesForExport is a prop containing function to download profiles data of the current selected roster and current step
   */
  getRosterProfilesForExport: PropTypes.func.isRequired,
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
  getRosterProfile,
  getRosterProfilesForExport,
  onChange
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  profileData: state.roster.profileData,
  selected_step: state.roster.selected_step,
  isLoading: state.roster.isLoading,
  showAllRejected: state.roster.showAllRejected,
  profiles_selected: state.roster.profiles_selected
});

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
  addMarginRight: {
    marginRight: '.25em'
  },
  notFound: {
    marginLeft: '.5em',
    narginTop: '.5em'
  },
  loading: {
    display: 'inline-block',
    verticalAlign: 'text-top',
    marginLeft: '0.25em'
  },
  interviewBtn: {
		'background-color': blue,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RosterStep));
