/** import React, Prop Types and lodash */
import React from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';

/** import Material UI styles, width, components and icons */
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import FilterListIcon from '@material-ui/icons/FilterList';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Send from '@material-ui/icons/Send';
import Star from '@material-ui/icons/Grade';
import Archive from '@material-ui/icons/Archive';
import Unarchive from '@material-ui/icons/Unarchive';

/** import configuration value and validation helper*/
import { APP_NAME } from '../config/general';
import { blueIMMAP, white, blueIMMAPHover, primaryColor, star, archive, archiveHover } from '../config/colors';
import isEmpty from '../validations/common/isEmpty';

/** import components needed for this component */
import Pagination from '../common/Pagination';
import ProfileModal from '../common/ProfileModal';
import SingleInvite from './allprofiles/SingleInvite';
import AllProfilesFilter from './allprofiles/AllProfilesFilter';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { openCloseProfile, getCompletedProfile, toggleArchive, toggleStar, onChange } from '../redux/actions/allprofiles/AllProfilesActions';
import { onChange as filterOnChange, resetFilter } from '../redux/actions/allprofiles/AllProfilesFilterActions';

/** import React Helmet for SEO purpose and permission checker */
import { Helmet } from 'react-helmet';
import { can } from '../permissions/can';

/**
 * AllProfiles is a component to show All Profiles page
 *
 * @name AllProfiles
 * @component
 * @category Page
 *
 */
class AllProfiles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabValue: 'talent-pool',
      single_invite_profile_id: '',
      single_invite_profile_name: '',
      filterMobile: false
    }

    this.changeTab = this.changeTab.bind(this);
    this.changePage = this.changePage.bind(this);
    this.closeSingleInvitation = this.closeSingleInvitation.bind(this);
    this.sendSingleEmail = this.sendSingleEmail.bind(this);
    this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
    this.closeArchiveInfo = this.closeArchiveInfo.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    this.setState({ tabValue: this.props.match.url == '/all-profiles/talent-pool' ? 'talent-pool' : 'archived' }, () => {
      this.props.filterOnChange('filterType', this.state.tabValue);
      this.props.getCompletedProfile();
    });
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
  componentDidUpdate(prevProps) {
    if (this.props.filterData !== prevProps.filterData || this.props.filterType !== prevProps.filterType) {
      this.props.filterOnChange('current_page', 1);
      this.props.filterOnChange('last_page', 1);
      this.props.filterOnChange('totalCount', 0);
      this.props.getCompletedProfile();
    }
  }

  /**
   * changePage is a function to change pagination page
   * @param {number} page
   */
  changePage(page) {
    this.props.filterOnChange('current_page', page);
    this.props.getCompletedProfile();
  }

  /**
   * changeTab is a function to change tab inside the page
   * @param {ClickEvent} e - The observable event.
   * @param {string} tabValue
   * @listens ClickEvent
   */
  changeTab(e, tabValue) {
    this.setState({ tabValue }, () => {
      this.props.resetFilter();
      this.props.filterOnChange('filterType', this.state.tabValue);
      this.props.history.push(`/all-profiles/${this.state.tabValue}`);
    })
  }

  /**
   * closeSingleInvitation is a function to close invitation modal
   */
  closeSingleInvitation() {
    this.setState({ single_invite_profile_id: '', single_invite_profile_name: '' });
  }

  /**
   * sendSingleEmail is a function to send email invitation
   * @param {number} single_invite_profile_id
   * @param {string} single_invite_profile_name
   */
  sendSingleEmail(single_invite_profile_id, single_invite_profile_name) {
    this.setState({ single_invite_profile_id, single_invite_profile_name });
  }

  /**
   * toggleFilterMobile is a function to toggle filter between mobile view and desktop view
   */
  toggleFilterMobile() {
    this.setState({ filterMobile: this.state.filterMobile ? false : true });
  }

  /**
   * closeArchiveInfo is a function to close archive information modal
   */
  closeArchiveInfo() {
    this.props.onChange('openInfo', false)
  }

  render() {
    const { width, classes, openProfile, selected_profile_id, openCloseProfile, isLoading, profiles, current_page, last_page, totalCount, toggleArchive, toggleStar,
      openInfo, archiveLoading, jobRecruitmentProcess, surgeAlertRecruitmentProcess, rosterRecruitmentProcess, archiveUserId
    } = this.props;
    const { tabValue, filterMobile } = this.state;
    const pageTitle = `All Profiles - ${tabValue === 'talent-pool' ? 'Completed Profiles' : 'Archived'}`;
    const canStarProfile = can('Can Star a Profile');
    const canArchiveProfile = can('Set as Admin|Can Archive a Profile');
    let archiveWidth = 6;
    let gridWidth = { first: 8, second: 4 };
    if (canArchiveProfile) {
      archiveWidth = 4;
      gridWidth = { first: 7, second: 5 };
    }
    return(
      <Grid container spacing={16}>
        <Helmet>
          <title>{`${APP_NAME} > ${pageTitle}`}</title>
          <meta name="description" content={`${APP_NAME} ${pageTitle}`}/>
        </Helmet>
        {width != 'sm' && width != 'xs' && (
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <AllProfilesFilter />
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={8} lg={9}>
          <Tabs
            value={tabValue}
            onChange={this.changeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Completed Profiles" value="talent-pool" />
            {canArchiveProfile && (
              <Tab label="Archived" value="archived" />
            )}
          </Tabs>
          <div>
          {isLoading ? (
            <div>
              <Typography variant="subtitle1" color="primary" className={classes.loadingTitle}>Loading Super Human Profiles...</Typography>
              <CircularProgress
                color="primary"
                size={24}
                thickness={5}
                className={classes.loading}
                disableShrink
              />
            </div>
          ) : !isEmpty(profiles) ? (
            <div>
              <Typography color="secondary" variant="subtitle1" className={classes.card}>Total: {totalCount}</Typography>
              {profiles.map((profile, index) => (
                <Card key={'prof-' + index} className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item xs={12} sm={12} md={6} lg={gridWidth.first}>
                        <Typography variant="h6" color="primary">
                          {profile.user.starred_user === 'yes' && canStarProfile && (
                            <span className={classes.starGrpYes}>
                              <Star
                                className="starFull"
                                onClick={() => toggleStar(profile.user.id)}
                              />
                            </span>
                          )}
                          {profile.user.starred_user === 'no' && canStarProfile && (
                            <span className={classes.starGrpHide}>
                            <Star
                              className="starFull"
                              onClick={() => toggleStar(profile.user.id)}
                            />
                          </span>
                          )} {profile.user.full_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={gridWidth.second}>
                        <Grid container spacing={8}>
                          <Grid item xs={12} sm={12} md={archiveWidth}>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              size="small"
                              onClick={() => openCloseProfile(profile.id)}
                            >
                              <RemoveRedEye
                                fontSize="small"
                                className={classes.addSmallMarginRight}
                              />{' '}
                              Profile
                            </Button>
                          </Grid>
                          {canArchiveProfile && (
                            <Grid item xs={12} sm={12} md={4}>
                              <Button
                                variant="contained"
                                className={classes.archive}
                                fullWidth
                                size="small"
                                onClick={() => !archiveLoading && toggleArchive(profile.user.id)}
                              >
                                { archiveLoading && archiveUserId == profile.user.id ? (
                                  <CircularProgress
                                    className={classes.loading}
                                    thickness={5}
                                    size={22}
                                  />
                                ) : (
                                  tabValue === 'talent-pool' ? (
                                    <>
                                      <Archive
                                        fontSize="small"
                                        className={classes.addSmallMarginRight}
                                      />
                                      {' Archive'}
                                    </>
                                  ): (
                                    <>
                                      <Unarchive
                                        fontSize="small"
                                        className={classes.addSmallMarginRight}
                                      />
                                      {' Unarchive'}
                                    </>
                                  )
                                )
                              }
                              </Button>
                            </Grid>
                          )}
                          <Grid item xs={12} sm={12} md={archiveWidth}>
                            <Button
                              variant="contained"
                              fullWidth
                              size="small"
                              className={classes.blueIMMAP}
                              onClick={() =>
                                this.sendSingleEmail(
                                  profile.id,
                                  profile.user.full_name
                                )}
                            >
                              {`Invite `}
                              <Send fontSize="small" className={classes.addSmallMarginLeft} />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              <Pagination
                currentPage={current_page}
                lastPage={last_page}
                movePage={(page) => this.changePage(page)}
                onClick={(e, page) => this.changePage(page)}
              />
            </div>
          ) : (
            <Typography variant="h6" color="primary">
              No Profile Found
            </Typography>
          )}
          </div>
        </Grid>



        {(width == 'sm' || width == 'xs') && (
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
        )}

        {(width == 'sm' || width == 'xs') && (
          <Drawer
            variant="persistent"
            anchor="bottom"
            open={filterMobile}
            classes={{
              paper: filterMobile ? classes.filterDrawer : classes.filterDrawerHide
            }}
          >
            <div className={classes.mobileFilter}>
              <AllProfilesFilter />
            </div>
          </Drawer>
        )}

        <ProfileModal
          isOpen={openProfile}
          profileId={selected_profile_id}
          onClose={() => openCloseProfile()}
        />
        <SingleInvite
          isOpen={!isEmpty(this.state.single_invite_profile_id) ? true : false}
          profile_id={this.state.single_invite_profile_id}
          profile_name={this.state.single_invite_profile_name}
          onClose={this.closeSingleInvitation}
        />
        {can('Set as Admin|Can Archive a Profile') && (
          <Dialog
            open={openInfo}
            onClose={this.closeArchiveInfo}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>Active Recruitment Process</DialogTitle>
            <DialogContent>
              <DialogContentText component="div">
                <Grid container spacing={32}>
                  {/* Job Recruitment */}
                  <Grid item xs={12} sm={12} md={4}>
                    <Typography color="primary" variant='h6' component="div">Job Recruitment</Typography>
                    {!isEmpty(jobRecruitmentProcess) && (
                      <ul>
                        {jobRecruitmentProcess.map(job => {
                          const step = isEmpty(job.first_job_user) ? '' : isEmpty(job.first_job_user.first_job_status) ? '' : job.first_job_user.first_job_status.status;
                          return (
                            <li key={`job-${job.id}`}>
                              <a href={`/jobs/${job.id}`} target="_blank"><Typography variant='subtitle2' component="div">{job.title} {!isEmpty(step) && <strong>[{`${step}`}]</strong>}</Typography></a>
                            </li>
                          )
                        })}
                      </ul>)
                    }
                  </Grid>
                  {/* Roster Recruitment */}
                  <Grid item xs={12} sm={12} md={4}>
                    <Typography color="primary" variant='h6' component="div">Roster Recruitment</Typography>
                    {!isEmpty(rosterRecruitmentProcess) && (
                      <ul>
                        {rosterRecruitmentProcess.map(roster => (
                          <li key={`roster-${roster.roster_name}`}>
                            <a href="/roster" target="_blank"><Typography variant='subtitle2' component="div">{roster.roster_name} <strong>[{roster.roster_step}]</strong></Typography></a>
                          </li>
                        ))}
                      </ul>)
                    }
                  </Grid>
                  {/* Surge Alert Recruitment */}
                  <Grid item xs={12} sm={12} md={4}>
                    <Typography color="primary" variant='h6' component="div">Surge Alert Recruitment</Typography>
                    {!isEmpty(surgeAlertRecruitmentProcess) && (
                      <ul>
                        {surgeAlertRecruitmentProcess.map(job => {
                          const step = isEmpty(job.first_job_user) ? '' : isEmpty(job.first_job_user.first_job_status) ? '' : job.first_job_user.first_job_status.status;
                          return (
                            <li key={`surge-alert-${job.id}`}>
                              <a href={`/jobs/${job.id}`} target="_blank"><Typography variant='subtitle2' component="div">{job.title} {!isEmpty(step) && <strong>[{`${step}`}]</strong>}</Typography></a>
                            </li>
                          )
                        })}
                      </ul>)
                    }
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={this.closeArchiveInfo} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Grid>
    )
  }
}

AllProfiles.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * width is a prop containing width value coming from Material UI
   */
  width: PropTypes.string,
  /**
   * openCloseProfile is a prop function to toggle ProfileModal
   */
  openCloseProfile: PropTypes.func.isRequired,
  /**
   * getCompletedProfile is a prop function to call api to get the list of completed profiles
   */
  getCompletedProfile: PropTypes.func.isRequired,
  /**
   * filterOnChange is a prop function to handle any change on the filter
   */
  filterOnChange: PropTypes.func.isRequired,
  /**
   * resetFilter is a prop function to reset filter
   */
  resetFilter: PropTypes.func.isRequired,
  /**
   * toggleArchive is a prop function to toggle archive/archived user
   */
  toggleArchive: PropTypes.func.isRequired,
  /**
   * toggleStar is a prop function to toggle star/unstar user
   */
  toggleStar: PropTypes.func.isRequired,
  /**
   * openProfile is a prop containing boolean value to show/hide Profile Modal
   */
  openProfile: PropTypes.bool.isRequired,
  /**
   * selected_profile_id is a prop containing value of profile id
   */
  selected_profile_id: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([''])]),
  /**
   * profiles is a prop containing array of profile data
   */
  profiles: PropTypes.array.isRequired,
  /**
   * isLoading is a prop containing boolean value for show/hide loading circle
   */
  isLoading: PropTypes.bool.isRequired,
  /**
   * current_page is a prop containing value that hold pagination page
   */
  current_page: PropTypes.number.isRequired,
  /**
   * last_page is a prop containing value that hold the last page of the pagination
   */
  last_page: PropTypes.number.isRequired,
  /**
   * totalCount is a prop containing total profiles data sent from api
   */
  totalCount: PropTypes.number.isRequired,
  /**
   * filterData is a prop containing filter data value
   */
  filterData: PropTypes.string.isRequired,
  /**
   * filterType is a prop containing tab value data
   */
  filterType: PropTypes.oneOf(['talent-pool', 'archived']),
  /**
   * openInfo is a prop containing boolean value to open archive information modal
   */
  openInfo: PropTypes.bool.isRequired,
  /**
   * jobRecruitmentProcess is a prop containing job recruitment information
   */
  jobRecruitmentProcess: PropTypes.array,
  /**
   * rosterRecruitmentProcess is a prop containing roster recruitment information
   */
  rosterRecruitmentProcess: PropTypes.array,
  /**
   * surgeAlertRecruitmentProcess is a prop containing surge alert recruitment information
   */
  surgeAlertRecruitmentProcess: PropTypes.array,
  /**
   * archiveLoading is a prop containing boolean value to show/hide loading on archive/unarchive button
   */
  archiveLoading: PropTypes.bool.isRequired,
  /**
   * archiveUserId is a prop containing value of the user who will be archive/unarchive
   */
  archiveUserId: PropTypes.number,
  /**
   * onChange is a prop function to handle any change on the all profiles reducer data
   */
  onChange: PropTypes.func.isRequired,
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  openCloseProfile,
  getCompletedProfile,
  filterOnChange,
  resetFilter,
  toggleArchive,
  toggleStar,
  onChange
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  openProfile: state.allProfiles.openProfile,
  selected_profile_id: state.allProfiles.selected_profile_id,
  profiles: state.allProfiles.profiles,
  isLoading: state.allProfiles.isLoading,
  current_page: state.allProfilesFilter.current_page,
  last_page: state.allProfilesFilter.last_page,
  totalCount: state.allProfilesFilter.totalCount,
  filterType: state.allProfilesFilter.filterType,
  filterData: JSON.stringify(
    pick(state.allProfilesFilter, [
      'searchTemp',
      'chosen_language',
      'chosen_degree_level',
      'chosen_sector',
      'chosen_skill',
      'chosen_field_of_work',
      'chosen_country',
      'chosen_nationality',
      'chosen_country_of_residence',
      'is_available',
      'experience',
      'immaper_status',
      'select_gender',
      'show_starred_only'
    ])),
  openInfo: state.allProfiles.openInfo,
  jobRecruitmentProcess: state.allProfiles.jobRecruitmentProcess,
  rosterRecruitmentProcess: state.allProfiles.rosterRecruitmentProcess,
  surgeAlertRecruitmentProcess: state.allProfiles.surgeAlertRecruitmentProcess,
  archiveLoading: state.allProfiles.archiveLoading,
  archiveUserId: state.allProfiles.archiveUserId
})

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
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
    'margin-top': theme.spacing.unit * 3
  },loading: {
    margin: theme.spacing.unit * 2 + 'px auto',
    display: 'block'
  },
  card: {
    marginBottom: theme.spacing.unit
  },
  cardContent: {
    padding: theme.spacing.unit + 'px ' + theme.spacing.unit * 2 + 'px',
    '&:last-child': {
      paddingBottom: theme.spacing.unit
    }
  },
  addSmallMarginRight: {
    marginRight: theme.spacing.unit
  },
  addSmallMarginLeft: {
    marginLeft: theme.spacing.unit
  },
  blueIMMAP: {
    background: blueIMMAP,
    color: white,
    '&:hover': {
      background: blueIMMAPHover
    }
  },
  name: {
    display: 'inline',
    marginLeft: theme.spacing.unit
  },
  checkBox: {
    padding: '0 0 4px',
    cursor: 'pointer'
  },
  allCheckbox: {
    marginLeft: theme.spacing.unit / 2
  },
  sendAll: {
    display: 'inline-flex',
    marginBottom: theme.spacing.unit
  },
  loadingTitle: {
    textAlign: 'center'
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
  starGrpYes: { color: star, display: 'inline-flex', verticalAlign: 'text-bottom', cursor: 'pointer',
    '& > .starFull': {display: 'inline-block'},
    '& > .starBlank': {display: 'none'},
    '&:hover > .starFull': { display: 'none'},
    '&:hover > .starBlank': { display: 'inline-block'}
  },
  starGrpNo: { color: star, display: 'inline-flex', verticalAlign: 'text-bottom', cursor: 'pointer',
    '& > .starFull': {display: 'none'},
    '& > .starBlank': {display: 'inline-block'},
    '&:hover > .starFull': { display: 'inline-block'},
    '&:hover > .starBlank': { display: 'none'}
  },
  starGrpHide: { display: 'inline-flex', marginRight: 25, verticalAlign: 'text-bottom', cursor: 'pointer',
  '& > .starFull': {display: 'none'},
  '& > .starBlank': {display: 'none'},
  },
  archive: { background: archive, color: white, '&:hover': { color: white, background: archiveHover } },
  loading: {
    "margin-left": theme.spacing.unit,
    "margin-right": theme.spacing.unit,
    color: white,
  }
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AllProfiles)));
