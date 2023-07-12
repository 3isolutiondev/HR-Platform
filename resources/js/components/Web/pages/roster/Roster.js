/** import React, React.Component, React Helmet, React Loadable and PropTypes*/
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';

/** import Material UI withStyles, withWidth, components and icons */
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

/** import Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { getRosterProcess, getAuthSkype } from '../../redux/actions/optionActions';
import {
  rosterProcessOnChange,
  filterForChange,
  getRosterStatistics,
  getRosterProfile,
  toggleRosterCampaign,
  getOpenRosterCampaignData,
  onChange
} from '../../redux/actions/roster/rosterActions';

/** import configuration value and validation helper */
import { APP_NAME } from '../../config/general';
import { primaryColor, white } from '../../config/colors';
import { quarter, campaignYears } from '../../config/options';
import { pluck } from '../../utils/helper';
import isEmpty from '../../validations/common/isEmpty';

/** import third party package */
import queryString from "query-string";

/** import custom components */
import LoadingSpinner from '../../common/LoadingSpinner';
import SelectField from '../../common/formFields/SelectField';
import JobQuestionDialog from '../jobs/JobQuestionDialog';

const HRFilter = Loadable({
  loader: () => import('../../common/HR/HRFilter'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const RosterLists = Loadable({
  loader: () => import('./RosterLists'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

/**
 * Roster is a component to show Roster page
 *
 * @name Roster
 * @component
 * @category Page
 */
class Roster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiURL: '/api/roster',
      tabStatus: 'all',
      isFilter: false,
      filterData: {},
      filterMobile: false,
      stepCount: [],
      years: [],
      nextCampaignModal: false,
      campaignIsOpen: false,
      showQuestionDialog: false,
      rosterProfileID: null
    };

    this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
    this.getStepCount = this.getStepCount.bind(this);
    this.toggleCampaignModal = this.toggleCampaignModal.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.toogleShowQuestionDialog = this.toogleShowQuestionDialog.bind(this);
    this.reloadProfiles = this.reloadProfiles.bind(this);
  }

  /**
   * toogleShowQuestionDialog is a function that toogles the value og showQuestionDialog
   */
  toogleShowQuestionDialog(rosterProfileID) {
    this.setState({
      showQuestionDialog: !this.state.showQuestionDialog,
      rosterProfileID
    })
  }

  /**
   * getStepCount is a function to get the count of user in each roster step
   * @param {object} rosterProcess
   */
  getStepCount(rosterProcess){
    this.props.getAPI(`/api/roster/${rosterProcess.value}/count`).then((res) => {
			this.setState({stepCount: res.data.data})
    }).catch((err) => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'There is an error while getting the roster applicant number'
      });
    });
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  async componentDidMount()  {
    this.props.getRosterProcess();
    this.props.filterForChange();
    this.props.getAuthSkype();

    let queryParams = queryString.parse(this.props.location.search);

     if (!isEmpty(queryParams.skillset) && queryParams.skillset != undefined) {
        const result = this.props.roster_processes.find(element => {
          return element.skillset == queryParams.skillset;
      });

      if (!isEmpty(result)) {
       this.props.rosterProcessOnChange('roster_process', result)
       await this.props.onChange('roster_process', result);

      }
     }

    if (!isEmpty(this.props.roster_process)) {
      this.props.getOpenRosterCampaignData();
      this.getStepCount(this.props.roster_process);
      if (!isEmpty(this.props.selected_page)) {
        this.props.getRosterProfile(this.props.selected_page);
      } else {
        this.props.getRosterProfile(1);
      }
    }
    this.setState({ years: campaignYears() });
  }

  reloadProfiles() {
    if (!isEmpty(this.props.selected_page)) {
      this.props.getRosterProfile(this.props.selected_page);
    } else {
      this.props.getRosterProfile(1);
    }
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   * @param {object} prevState - previous state data
   */
  componentDidUpdate(prevProps, prevState) {
    if (((this.props.campaign_open_at_quarter !== prevProps.campaign_open_at_quarter ||
      this.props.campaign_open_at_year !== prevProps.campaign_open_at_year) &&
      this.props.campaign_is_open === "yes" && this.state.campaignIsOpen === false) ||
      this.state.campaignIsOpen !== prevState.campaignIsOpen
    ) {
      this.checkValid();
    }
  }

  /** checkValid is a function to check if the data is valid before opening/closing roster campaign */
  checkValid() {
    let errors = {}
    if (this.state.campaignIsOpen === false) {
      if (isEmpty(this.props.campaign_open_at_quarter)) {
        errors.campaign_open_at_quarter = `"Next Opening Schedule (Quarter)" is required`;
      } else {
        const checkValidQuarter = quarter.find(value => value.value === this.props.campaign_open_at_quarter);
        if (!checkValidQuarter) {
          errors.campaign_open_at_quarter = `Invalid "Next Opening Schedule (Quarter)" data`
        }
      }
      if (isEmpty(this.props.campaign_open_at_year)) {
        errors.campaign_open_at_year = `"Next Opening Schedule (Year)" is required`;
      } else {
        const years = campaignYears();
        const checkValidYear =  years.find(value => value.value.toString() === this.props.campaign_open_at_year.toString());
        if (!checkValidYear) {
          errors.campaign_open_at_year = `Invalid "Next Opening Schedule (Year)" data`
        }
      }
    }

    this.props.onChange('errors', errors);

    return !isEmpty(errors) ? false : true;
  }

  /**
   * toggleFilterMobile is a function to toggle filter in mobile mode
   */
  toggleFilterMobile() {
    this.setState({ filterMobile: this.state.filterMobile ? false : true });
  }

  /**
   * toggleCampaignModal is a function to toggle open campaign modal
   */
  toggleCampaignModal() {
    this.setState({ nextCampaignModal: !this.state.nextCampaignModal }, () => {
      if (this.props.campaign_is_open === "yes") {
        this.props.onChange('campaign_open_at_quarter', '');
        this.props.onChange('campaign_open_at_year', '');
      }
    })
  }

  /**
   * setScrollHeight is a function to manager modal height when select field is open / close
   * @param {string} condition - enum: open or close
   */
  setScrollHeight(condition) {
    setTimeout(() => {
      let element = document.getElementById("dialogContent")
      if (!isEmpty(element.scrollHeight)) {
        if (element.scrollHeight !== element.scrollTop) {
          if (condition == "open") {
            element.style.height = `${element.scrollHeight}px`;
            element.style.overflowY = 'visible';
          } else {
            element.style.height = 'auto';
            element.style.overflowY = "auto";
          }
        }
      }
    }, 25)
  }

  render() {
    const { filterMobile, stepCount, years, nextCampaignModal, campaignIsOpen } = this.state;
    const {
      errors,
      roster_process,
      roster_processes,
      classes,
      rosterProcessOnChange,
      width,
      campaign_is_open,
      campaign_open_at_quarter,
      campaign_open_at_year,
      campaignLoading,
      toggleRosterCampaign,
      onChange
    } = this.props;

    return (
      <Grid container spacing={24}>
        <Helmet>
          <title>{APP_NAME + ' - Roster'}</title>
          <meta name="description" content={APP_NAME + ' Roster'} />
        </Helmet>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.titlePage}>
            Roster
					</Typography>
        </Grid>
        <Grid item xs={12}>
        {this.state.showQuestionDialog && <JobQuestionDialog reloadProfiles={this.reloadProfiles} setSelectedRosterID={this.toogleShowQuestionDialog} rosterProfileID={this.state.rosterProfileID} rosterID={roster_process.value} />}

          <Paper className={classes.root}>
            <Typography variant="h6" component="h3">
              Choose Roster Process
						</Typography>
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={12} sm={7} md={8} lg={9} xl={10}>
                <SelectField
                  id="roster_process"
                  label="Choose Roster Process"
                  margin="dense"
                  options={roster_processes}
                  value={roster_process}
                  placeholder="Choose Roster Process"
                  isMulti={false}
                  name="roster_process"
                  fullWidth
                  onChange={(value, e) =>{
                     rosterProcessOnChange(e.name, value);
                     this.getStepCount(value)
                  }}
                  error={errors.roster_process}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isEmpty(roster_process) ? true : false}
                  onClick={() => this.props.getRosterStatistics()}
                >
                  <CloudDownloadIcon className={classes.addMarginRight} /> Download Statistics
								</Button>
              </Grid>
              {(!isEmpty(roster_process) && !isEmpty(campaign_is_open)) && (
                <>
                  <Grid item xs={12}>
                    <FormControlLabel
                      label={`Open ${roster_process.label} Campaign`}
                      labelPlacement="start"
                      style={{ marginLeft: 0, display: 'none'}}
                      control={
                        <div>
                          <Switch
                            classes={{ switchBase: classes.switch }}
                            name="campaign_is_open"
                            checked={campaign_is_open === 'yes' ? true : false}
                            onChange={(e) => {
                              this.setState({ nextCampaignModal: true, campaignIsOpen: e.target.checked }, () => {
                                this.checkValid()
                              })
                            }}
                            color="primary"
                          />
                          { campaignLoading && (<span style={{display: 'inline-block', verticalAlign: 'middle'}}><CircularProgress  thickness={5} size={22} color='primary'/></span>)}
                        </div>
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
        {(width != 'sm' && width != 'xs') ? (
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <HRFilter filterFor="roster" />
          </Grid>
        ) : null}
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={9}
          className={width == 'sm' || width == 'xs' ? classes.jobListContainer : ''}
        >
          <RosterLists
            roster_process_id={roster_process.value}
            toogleShowQuestionDialog={this.toogleShowQuestionDialog}
            stepCount={stepCount}
            getStepCount={this.getStepCount}
            reloadProfiles={this.reloadProfiles}
          />
        </Grid>
        {(width == 'sm' || width == 'xs') ? (
          <Fab
            variant="extended"
            color="primary"
            aria-label="Delete"
            className={classes.filterBtn}
            onClick={this.toggleFilterMobile}
          >
            <FilterListIcon className={classes.extendedIcon} />
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
              <HRFilter filterFor="roster" />
            </div>
          </Drawer>
        ) : null}
        <Dialog open={nextCampaignModal} onClose={this.toggleCampaignModal} maxWidth="lg">
          {!campaignIsOpen && (
            <DialogTitle classes={{ root: classes.dialogTitle }}>Please fill the form below before closing {roster_process.label} application campaign?</DialogTitle>
          )}
          <DialogContent id="dialogContent">
            {campaignIsOpen ? (
              <Typography variant="h6" color="primary">Are you sure you want to open {roster_process.label} application campaign?</Typography>
            ) : (
              <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <SelectField
                    label="Next Opening Schedule (Quarter)"
                    options={quarter}
                    value={{ value: campaign_open_at_quarter, label: campaign_open_at_quarter}}
                    onChange={(value, e) => onChange(e.name, value.value) }
                    placeholder="Next Opening Schedule (Quarter)"
                    isMulti={false}
                    name="campaign_open_at_quarter"
                    fullWidth={true}
                    margin="dense"
                    error={errors.campaign_open_at_quarter}
                    onMenuOpenOrClose={this.setScrollHeight}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectField
                    label="Next Opening Schedule (Year)"
                    options={years}
                    value={{ value: campaign_open_at_year, label: campaign_open_at_year}}
                    onChange={(value, e) => onChange(e.name, value.value) }
                    placeholder="Next Opening Schedule (Year)"
                    isMulti={false}
                    name="campaign_open_at_year"
                    fullWidth={true}
                    margin="dense"
                    error={errors.campaign_open_at_year}
                    onMenuOpenOrClose={this.setScrollHeight}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="secondary" onClick={this.toggleCampaignModal}>Close</Button>
            <Button variant="contained" color="primary" onClick={async () => {
                await toggleRosterCampaign(campaignIsOpen);
                this.setState({ nextCampaignModal: false });
            }}>Save {campaignLoading && <CircularProgress className={classes.white} thickness={5} size={22}/>}</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

let propTypesYears = pluck(campaignYears(), 'value')
propTypesYears.push('');

Roster.propTypes = {
  /**
   * errors is a prop containing an error in Roster page
   */
  errors: PropTypes.object.isRequired,
  /**
   * roster_process is a prop containing selected roster process data
   */
  roster_process: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string // empty string
  ]).isRequired,
  /**
   * roster_processes is a prop containing all roster process data
   */
  roster_processes: PropTypes.array.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * width is a prop containing width data coming from withWidth feature by material-ui v3
   */
  width: PropTypes.string.isRequired,
  /**
   * selected_page is a prop containing selected / current page
   */
  selected_page: PropTypes.oneOfType([
    PropTypes.string, // number in string format
    PropTypes.number
  ]).isRequired,
  /**
   * campaign_is_open is a prop containing roster campaign is open / close data
   */
  campaign_is_open: PropTypes.oneOf(["yes", "no"]).isRequired,
  /**
   * campaign_open_at_quarter is a prop containing campaign open at (quarter) data if campaign_is_open = no
   */
  campaign_open_at_quarter: PropTypes.string,
  /**
   * campaign_open_at_year is a prop containing campaign open at (year) data if campaign_is_open = no
   */
  campaign_open_at_year: PropTypes.oneOf(propTypesYears),
  /**
   * campaignLoading is a prop containing value to show / hide loading when updating open / close roster campaign
   */
  campaignLoading: PropTypes.bool.isRequired,
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux actions to call an api using POST HTTP Request
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * getRosterProcess is a prop containing redux action to get selected roster process data
   */
  getRosterProcess: PropTypes.func.isRequired,
  /**
   * getAuthSkype is a prop containing redux action to get skype data of the current logged in user
   */
  getAuthSkype: PropTypes.func.isRequired,
  /**
   * rosterProcessOnChange is a prop containing redux action to change roster process
   */
  rosterProcessOnChange: PropTypes.func.isRequired,
  /**
   * filterForChange is a prop containing redux action to change filter data
   */
  filterForChange: PropTypes.func.isRequired,
  /**
   * getRosterStatistics is a prop containing redux action to download roster statistic data
   */
  getRosterStatistics: PropTypes.func.isRequired,
  /**
   * getRosterProfile is a prop containing redux action to get list of profile in current step of selected roster process
   */
  getRosterProfile: PropTypes.func.isRequired,
  /**
   * toggleRosterCampaign is a prop containing redux action to open/close roster campaign
   */
  toggleRosterCampaign: PropTypes.func.isRequired,
  /**
   * getOpenRosterCampaignData is a prop containing redux action to get current status of the campaign
   */
  getOpenRosterCampaignData: PropTypes.func.isRequired,
  /**
   * onChange is a prop containing redux action to change roster data inside redux
   */
  onChange: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  getRosterProcess,
  getAuthSkype,
  rosterProcessOnChange,
  filterForChange,
  getRosterStatistics,
  getRosterProfile,
  toggleRosterCampaign,
  getOpenRosterCampaignData,
  onChange
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  errors: state.roster.errors,
  roster_processes: state.options.roster_processes,
  roster_process: state.roster.roster_process,
  campaign_is_open: state.roster.campaign_is_open,
  campaign_open_at_quarter: state.roster.campaign_open_at_quarter,
  campaign_open_at_year: state.roster.campaign_open_at_year,
  campaignLoading: state.roster.campaignLoading,
  selected_page: state.roster.selected_page
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3
  },
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
  addMarginRight: {
    marginRight: '.25em'
  },
  titlePage: {
    marginTop: '12px',
    fontSize: '2rem'
  },
  switch: { height: 'auto' },
  dialogTitle: { '& > h6': { color: `${primaryColor} !important` } },
  white: { color: white }
});

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Roster)));
