/** import React, PropTypes and React Helmet */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Fab from '@material-ui/core/Fab';
import FilterListIcon from '@material-ui/icons/FilterList';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI } from '../../../redux/actions/apiActions';
import { getJobStatus, getHQ } from '../../../redux/actions/optionActions';
import { tabChange, onChange, getApplicantProfiles } from '../../../redux/actions/jobs/applicantActions';
import { addFlashMessage } from '../../../redux/actions/webActions'
import { resetFilter } from '../../../redux/actions/hr/hrFilterActions';
import { onChangeRequestContract } from '../../../redux/actions/jobs/requestContractActions'

/** import custom components */
import HRFilter from '../../../common/HR/HRFilter';
import ApplicantLists from './ApplicantLists';

/** import configuration value, validation helper and permission checker */
import { primaryColor, white } from '../../../config/colors';
import { APP_NAME } from '../../../config/general';
import isEmpty from '../../../validations/common/isEmpty';
import { pluck, checkUserIsHiringManager } from '../../../utils/helper';
import { can } from '../../../permissions/can';

/** Applicants Component, Component that show applicants page, it contains filter and applicant lists. URL: http://localhost:8000/jobs/{id}/applicants */
class Applicants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job_title: '',
      country: '',
      filterMobile: false,
      include_cover_letter: false,
      jobStatusCompleted: false,
      popUpStatus: false,
      changeStatusLoading: false,
      statusCount: [],
      useTestStep: 0,
      testStepPosition: ''
    };

    this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
    this.getSteps = this.getSteps.bind(this);
    this.reloadQuestions = this.reloadQuestions.bind(this);
  }

  /**
   * componentWillMount is a lifecycle function called where the component will be mounted
   */
  componentWillMount() {
    this.props.resetFilter()
  }

  /**
   * getSteps is a function to get total applicant number for each steps
   */
  getSteps(){
    this.props.getAPI('/api/jobs/' + this.props.match.params.id+'/applicants/count').then((res) => {
      this.setState({statusCount: res.data.data});
    }).catch((err) => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'There is an error while getting the job data'
      });
    });
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {

    this.props.getHQ();
    this.props.getAPI('/api/jobs/' + this.props.match.params.id).then((res) => {
      const exclude_immaper = isEmpty(res.data.data.exclude_immaper)
        ? false
        : pluck(JSON.parse(res.data.data.exclude_immaper), 'value').includes(this.props.immap_email);
      if (exclude_immaper ||
        (!checkUserIsHiringManager(this.props.user, res.data.data) && !can('Set as Admin') && res.data.data.tor.job_standard.under_sbp_program === "no") ||
        (!can('View SBP Job') && res.data.data.tor.job_standard.under_sbp_program === "yes"))
      {
        this.props.history.push('/jobs');
      } else {
        this.setState({
          job_title: res.data.data.title,
          country: res.data.data.country.name,
          include_cover_letter: res.data.data.include_cover_letter == 1 ? true : false,
          jobStatusCompleted: res.data.data.status == 2 ? true : false,
          job_managers: res.data.data.job_manager,
          interview_questions: res.data.data.interview_questions,
          useTestStep: res.data.data.use_test_step,
          testStepPosition: res.data.data.test_step_position
        });
        const job_standard_under_sbp_program = res.data.data.tor.job_standard.under_sbp_program === "yes" ? true : false
        this.props.getJobStatus(job_standard_under_sbp_program);
        this.props.onChange('job_standard_under_sbp_program', job_standard_under_sbp_program)
        this.getSteps();

        this.props.getJobStatus(res.data.data.tor.job_standard.under_sbp_program === "yes" ? true : false);
        this.getSteps();

        // for redux Request Contract
        this.props.onChangeRequestContract('job_title', res.data.data.title)
        this.props.onChangeRequestContract('job_id', res.data.data.id)
        this.props.onChangeRequestContract('contract_start', res.data.data.contract_start)
        this.props.onChangeRequestContract('contract_end', res.data.data.contract_end)
        this.props.onChangeRequestContract('home_based', res.data.data.country.name === "Home Based" ? 0 : 1)
        this.props.onChangeRequestContract('immap_office_id', res.data.data.immap_office_id)

        this.props.onChange('job_id', this.props.match.params.id);
        this.props.onChange('filterFor', 'applicant');
      }
    }).catch((err) => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'There is an error while getting the job data'
      });

      this.props.getJobStatus();
      this.getSteps();
    });

    this.props.tabChange('', 0);
  }

  reloadQuestions() {
    this.props.getAPI('/api/jobs/' + this.props.match.params.id).then((res) => {
      const exclude_immaper = isEmpty(res.data.data.exclude_immaper)
        ? false
        : pluck(JSON.parse(res.data.data.exclude_immaper), 'value').includes(this.props.immap_email);
      if (exclude_immaper ||
        (!checkUserIsHiringManager(this.props.user, res.data.data) && !can('Set as Admin') && res.data.data.tor.job_standard.under_sbp_program === "no") ||
        (!can('View SBP Job') && res.data.data.tor.job_standard.under_sbp_program === "yes"))
      {
        this.props.history.push('/jobs');
      } else {
        this.setState({
          job_title: res.data.data.title,
          country: res.data.data.country.name,
          include_cover_letter: res.data.data.include_cover_letter == 1 ? true : false,
          jobStatusCompleted: res.data.data.status == 2 ? true : false,
          job_managers: res.data.data.job_manager,
          interview_questions: res.data.data.interview_questions
        });
        const job_standard_under_sbp_program = res.data.data.tor.job_standard.under_sbp_program === "yes" ? true : false
        this.props.getJobStatus(job_standard_under_sbp_program);
        this.props.onChange('job_standard_under_sbp_program', job_standard_under_sbp_program)
        this.getSteps();

        this.props.getJobStatus(res.data.data.tor.job_standard.under_sbp_program === "yes" ? true : false);
        this.getSteps();

        // for redux Request Contract
        this.props.onChangeRequestContract('job_title', res.data.data.title)
        this.props.onChangeRequestContract('job_id', res.data.data.id)
        this.props.onChangeRequestContract('contract_start', res.data.data.contract_start)
        this.props.onChangeRequestContract('contract_end', res.data.data.contract_end)
        this.props.onChangeRequestContract('home_based', res.data.data.country.name === "Home Based" ? 0 : 1)

        this.props.onChange('job_id', this.props.match.params.id);
        this.props.onChange('filterFor', 'applicant');
      }
    }).catch((err) => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'There is an error while getting the job data'
      })
    });
    
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
  componentDidUpdate(prevProps) {
    const currentJobStatus = JSON.stringify(this.props.job_status);
    const prevJobStatus = JSON.stringify(prevProps.job_status);
    const currentJobStatusTab = JSON.stringify(this.props.jobStatusTab);
    const prevJobStatusTab = JSON.stringify(prevProps.jobStatusTab);

    if (currentJobStatusTab !== prevJobStatusTab || currentJobStatus !== prevJobStatus) {
      this.props.getApplicantProfiles();
    }
  }

  /** Function to Open and Close Filter in Mobile Mode */
  toggleFilterMobile() {
    this.setState({ filterMobile: this.state.filterMobile ? false : true });
  }

  render() {
    const { job_title, country, filterMobile, include_cover_letter, statusCount, job_managers = [], interview_questions = [], testStepPosition, useTestStep } = this.state;
    const { jobStatusTab, tabChange, classes, width } = this.props;
    let { job_status } =  this.props;
    const managerWithQuestions = job_managers.map(j => ({...j, interview_questions: interview_questions.filter(iq => iq.user_id === j.user_id)}));

    if (useTestStep == '1') {
      if (testStepPosition == 'after') {
        job_status = job_status.filter((status) =>{
          return status.set_as_first_test != 1;
        });
      } else if (testStepPosition == 'before') {
        job_status = job_status.filter((status) =>{
          return status.set_as_second_test != 1;
        });
      }
    } else {
      job_status = job_status.filter((status) =>{
        return status.set_as_test != 1;
      });
    }

    let testStepIndex = null;
    job_status.map((status, index) =>{
      if (status.set_as_test == 1) {
         if ( status.set_as_second_test == 1 || status.set_as_first_test == 1) {
          testStepIndex = index;
         }
      }
    });
   
    this.props.onChange('job_status', job_status);
    let showApplicantTestLinkAndScore = testStepIndex != null ? jobStatusTab >= testStepIndex : false;
    let isTestStep = testStepIndex == jobStatusTab;
    
    return (
      <Grid container spacing={16}>
        <Helmet>
          <title>
            {APP_NAME} - Job {'>'} {job_title} - {country} {'>'} View Applicant
					</title>
          <meta
            name="description"
            content={APP_NAME + ' Job > ' + job_title + ' - ' + country + ' > View Applicant'}
          />
        </Helmet>
        <Grid item xs={12}>
          <Typography variant="h5">
            List Applicant for {job_title} - {country}
          </Typography>
        </Grid>
        {(width != 'sm' &&
          width != 'xs') ? (
            <Grid item xs={12} sm={12} md={4} lg={3}>
              <HRFilter filterFor="applicant" />
            </Grid>
          ) : null}
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={9}
          className={width == 'sm' || width == 'xs' ? classes.jobListContainer : classes.normal}
        >
          <Tabs
            value={jobStatusTab}
            onChange={tabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {!isEmpty(job_status) ? job_status.map((status, index) => {
              return <Tab key={index + '-' + status.value} label={`${status.label} (${statusCount.find(s => s.status === status.value) ? (statusCount.find(s => s.status === status.value)).count : 0})`} />;
            }):null}
          </Tabs>
          <ApplicantLists  showApplicantTestLinkAndScore={showApplicantTestLinkAndScore} useTestStep={useTestStep} isTestStep={isTestStep} testStepPosition={testStepPosition} reloadQuestions={this.reloadQuestions} job_status={job_status} jobStatusTab={jobStatusTab} job_managers={managerWithQuestions} getSteps={this.getSteps} include_cover_letter={include_cover_letter} job_title={job_title} />
        </Grid>
        {(width == 'sm' || width == 'xs') ? (
          <Fab
            variant="extended"
            color="primary"
            aria-label="Delete"
            className={classes.filterBtn}
            onClick={this.toggleFilterMobile}
          >
            <FilterListIcon  className={classes.extendedIcon} />
						Filter
          </Fab>
        ) : null}
        {(width == 'sm' || width == 'xs') ? (
          <Drawer
            variant="persistent"
            anchor="bottom"
            open={filterMobile}
            classes={{
              paper: filterMobile ? classes.filterDrawer : classes.filterDrawerHide
            }}
          >
            <div className={classes.mobileFilter}>
              <HRFilter  />
            </div>
          </Drawer>
        ) : null}
      </Grid>
    );
  }
}

Applicants.propTypes = {
  /** "classes" prop: material ui styles define for this component */
  classes: PropTypes.object.isRequired,
  /** "job_status" prop: contain all tab values in Array of object format [{value: 0, 'All Jobs'}, {value:1, 'My Recruitments'}] */
  job_status: PropTypes.array,
  /** "jobStatusTab" prop: contain selected tab value in number format */
  jobStatusTab: PropTypes.number,
  /** "filterFor" prop: contain value 'applicant' or 'roster', it will be used for HRFilter component to determined the filter for applicant page or roster page */
  filterFor: PropTypes.string,
  /** "immap_email" prop: contain value of immap_email for logged in user */
  immap_email: PropTypes.string,

  /** "getAPI" prop: function to call get api */
  getAPI: PropTypes.func.isRequired,
  /** "getJobStatus" prop: function to call all of job status data api */
  getJobStatus: PropTypes.func.isRequired,
  /** "getHQ" prop: function to call all of hq data api */
  getHQ: PropTypes.func.isRequired,
  /** "tabChange" prop: function to change selected job status in tab */
  tabChange: PropTypes.func.isRequired,
  /** "onChange" prop: function to change data on applicantReducer (job_id and filterFor) */
  onChange: PropTypes.func.isRequired,
  /** "getApplicantProfiles" prop: function to get all of applicants profile */
  getApplicantProfiles: PropTypes.func.isRequired,
  /** "resetFilter" prop: function to reset filter */
  resetFilter: PropTypes.func.isRequired,
  /** "onChangeRequestContract" prop: function to change data in requestContractReducer  */
  onChangeRequestContract: PropTypes.func.isRequired,
  /** "addFlashMessage" prop: function to show flash message on the top of the page  */
  addFlashMessage: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  getJobStatus,
  getHQ,
  tabChange,
  onChange,
  getApplicantProfiles,
  resetFilter,
  onChangeRequestContract,
  addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  job_status: state.options.job_status,
  jobStatusTab: state.applicant_lists.jobStatusTab,
  filterFor: state.filter.filterFor,
  user: !isEmpty(state.auth.user) ? state.auth.user : '',
  immap_email: !isEmpty(state.auth.user) ? state.auth.user.data.immap_email : ''
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  filterBtn: {
    margin: theme.spacing.unit,
    position: 'fixed',
    zIndex: 9999999,
    bottom: theme.spacing.unit * 6,
    left: '49%',
    transform: 'translateX(-51%)',
    color: primaryColor + ' !important',
    'background-color': white + ' !important',
    border: `1px solid ${primaryColor} !important`
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  jobListContainer: {
    marginBottom: theme.spacing.unit * 6
  },
  filterDrawer: {
    height: '100%',
    'padding-left': theme.spacing.unit * 3,
    'padding-right': theme.spacing.unit * 3
  },
  filterDrawerHide: {
    bottom: 'auto'
  },
  mobileFilter: {
    height: '100%',
    'margin-top': theme.spacing.unit
  },
  normal: {},
  loading: {
    'margin-left': theme.spacing.unit,
    'margin-right': theme.spacing.unit,
    color: white
  },
});

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Applicants)));
