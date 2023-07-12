import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { connect } from 'react-redux'
import Cookies from 'js-cookie';
import { withStyles } from '@material-ui/core/styles'
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Grid from "@material-ui/core/Grid"
import Fab from '@material-ui/core/Fab'
import Drawer from '@material-ui/core/Drawer'
import FilterListIcon from '@material-ui/icons/FilterList'
import SecurityFilter from './security-parts/SecurityFilter'
import TravelRequestLists from './security-parts/TravelRequestLists'
import { onChange, getTravelRequests } from '../../redux/actions/security-module/securityActions'
import { onChange as filterOnChange } from '../../redux/actions/security-module/securityFilterActions'
import { resetFilter } from '../../redux/actions/security-module/securityFilterActions'
import { primaryColor, white } from '../../config/colors'
import isEmpty from '../../validations/common/isEmpty'
import validator from 'validator'
import Pagination from '../../common/Pagination';


class Security extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filterMobile: false
    }
    this.tabChange = this.tabChange.bind(this)
    this.checkParam = this.checkParam.bind(this)
    this.redirectURL = this.redirectURL.bind(this)
    this.toggleFilterMobile = this.toggleFilterMobile.bind(this)
    this.changePage = this.changePage.bind(this)
  }

  componentDidMount() {
    this.checkParam();

    //press backbutton
    window.addEventListener('popstate', (event) => {
      if (Cookies.get('backToSecurity') !== undefined) {
        Cookies.remove('backToSecurity')
        this.checkParam(true)
        this.props.getTravelRequests()
      }
      else {
        this.checkParam(true)
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.queryParams !== this.props.queryParams) {
      this.props.filterOnChange('current_page', 1);
      this.props.filterOnChange('current_page', 1);
      this.props.filterOnChange('last_page', 1);
      this.props.filterOnChange('totalCount', 0);
      this.props.getTravelRequests();
    }
  }

  async redirectURL() {
    await this.props.history.push({
      url: '/security',
      search: this.props.queryParams
    })
  }

  async tabChange(tab) {
    this.props.onChange('tab', tab)
    this.props.resetFilter()
    await this.props.onChange('queryParams', '?tab=' + tab + '&archiveTypes[]=latest')
    this.redirectURL()
  }

  async checkParam(fromBackButton = false) {
    if (!isEmpty(this.props.location)) {
      if (!isEmpty(this.props.location.search)) {
        const queryParams = queryString.parse(this.props.location.search)
        if (validator.isInt(queryParams.tab)) {
          this.props.onChange('tab', Number(queryParams.tab))
          await this.props.onChange('queryParams', this.props.location.search)
        }
      } else {
        this.props.onChange('tab', 0)
        await this.props.onChange('queryParams', '?tab=' + 0 + '&archiveTypes[]=latest')
      }
    }
    if (fromBackButton) {
      this.filter.checkParam(true);
    }
  }

  toggleFilterMobile() {
    this.setState({ filterMobile: this.state.filterMobile ? false : true })
  }

  /**
   * changePage is a function to change pagination page
   * @param {number} page
   */
     changePage(page) {
      this.props.filterOnChange('current_page', page);
      this.props.getTravelRequests();
    }
  

  render() {
    const { tab, tabOptions, classes, width, current_page, last_page } = this.props;
    const { filterMobile } = this.state
    const isMobile = isWidthDown("sm", width)

    return (
      <div>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          centered={isMobile ? false : true}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : "off"}
          onChange={(e, value) => { this.tabChange(value) }}
        >
          {tabOptions.map((value) => (
            <Tab key={value.id} label={value.label} />
          ))}
        </Tabs>

        <Grid container spacing={24}>
          {!isMobile && (
            <Grid item xs={12} sm={4} md={3}>
              <SecurityFilter redirectURL={this.redirectURL} onRef={(ref) => (this.filter = ref)} />
            </Grid>
          )}
          <Grid item xs={12} sm={!isMobile ? 8 : 12} md={!isMobile ? 9 : 12}>
            <TravelRequestLists />
            <Pagination
                currentPage={current_page}
                lastPage={last_page}
                movePage={(page) => this.changePage(page)}
                onClick={(e, page) => this.changePage(page)}
              />
          </Grid>
        </Grid>
        {isMobile && (
          <Fab
            variant="extended"
            color="primary"
            aria-label="Delete"
            className={classes.filterBtn}
            onClick={this.toggleFilterMobile}
          >
            <FilterListIcon className={classes.extendedIcon} />
            {filterMobile ? 'Set ' : ''} Filter
          </Fab>
        )}
        {isMobile && (
          <Drawer
            variant="persistent"
            anchor="bottom"
            open={filterMobile}
            classes={{
              paper: filterMobile ? classes.filterDrawer : classes.filterDrawerHide
            }}
          >
            <div className={classes.mobileFilter}>
              <SecurityFilter filterMobile={filterMobile} redirectURL={this.redirectURL} onRef={(ref) => (this.filter = ref)} />
            </div>
          </Drawer>
        )}
      </div>
    )
  }
}

Security.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']).isRequired,
  tab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tabOptions: PropTypes.array.isRequired,
  queryParams: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  getTravelRequests: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  onChange,
  resetFilter,
  getTravelRequests,
  filterOnChange
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  tab: state.security.tab,
  tabOptions: state.security.tabOptions,
  queryParams: state.security.queryParams,
  current_page: state.securityFilter.current_page,
  last_page: state.securityFilter.last_page,
  totalCount: state.securityFilter.totalCount,
})

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
    border: '1px solid ' + primaryColor
  },
  extendedIcon: { marginRight: theme.spacing.unit },
  filterDrawer: {
    height: '100%',
    'padding-left': theme.spacing.unit * 3,
    'padding-right': theme.spacing.unit * 3
  },
  filterDrawerHide: { bottom: 'auto' },
  mobileFilter: { height: '100%', 'margin-top': theme.spacing.unit * 3 },
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Security)))
