import React, { Component } from 'react';
import { connect } from 'react-redux';
import classname from 'classnames';
import queryString from 'query-string'
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import FilterListIcon from '@material-ui/icons/FilterList';
import UserFilter from './UserFilter';
import UserLists from './UserLists';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import isEmpty from '../../../validations/common/isEmpty';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';
import { primaryColor, white } from '../../../config/colors';
import { onChangeStatus, resetFilter } from '../../../redux/actions/completionstatus/userFilterActions';
import { addFlashMessage, serverErrorMessage } from '../../../redux/actions/webActions';
import Popper from '@material-ui/core/Popper';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Paper from '@material-ui/core/Paper';

class CompletionStatus extends Component {
  constructor(props) {
		super(props);
		this.state = {
			data_user: {},
			filterUserURL: '/api/users/filter-user',
			filterMobile: false,
			loading: true,
			firstLoad: true,
			page: 1,
			anchorEl: null,
			showSearch: false,
      keyword: '',
      roles: []
		};
    this.timer = null


		this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
		this.setLoading = this.setLoading.bind(this);
		this.checkQueryParameter = this.checkQueryParameter.bind(this);
    this.handleClick = this.handleClick.bind(this);
		this.showSearch = this.showSearch.bind(this);
    this.timerCheck = this.timerCheck.bind(this);
    this.getData = this.getData.bind(this);
    this.generateQueryParameter = this.generateQueryParameter.bind(this);
    this.updateLink = this.updateLink.bind(this);
    this.defaultValue = this.defaultValue.bind(this);
    this.getRoles = this.getRoles.bind(this);
  }

  componentDidMount() {
		this.checkQueryParameter();
    this.getRoles();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.userFilterStatus.search !== this.props.userFilterStatus.search ||
      JSON.stringify(prevProps.userFilterStatus.status) !== JSON.stringify(this.props.userFilterStatus.status) ||
      JSON.stringify(prevProps.userFilterStatus.steps) !== JSON.stringify(this.props.userFilterStatus.steps) ||
      JSON.stringify(prevProps.userFilterStatus.roles) !== JSON.stringify(this.props.userFilterStatus.roles)) && !this.state.firstLoad
    ) {
      this.generateQueryParameter(1);
    }

    if ((this.props.userFilterStatus.queryParameter !== prevProps.userFilterStatus.queryParameter) && !this.state.firstLoad) {
      this.updateLink();
    }

    if (JSON.stringify(this.props.location.search) !== JSON.stringify(prevProps.location.search)) {
      this.checkQueryParameter();
    }

    if (prevState.keyword !== this.state.keyword && !this.state.firstLoad) {
      this.timerCheck()
    }
  }

  async checkQueryParameter() {
    const valuesQueryString = queryString.parse(this.props.location.search)

    if (!isEmpty(valuesQueryString)) {
      const keyword = isEmpty(valuesQueryString.search) ? '' : valuesQueryString.search
      this.props.onChangeStatus('search', keyword)
      this.setState({ keyword })
      this.setState({ page: isEmpty(valuesQueryString.page) ? 1 : valuesQueryString.page })
      this.props.onChangeStatus(
        'steps',
          isEmpty(valuesQueryString['steps[]']) ? [] :
          Array.isArray(valuesQueryString['steps[]']) ?
            valuesQueryString['steps[]'] : [valuesQueryString['steps[]']])
      await this.props.onChangeStatus(
        'status',
        isEmpty(valuesQueryString['status[]']) ? [] :
        Array.isArray(valuesQueryString['status[]']) ?
          valuesQueryString['status[]'] : [valuesQueryString['status[]']])
      await this.props.onChangeStatus(
        'roles',
        isEmpty(valuesQueryString['roles[]']) ? [] :
        Array.isArray(valuesQueryString['roles[]']) ?
          valuesQueryString['roles[]'] : [valuesQueryString['roles[]']])
      this.getData();
    } else {
      this.setState({ keyword: '', showSearch: false, anchorEl: null }, async () => {
        await this.props.resetFilter();
        this.getData();
      })
    }

  }

  generateQueryParameter(selectedPage = '') {
    const { search, steps, status, roles } = this.props.userFilterStatus

    let queryString = new URLSearchParams({ search, page: selectedPage == '' ? this.state.page : selectedPage });
    if (!isEmpty(status)) {
      status.map(stat => {
        queryString.append('status[]', stat)
      })
    }
    if (!isEmpty(steps)) {
      steps.map(step => {
        queryString.append('steps[]', step)
      })
    }

    if (!isEmpty(roles)) {
      roles.map(role => {
        queryString.append('roles[]', role)
      })
    }
    this.props.onChangeStatus('queryParameter', queryString.toString());
  }

  updateLink() {
    this.props.history.push({
      pathname: "/dashboard/completion-status",
      search: this.props.userFilterStatus.queryParameter,
    })
  }

  getData() {
    const { search, steps, status, roles } = this.props.userFilterStatus
    this.setState({ loading: true }, () => {
      this.props.getAPI(this.state.filterUserURL, {
        search,
        steps,
        status,
        roles,
        page: this.state.page
      })
      .then((res) => {
        this.setState({ firstLoad: false, loading: false, data_user: res.data.data })
      })
      .catch((err) => {
        this.setState({ firstLoad: false, loading: false, data_user: {} }, () => {
          if (err.response.status == 422) {
            this.props.addFlashMessage({
              type: "error",
              text: "Please reset the filter"
            });
          } else {
            this.props.serverErrorMessage()
          }
        })
      });
    })
  }

  getRoles() {
    this.props
      .getAPI("/api/roles")
      .then((res) => {
        this.setState({roles: res.data.data})
      })
      .catch((err) => {

      });
  }

  defaultValue() {
    this.setState({ keyword: '', page: 1, data_user: {}, showSearch: false, anchorEl: null }, () => this.generateQueryParameter(1))
  }

  timerCheck() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setLoading(true);
	    this.props.onChangeStatus("search", this.state.keyword)
    }, 500)
  }

  toggleFilterMobile() {
		this.setState({ filterMobile: this.state.filterMobile ? false : true });
	}

	setLoading(loading = false) {
		this.setState({ loading: loading })
	}

	handleClick(event) {
	    this.setState({anchorEl : this.state.anchorEl ? null : event.currentTarget});
	};

	showSearch() {
		this.setState({showSearch: !this.state.showSearch}, () => {
      if (!this.state.showSearch) {
        this.props.onChangeStatus('search', "")
      }
    })
	}

  render() {
		let { data_user, filterMobile, showSearch, keyword, roles } = this.state;
		const { width, classes } = this.props;
		const open = Boolean(this.state.anchorEl);

		return (
			<Grid container spacing={24} direction="row" justify="space-between" alignItems="center">
				<Helmet>
					<title>{APP_NAME} - Completion Status</title>
					<meta name="description" content={APP_NAME + ' Completion Status'} />
				</Helmet>
				{!this.props.noTitle && (
					<Grid item xs={12}>
					  {!showSearch ?
              (<Typography variant="h5" className={classes.inlineFlex}>
                Profile Status (Total: {data_user.total || 0})
              </Typography>) : (
              <TextField
                id="search"
                name="search"
                label="Search"
                value={keyword}
                onChange={(e) => this.setState({ keyword: e.target.value })}
                autoFocus={true}
			    			InputProps={{
					    		endAdornment: (
							      <InputAdornment onClick={this.showSearch} position="end">
								    <ClearIcon />
							      </InputAdornment>
							    ),
						    }}
                className={classes.inlineFlex}
					    />)}
              {width !== 'sm' && width !== 'xs' && (
                <Paper className={classname(classes.filterBtn, classes.inlineFlex)}>
                  <IconButton aria-label="search" type="button" onClick={this.showSearch}>
                    <SearchIcon />
                  </IconButton>
                  <IconButton aria-label="filter" aria-describedby={open ? 'simple-popper' : undefined} type="button" onClick={this.handleClick}>
                    {!open ? <FilterListIcon /> : <ClearIcon />}
                  </IconButton>
                  <Popper className={classes.filterBox} id={open ? 'simple-popper' : undefined} open={open} anchorEl={this.state.anchorEl}>
                    <UserFilter roles={roles} reset={() => this.defaultValue()} resetKeyword={() => this.setState({ keyword: "" })}/>
                  </Popper>
                </Paper>
              )}
          </Grid>
				)}
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					className={width == 'sm' || width == 'xs' ? classes.jobListContainer : ''}
        >
					<UserLists
            loadingJob={this.state.loading}
            Users={data_user}
						paginate={(page) => this.generateQueryParameter(page)}
			  	/>
				</Grid>
        {(width == 'sm' || width == 'xs') && (
					<Fab
            variant="extended"
            color="primary"
            aria-label="Delete"
            className={classes.filterMobileBtn}
            onClick={this.toggleFilterMobile}
          >
            {filterMobile && (
              <span>
                <ClearIcon className={classes.extendedIcon} style={{ verticalAlign: 'middle' }}/>
                Close
              </span>
            )}

            {!filterMobile && (
              <span>
                <FilterListIcon className={classes.extendedIcon} style={{ verticalAlign: 'middle' }}/>
                Filter
              </span>
            )}
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
              <UserFilter roles={roles} isMobile={true} reset={() => this.defaultValue()} resetKeyword={() => this.setState({ keyword: "" })} />
              <div style={{ marginTop: '-8px', paddingLeft: 16, paddingRight: 16 }}>
                <TextField
                  id="search"
                  name="search"
                  label="Search"
                  value={keyword}
                  onChange={(e) => this.setState({ keyword: e.target.value })}
                  autoFocus={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment onClick={this.showSearch} position="end">
                      <ClearIcon />
                      </InputAdornment>
                    ),
                  }}
                  className={classes.searchMobile}
                  fullWidth
                />
              </div>
            </div>
          </Drawer>
				)}
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
	getAPI,
	postAPI,
	onChangeStatus,
	resetFilter,
  addFlashMessage,
  serverErrorMessage
};

const mapStatetoProps = (state) => ({
  	userFilterStatus: state.userFilterStatus,
    search: state.userFilterStatus.search
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
  inlineFlex: {
    display: 'inline-flex',
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    },
  },
  filterBox: {
	  width: 250,
  },
  filterBtn: {
    width: 'fit-content',
    float: 'right',
    [theme.breakpoints.down('xs')]: {
      float: 'none'
    }
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
  filterMobileBtn: {
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
  searchMobile: {

  }
});

export default withWidth()(withStyles(styles)(connect(mapStatetoProps, mapDispatchToProps)(CompletionStatus)));
