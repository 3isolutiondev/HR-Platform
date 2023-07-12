/** import React, PropTypes, React Helmet and Query String */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import queryString from 'query-string'

/** import Material UI withStyles, withWidth, components and icons */
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FilterListIcon from '@material-ui/icons/FilterList';

/** import custom components */
import Btn from '../../common/Btn';
import JobFilter from './JobFilter';
import JobLists from './JobLists';

/** import configuration value, permission checker and validation helper */
import isEmpty from '../../validations/common/isEmpty';
import { can } from '../../permissions/can';
import { APP_NAME } from '../../config/general';
import { primaryColor, white } from '../../config/colors';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { onChange } from '../../redux/actions/jobs/jobTabActions';
import { onChange as onChangeJobFilter, isFilterIsReset, resetFilter } from '../../redux/actions/jobs/jobFilterActions';
import { addFlashMessage } from '../../redux/actions/webActions';

/**
 * Jobs is a component to show Jobs page
 *
 * @name Jobs
 * @component
 * @category Page
 * @subcategory Jobs
 *
 */
class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: {},
      filterJobURL: '/api/jobs/search-filter',
      isFilter: false,
      filterData: {},
      filterMobile: false,
      tabValue: 0,
      loadingJob: true,
      firstLoad: true,
      page: 1,
      hasAssignJobManager: false
    };

    this.updateJobs = this.updateJobs.bind(this);
    this.updatePagination = this.updatePagination.bind(this);
    this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.setLoadingJob = this.setLoadingJob.bind(this);
    this.defaultValue = this.defaultValue.bind(this);
    this.checkQueryParameter = this.checkQueryParameter.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    //check the query parameter
    this.checkQueryParameter()

    const updateURL = true;
    if (this.props.match) {
      if (!isEmpty(this.props.match.params)) {
        if (!isEmpty(this.props.match.params.page) && !isEmpty(this.props.match.params.tab) && (can('Set as Admin') || can('Set as Manager') || this.props.auth.user.isSbpRosterMember)) {
          let tabSlug = this.props.tabFilterJob.tabs.find(
            (dt) => dt.slug === this.props.match.params.tab
          );
          if (!isEmpty(tabSlug)) {
            this.props.onChange({ tab: tabSlug.id, page: this.props.match.params.page })
              .then(() => {
                this.updatePagination(this.props.match.params.page, updateURL)
              });
          } else {
            this.props.history.push("/404");
          }
        } else if (!isEmpty(this.props.match.params.page) && isEmpty(this.props.match.params.tab)) {
            this.props.onChange({ tab: 0, page: this.props.match.params.page })
              .then(() => {
                this.updatePagination(this.props.match.params.page, updateURL)
              });
        } else {
            this.props.history.push("/404")
        }
      } else {
        this.props.onChange({ tab: 0, page: '1' })
          .then(() => {
            this.updatePagination(this.props.tabFilterJob.page)
          });
      }
    } else {
      this.props.onChange({ tab: 0, page: '1' })
        .then(() => {
          this.updatePagination(this.props.tabFilterJob.page)
        });
    }

    this.props.getAPI('/api/check-has-assign-as-job-manager')
    .then(res => {
      const { hasAssignJobManager } = res.data.data
      this.setState({ hasAssignJobManager })
    }).catch((err) => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'There is an error while processing the request'
      });
    });

    //press backbutton
    window.addEventListener('popstate', (event) => {
      this.props.onChangeJobFilter('isFilter', false).then(() => {
        this.checkQueryParameter()
        if (this.props.match.url === "/jobs" || this.props.match.url === "/") {
          this.props.resetFilter()
          this.props.onChange({ tab: 0, page: "1" })
            .then(() => {
              this.updatePagination("1", false)
            });
        } else {
          let tabSlug = this.props.tabFilterJob.tabs.find((dt) => dt.slug === this.props.match.params.tab);
            if (!isEmpty(tabSlug)) {
              this.props.onChange({tab: tabSlug.id, page: this.props.match.params.page})
                .then(() =>{
                  this.updatePagination(this.props.tabFilterJob.page, false)
                });
            } else {
                this.props.onChange({tab: 0, page: this.props.match.params.page})
                .then(() =>{
                  this.updatePagination(this.props.tabFilterJob.page, false)
                });
            }
        }
      })
    });
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
  componentDidUpdate(prevProps) {
    if (!(this.state.firstLoad) && this.props.jobFilter.isFilter && (JSON.stringify(prevProps.jobFilter) !== JSON.stringify(this.props.jobFilter) || prevProps.jobFilter !== this.props.jobFilter)) {
      this.updatePagination(this.props.tabFilterJob.page, true)
    }
  }

  /**
   * checkQueryParameter is a function check query parameter on the url
   */
  checkQueryParameter() {
    const valuesQueryString = queryString.parse(this.props.location.search)

    // check if empty data querystring
    if (!('search' in valuesQueryString)) {
      this.props.onChangeJobFilter('search', '')
    }
    if (!('contract_length_min' in valuesQueryString)) {
      const tempContractLength = this.props.jobFilter.contract_length
      tempContractLength.min = 0
      this.props.onChangeJobFilter('contract_length', tempContractLength)
    }
    if (!('contract_length_max' in valuesQueryString)) {
      const tempContractLength = this.props.jobFilter.contract_length
      tempContractLength.max = 24
      this.props.onChangeJobFilter('contract_length', tempContractLength)
    }
    if (!('choosen_country' in valuesQueryString)) {
      this.props.onChangeJobFilter('countries', [])
    }
    if (!('choosen_language' in valuesQueryString)) {
      this.props.onChangeJobFilter('choosen_language', [])
    }
    if (!('choosen_immap_office' in valuesQueryString)) {
      this.props.onChangeJobFilter('choosen_immap_office', [])
    }
    if (!('job_status' in valuesQueryString)) {
      this.props.onChangeJobFilter('job_status', [])
    }

    // querystring map
    Object.keys(valuesQueryString).map(key => {
      if (key === "search") {
        this.props.onChangeJobFilter(key, valuesQueryString[key])
      } else if (key === "contract_length_min") {
        const tempContractLength = this.props.jobFilter.contract_length
        tempContractLength.min = Number(valuesQueryString[key])
        this.props.onChangeJobFilter('contract_length', tempContractLength)
      } else if (key === "contract_length_max") {
        const tempContractLength = this.props.jobFilter.contract_length
        tempContractLength.max = Number(valuesQueryString[key])
        this.props.onChangeJobFilter('contract_length', tempContractLength)
      } else if (key === "choosen_country") {
        if (typeof valuesQueryString[key] === "string") {
          this.props.onChangeJobFilter(key, [valuesQueryString[key]])
        } else {
          this.props.onChangeJobFilter(key, valuesQueryString[key])
        }
      } else if (key === "choosen_language") {
        if (typeof valuesQueryString[key] === "string") {
          this.props.onChangeJobFilter(key, [valuesQueryString[key]])
        } else {
          this.props.onChangeJobFilter(key, valuesQueryString[key])
        }
      } else if (key === "choosen_immap_office") {
        if (typeof valuesQueryString[key] === "string") {
          this.props.onChangeJobFilter(key, [valuesQueryString[key]])
        } else {
          this.props.onChangeJobFilter(key, valuesQueryString[key])
        }
      } else if (key === "job_status") {
        if (typeof valuesQueryString[key] === "string") {
          this.props.onChangeJobFilter(key, [valuesQueryString[key]])
        } else {
          this.props.onChangeJobFilter(key, valuesQueryString[key])
        }
      }
    })
  }

  /**
   * updateJobs is a function to jobs data in the state
   * @param {Object} data         - data coming from an api
   * @param {Boolean} navigate    - redirect to the url / urladmin
   * @param {string} url          - url for non admin / manager
   * @param {string} urlAdmin     - urf for admin / manager
   * @param {string} queryString  - query string of the url
   */
  updateJobs(data, navigate, url, urlAdmin, queryString) {
    this.setState({ jobs: data }, () => {
      if (navigate) {
        if ((can('Set as Admin') || can('Set as Manager') || can('View SBP Job'))) {
          if (!isEmpty(queryString)) {
            this.props.history.push({
              pathname: urlAdmin,
              search: queryString,
            })
          } else {
            this.props.history.push(urlAdmin)
          }
        } else {
          if (!isEmpty(queryString)) {
            this.props.history.push({
              pathname: url,
              search: queryString,
            })
          } else {
            this.props.history.push(url)
          }
        }
      }
    });
  }

  /**
   * defaultValue is a function reset filter and tab value
   */
  defaultValue() {
    this.props.onChange({ tab: 0, page: '1' })
      .then(() => {
        if (this.props.isHome) {
          this.props.history.push('/')
        } else {
          this.props.history.push('/jobs')
        }
        this.updatePagination(this.props.tabFilterJob.page)
      });
  }

  /**
   * updatePagination is a function to move to next / previous / selected page
   * @param {number} current_page
   * @param {string} updateURL
   */
  updatePagination(current_page, updateURL) {
    const { tabValue, tabs } = this.props.tabFilterJob
    const { choosen_country, choosen_language, choosen_immap_office, contract_length, search, job_status, isReset, isFilter } = this.props.jobFilter

    const filterData = {
      tabValue: this.props.tabFilterJob['tabValue'],
      search,
      contract_length_min: contract_length.min,
      contract_length_max: contract_length.max,
      choosen_country,
      choosen_language,
      job_status,
      choosen_immap_office
    };

    //create query parameter
    const queryStringData = Object.keys(filterData).map(key => {
      if (key === "contract_length_max") {
        if (filterData[key] !== 12) {
          return key + '=' + filterData[key]
        }
      } else if (key === "contract_length_min") {
        if (filterData[key] !== 0) {
          return key + '=' + filterData[key]
        }
      } else if (key === "tabValue") {
        if (filterData[key] !== 0) {
          return key + '=' + filterData[key]
        }
      } else if (!isEmpty(filterData[key])) {
        if (key === "choosen_country" || key === "choosen_immap_office" || key === "choosen_language" || key === "job_status") {
          return filterData[key].map((data) => key + '=' + data).join('&')
        } else {
          return key + '=' + filterData[key]
        }
      }
    });

    const queryString = queryStringData.filter(function (element) {
      return element !== undefined;
    }).join('&');


    let tabData = tabs.find(
      (dt) => dt.id === tabValue
    );

    //check isReset true or not
    const updatePage = isReset ? false : updateURL

    this.props.onChange({ tab: tabData.id, page: current_page.toString() })
      .then(() => {
        if (isFilter) {
          this.props.postAPI('/api/jobs/search-filter', filterData)
            .then((res) => {
              this.setState({ firstLoad: false, loadingJob: false })
              const url = this.props.isHome ? "/pages/" + res.data.data.current_page : "/jobs/pages/" + res.data.data.current_page
              const urlAdmin = this.props.isHome ? "/pages/" + res.data.data.current_page + '/' + tabData.slug : "/jobs/pages/" + res.data.data.current_page + '/' + tabData.slug
              this.updateJobs(res.data.data, updatePage, url, urlAdmin, queryString);
            })
            .catch((err) => {
              this.setState({ firstLoad: false })
            })
        } else
        {
          this.props.postAPI(this.state.filterJobURL + '?page=' + current_page, filterData)
            .then((res) => {
              this.setState({ firstLoad: false, loadingJob: false })
              let url = this.props.isHome ? "/pages/" + res.data.data.current_page : "/jobs/pages/" + res.data.data.current_page;
              if (this.props.auth.user.isSbpRosterMember) {
                url = this.props.isHome ? `/pages/${res.data.data.current_page}/${tabData.slug}` : `/jobs/pages/${res.data.data.current_page}/${tabData.slug}`;
              }

              const urlAdmin = this.props.isHome ? "/pages/" + res.data.data.current_page + '/' + tabData.slug : "/jobs/pages/" + res.data.data.current_page + '/' + tabData.slug
              this.updateJobs(res.data.data, updatePage, url, urlAdmin, queryString);
            })
            .catch((err) => {
              this.setState({ firstLoad: false })
            });
        }

      });
  }

  /**
   * toggleFilterMobile is a function to toggle filter in mobile
   */
  toggleFilterMobile() {
    this.setState({ filterMobile: this.state.filterMobile ? false : true });
  }

  /**
   * tabChange is a function to handle the change of the tab
   * @param {number} valuetab
   */
  tabChange(valuetab) {
    const updateTab = true;
    this.props.resetFilter();
    this.defaultValue();
    this.props.isFilterIsReset(false, false)
    this.props.onChange({ tab: valuetab, page: "1" })
      .then(() => {
        this.updatePagination("1", updateTab)
      });
    this.setState({ loadingJob: true })
  }

  /**
   * setLoadingJob is a function to show / hide loading text
   * @param {Boolean} loading
   */
  setLoadingJob(loading = false) {
    this.setState({ loadingJob: loading })
  }

  render() {
    let { jobs, filterMobile, hasAssignJobManager } = this.state;
    const { width, classes, tabFilterJob, auth } = this.props;
    const isSbpRosterMember = !isEmpty(auth.user) ? !isEmpty(auth.user.isSbpRosterMember) ? auth.user.isSbpRosterMember : false : false;
    const { tabValue, tabs } = tabFilterJob;

    return (
      <Grid container spacing={24}>
        <Helmet>
          <title>{APP_NAME} - Jobs</title>
          <meta name="description" content={APP_NAME + ' Jobs'} />
        </Helmet>
        {!this.props.noTitle && (
          <Grid item xs={12} sm={8} md={9} lg={10} xl={11}>
            <Typography variant="h4" className={classes.titlePage}>
              Jobs
						</Typography>
          </Grid>
        )}
        {!this.props.noTitle &&
          (can('Add Job') || can('Set as Admin')) && (
            <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
              <Btn
                link="/jobs/create"
                btnText="Add Job"
                btnStyle="contained"
                color="primary"
                size="small"
                icon={<Add />}
                fullWidth
              />
            </Grid>
          )}
        {width != 'sm' && width != 'xs' && (
          <Grid item xs={12} sm={12} md={3}>
            <JobFilter hasAssignJobManager={hasAssignJobManager} setLoadingJob={this.setLoadingJob} tabValue={tabValue} reseter={() => this.defaultValue()} />
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sm={12}
          md={9}
          className={width == 'sm' || width == 'xs' ? classes.jobListContainer : ''}
        >
          {((can('Set as Admin') || can('View SBP Job') || can('Set as Manager') || hasAssignJobManager) && auth.user.isIMMAPER) && (

            <Tabs value={tabValue}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, v) => { this.tabChange(v) }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((value) => (
                ((value.id !== 3 || (value.id === 3 && (isSbpRosterMember || can('Set as Admin') || can('View SBP Job')))) && (
                  <Tab key={value.id} label={value.name} value={value.id} classes={{ root: classes.tab, wrapper: classes.tabWrapper }} />
                )))
              )}
            </Tabs>
          )}
          {(
            (!auth.user.isIMMAPER && isSbpRosterMember) ||
            (auth.user.isIMMAPER && isSbpRosterMember && !hasAssignJobManager && !can('Set as Admin') && !can('Set as Manager') && !can('View SBP Job'))
            ) && (
            <Tabs value={tabValue}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, v) => { this.tabChange(v) }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((value) => (
                (value.id === 0 || value.id === 3 || value.id === 4) && (
                  <Tab key={value.id} label={value.name} value={value.id} classes={{ root: classes.tab, wrapper: classes.tabWrapper }} />
                )
              ))}
            </Tabs>
          )}

          {(isEmpty(auth.user) || (!isSbpRosterMember && !can('Set as Admin') && !can('Set as Manager') && !can('View SBP Job'))) && (
            <Tabs value={tabValue}
             indicatorColor="primary"
             textColor="primary"
             onChange={(e, v) => { this.tabChange(v) }}
             variant="scrollable"
             scrollButtons="auto"
           >
             {tabs.map((value) => (
               (value.id === 0 || value.id === 4) && (
                 <Tab key={value.id} label={value.name} value={value.id} classes={{ root: classes.tab, wrapper: classes.tabWrapper }}/>
               )
             ))}
           </Tabs>
          )}
          <JobLists loadingJob={this.state.loadingJob} JobLists={jobs}
            paginate={(val) => {
              this.props.isFilterIsReset(false, false).then(() => {
                this.updatePagination(val, true)
              })
                .catch((err) => addFlashMessage({
                  type: 'error',
                  text: 'There is an error while retrieving jobs'
                }))
            }}
            updateLists={(val) => {
              this.props.isFilterIsReset(false, false).then(() => {
                this.updatePagination(val, true)
              })
                .catch((err) => addFlashMessage({
                  type: 'error',
                  text: 'There is an error while retrieving jobs'
                }))
            }}
          />
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
              <JobFilter setLoadingJob={this.setLoadingJob} tabValue={tabValue} reseter={() => this.defaultValue()} />
            </div>
          </Drawer>
        )}
      </Grid>
    );
  }
}

Jobs.defaultProps = {
  noTitle: false
}

Jobs.propTypes = {
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux actions to call an api using POST HTTP Request
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * onChange is a prop containing redux action to change reducer data on jobTabReducer
   */
  onChange: PropTypes.func.isRequired,
  /**
   * onChangeJobFilter is a prop containing redux action to change filter data on jobFilterReducer
   */
  onChangeJobFilter: PropTypes.func.isRequired,
  /**
   * isFilterIsReset is a prop containing redux action to change isFilter and isReset data on jobFilterReducer
   */
  isFilterIsReset: PropTypes.func.isRequired,
  /**
   * resetFilter is a prop containing redux action to reset filter data
   */
  resetFilter: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired,

  /**
   * jobFilter is a prop containing jobFilter reducer data
   */
  jobFilter: PropTypes.object.isRequired,
  /**
   * tabFilterJob is a prop containing tabFilterJob data
   */
  tabFilterJob: PropTypes.object.isRequired,
  /**
   * auth is a prop containing auth data
   */
  auth : PropTypes.object,

  /**
   * noTitle is a prop containing data to show / hide job title in the page
   */
  noTitle: PropTypes.bool,
  /**
   * history is a prop coming from react-router-dom
   */
  history: PropTypes.object.isRequired,
  /**
   * match is a prop coming from react-router-dom
   */
  match: PropTypes.object.isRequired,
  /**
   * location is a prop coming from react-router-dom
   */
  location: PropTypes.object.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  onChange,
  onChangeJobFilter,
  isFilterIsReset,
  resetFilter,
  addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStatetoProps = (state) => ({
  jobFilter: state.jobFilter,
  tabFilterJob: state.tabFilterJob,
  auth : state.auth
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  jobListContainer: {
    marginBottom: theme.spacing.unit * 5
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
  },

  titlePage: {
    fontSize: '2rem'
  },
  tab: {
    whiteSpace: "nowrap !important"
  },
  tabWrapper: {
    width: "auto !important",
  }
});

export default withWidth()(withStyles(styles)(connect(mapStatetoProps, mapDispatchToProps)(Jobs)));
