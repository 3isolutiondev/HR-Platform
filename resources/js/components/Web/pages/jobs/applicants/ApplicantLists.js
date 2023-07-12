/** import React, PropTypes and Moments */
import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from 'moment';

/** import Material UI components */
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { withStyles } from '@material-ui/core/styles';
import QuestionIcon from '@material-ui/icons/ViewListOutlined'

/** import React Redux and it's actions */
import { connect } from "react-redux";
import {
  getApplicantProfiles,
  openCloseProfile,
  openCloseRequestContractForm,
  closeOpenAvailability,
  getJobProfilesForExport
} from "../../../redux/actions/jobs/applicantActions";
import {
  getImmapers,
  getTimezones,
  getImmapOffices
} from "../../../redux/actions/optionActions";

/** import validation checker */
import isEmpty from "../../../validations/common/isEmpty";

/** import custom components */
import ApplicantCard from "./ApplicantCard";
import ApplicantCardHistory from "./ApplicantCardHistory";
import ProfileModal from "../../../common/ProfileModal";
import RequestContractModal from "../../../common/RequestContractModal";
import JobQuestionDialog from '../JobQuestionDialog';

import {
	blueIMMAP,
	white,
} from '../../../config/colors';

/**
 * This is Applicant Lists Component, it show list of applicants. URL: http://localhost:8000/jobs/{id}/applicants
 */
class ApplicantLists extends Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.state = {
      selectedJobID: 0,
    }
    this.setSelectedJobID = this.setSelectedJobID.bind(this);
  }

  setSelectedJobID(jobID) {
    this.setState({ selectedJobID: jobID });
  }

  componentDidMount() {
    if (!isEmpty(this.props.job_id)) {
      this.props.getApplicantProfiles();
    }
    this.props.getImmapers(true);
    this.props.getTimezones();
    this.props.getImmapOffices();

  }

  componentDidUpdate(prevProps) {
    const currentJobId = this.props.job_id;
    const prevJobId = prevProps.job_id;

    if (currentJobId != prevJobId) {
      this.props.getApplicantProfiles();
    }
  }

  /**
   * Get list of applicant profiles
   */
  loadData() {
    this.props.getApplicantProfiles("true", this.props.current_page + 1);
  }

  render() {
    const {
      profiles,
      moveduser,
      isManager,
      selected_profile_id,
      openProfile,
      openRequestContract,
      openCloseProfile,
      openCloseRequestContractForm,
      job_title,
      getSteps,
      job_managers,
      openAvailability,
      show_start_date_availability,
      show_departing_from,
      show_full_name,
      closeOpenAvailability,
      getJobProfilesForExport,
      classes,
      job_status,
      jobStatusTab,
      job_standard_under_sbp_program,
      useTestStep,
      showApplicantTestLinkAndScore,
      isTestStep,
      testStepPosition
    } = this.props;

    const isInterview = (job_status[jobStatusTab] && job_status[jobStatusTab]['is_interview'] == 1 && !job_standard_under_sbp_program) ? true : false;

    const showInterviewFiles = profiles.find(user => user.user_interview_files.length > 0) ? true : false;
    return (
      <Grid container spacing={8}>
        {this.state.selectedJobID > 0 && <JobQuestionDialog reloadProfiles={this.props.reloadQuestions} setSelectedJobID={this.setSelectedJobID} jobID={this.state.selectedJobID} />}

        {!isEmpty(profiles) && (
            <Grid item xs={12} md={!showInterviewFiles && isInterview ? 6 : 12} >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => getJobProfilesForExport(job_title)}
                >
                <CloudDownloadIcon className={classes.addMarginRight} /> Download Profiles
              </Button>
          </Grid>
         )}
          {!showInterviewFiles && isInterview && !isEmpty(profiles) && <Grid item xs={12} md={!isEmpty(profiles) ? 6 : 12}>
              <Button
                variant="contained"
                color="default"
                fullWidth
                onClick={() => this.setSelectedJobID(this.props.job_id)}
                className={classes.blueIMMAP}
                >
                <QuestionIcon className={classes.addMarginRight} /> View Interview questions
              </Button>
          </Grid>}
        <Grid item xs={12}>
          {!isEmpty(profiles) ?
            profiles.map((user) => (
              <ApplicantCard
                key={"applicant-card-" + user.id}
                user={user}
                isManager={isManager}
                include_cover_letter={this.props.include_cover_letter}
                job_title={job_title}
                getSteps={getSteps}
                job_managers={job_managers}
                showInterviewFiles={showInterviewFiles}
                interview_order={user.job_user[0].job.interview_order}
                reloadProfiles={this.props.reloadQuestions}
                job_status={job_status}
                useTestStep={useTestStep}
                showApplicantTestLinkAndScore={showApplicantTestLinkAndScore}
                isTestStep={isTestStep}
                testStepPosition={testStepPosition}
              />
            )) : null
          // </InfiniteScroll>
          }

        {!isEmpty(moveduser) ?
            moveduser.map((user) => (
              <ApplicantCardHistory
                key={"applicant-card-history" + user.id}
                user={user}
                job_status={job_status}
                useTestStep={useTestStep}
                showApplicantTestLinkAndScore={showApplicantTestLinkAndScore}
                isTestStep={isTestStep}
                testStepPosition={testStepPosition}
              />
            )): null}

        </Grid>
        <ProfileModal
          isOpen={openProfile}
          profileId={selected_profile_id}
          onClose={openCloseProfile}
        />
        {openRequestContract ?
          <RequestContractModal
            isOpen={openRequestContract}
            onClose={openCloseRequestContractForm}
            immaper={null}
            defaultRequest={'new-contract'}
          />
          : null}
        <Dialog open={openAvailability} onClose={closeOpenAvailability} maxWidth="md" fullWidth>
          <DialogTitle
            disableTypography={true}
            children={
              <Typography color="primary" variant="h6">
                <b>{show_full_name} availability & current location :</b>
              </Typography>
            }
          />
          <DialogContent>
            <Grid container spacing={8}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Availability: <b>{
                  isEmpty(show_start_date_availability) ? '-' :
                  moment(show_start_date_availability).format('DD MMMM YYYY')}</b>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Current Location: <b>{isEmpty(show_departing_from) ? '-' : show_departing_from}</b></Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeOpenAvailability}
              color="secondary"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </Grid>
    );
  }
}

ApplicantLists.defaultProps = {
  openProfile: false,
  openRequestContract: false,
  profiles: []
}

ApplicantLists.propTypes = {
  /** "profiles" prop: contain list of profiles [Array] */
  profiles: PropTypes.array.isRequired,
  /** "job_id" prop: job id of current page [String|Number] */
  job_id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /** "openProfile" prop: open or close profile modal [Boolean] */
  openProfile: PropTypes.bool.isRequired,
  /** "openRequestContract" prop: open or close request contract modal [Boolean] */
  openRequestContract: PropTypes.bool,
  /** "selected_profile_id" prop: selected profile id will be used when opening profile modal [String|Number] */
  selected_profile_id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /** "current_page" prop: current page for calling api [Number] */
  current_page: PropTypes.number,
  /** "last_page" prop: last page for calling api [Number] */
  last_page: PropTypes.number,
  /** "moveduser" prop: contain people who did the last moved of the applicant status [Array] */
  moveduser: PropTypes.array,
  /** "isManager" prop: contain data if the logged in user is Manager for this job (to see comment inside Applicant Card) [Boolean] */
  isManager: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  /** openAvailability is a prop containing value to open availability and current location modal */
  openAvailability: PropTypes.bool.isRequired,
  /** show_start_date_availability is a prop containing value of applicant starting date availability */
  show_start_date_availability: PropTypes.string,
  /** show_departing_from is a prop containing value of applicant departing from */
  show_departing_from: PropTypes.string,
  /** show_full_name is a prop containing value of applicant full name that to be shown on availability and current location modal */
  show_full_name: PropTypes.string,

  /** "getApplicantProfiles" prop: function to call applicant profiles api [Function] */
  getApplicantProfiles: PropTypes.func.isRequired,
  /** "openCloseProfile" prop: function to open or close Profile Modal [Function] */
  openCloseProfile: PropTypes.func.isRequired,
  /** "openCloseProfile" prop: function to open or close Request Contract Modal [Function] */
  openCloseRequestContractForm: PropTypes.func.isRequired,
  /** "getImmapers" prop: function to get list of immapers [Function] */
  getImmapers: PropTypes.func.isRequired,
  /** "getTimezones" prop: function to get list of timezones [Function] */
  getTimezones: PropTypes.func.isRequired,
  /** closeOpenAvailability is a prop containing function to open or close availability and current location modal */
  closeOpenAvailability: PropTypes.func.isRequired,
  /* classes is a prop containing styles for this component generated by material-ui v3 */
  classes: PropTypes.object.isRequired,
   /** "getImmapOffices" prop: function to get list of immap Office [Function] */
   getImmapOffices: PropTypes.func.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getApplicantProfiles,
  openCloseRequestContractForm,
  openCloseProfile,
  getImmapers,
  getTimezones,
  closeOpenAvailability,
  getJobProfilesForExport,
  getImmapOffices
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  profiles: state.applicant_lists.profiles,
  job_id: state.applicant_lists.job_id,
  openProfile: state.applicant_lists.openProfile,
  openRequestContract: state.applicant_lists.openRequestContract,
  selected_profile_id: state.applicant_lists.selected_profile_id,
  current_page: state.applicant_lists.current_page,
  last_page: state.applicant_lists.last_page,
  moveduser: state.applicant_lists.moveduser,
  isManager: state.applicant_lists.isManager,
  openAvailability: state.applicant_lists.openAvailability,
  show_start_date_availability: state.applicant_lists.show_start_date_availability,
  show_departing_from: state.applicant_lists.show_departing_from,
  show_full_name: state.applicant_lists.show_full_name,
  job_standard_under_sbp_program: state.applicant_lists.job_standard_under_sbp_program,
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
  blueIMMAP: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': '#005A9B'
		}
	},
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ApplicantLists));
