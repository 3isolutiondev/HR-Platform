/** import React, PropTypes and Linl */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/** import Material UI withStyles, components and icons*/
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import People from '@material-ui/icons/People';
import Dashboard from '@material-ui/icons/Dashboard';
import Lock from '@material-ui/icons/Lock';
import Flag from '@material-ui/icons/Flag';
import Language from '@material-ui/icons/Language';
import AccountBalance from '@material-ui/icons/AccountBalance';
import Category from '@material-ui/icons/Category';
import Settings from '@material-ui/icons/Settings';
import SecurityIcon from '@material-ui/icons/Security';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

/** import FontAwesome and it's icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons/faDoorOpen';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faListAlt } from '@fortawesome/free-solid-svg-icons/faListAlt';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { faStream } from '@fortawesome/free-solid-svg-icons/faStream';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons/faAngleDoubleRight';
import { faBoxes } from '@fortawesome/free-solid-svg-icons/faBoxes';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons/faBriefcase';
import { faCertificate } from '@fortawesome/free-solid-svg-icons/faCertificate';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch';
import { faFileContract } from '@fortawesome/free-solid-svg-icons/faFileContract';
import { faBuilding } from '@fortawesome/free-solid-svg-icons/faBuilding';
import { faTh } from '@fortawesome/free-solid-svg-icons/faTh';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons/faEnvelopeOpenText';
import { faUserShield } from '@fortawesome/free-solid-svg-icons/faUserShield';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { setHideSidebar } from '../redux/actions/webActions';
import { getRosterDashboard } from '../redux/actions/dashboard/roster/rosterDashboardActions';

/** import configuration value and permission checker */
import { drawerWidth } from '../config/web';
import { can } from '../permissions/can';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    minHeight: `${(theme.spacing.unit * 8) - 1}px !important`
  },
  fontAwesome: {
    width: '1.1em !important'
  },
  icon: {
    'margin-right': 0
  }
});

/**
 * Component for showing left side menu, it needs "Dashboard Access" permission to be shown on the UI
 *
 * Permission: Dashboard Access
 *
 * Notes: The menu in this list can be shown if they are also using the right permission
 * - Dashboard (Permission: Dashboard Access)
 * - Users (Permission: Index User)
 * - iMMAPer (Permission: Index Immaper)
 * - Roles (Permission: Index Role)
 * - Permissions (Permission: Index Permission)
 * - iMMAP Talent Pool (Permission: Index Roster Dashboard) -> loaded dynamically by slug
 * - Surge Roster (Permission: Index Roster Dashboard) -> loaded dynamically by slug
 * - UN Organizations (Permission: Index UN Org)
 * - Countries (Permission: Index Country)
 * - Job Status (Permission: Index Job Status)
 * - Language Level (Permission: Index Language Level)
 * - Languages (Permission: Index Language)
 * - Sectors (Permission: Index Sector)
 * - Areas of Expertise (Permission: Index Field of Work)
 * - Durations (Permission: Index Duration)
 * - Degree Levels (Permission: Index Degree Level)
 * - Skills (Permission: Select Skill for Matching)
 * - Job Levels (Permission: Index HR Job Level)
 * - Job Category (Permission: Index HR Job Category)
 * - Job Standard (Permission: Index HR Job Standard)
 * - Roster Process (Permission: Index Roster Process)
 * - IM Test Template (Permission: Index IM Test Template)
 * - Contract Template (Permission: Index Contract Template)
 * - iMMAP Office (Permission: Index Immap Office)
 * - Reference Check (No special permission, can be shown when User has "Dashboard Access" permission)
 * - Settings (Permission: Index Setting)
 * - Security Advisors (Permission: Index Duration)
 * - Durations (Permission: Index Duration)
 *
 * @component
 * @name Sidebar
 * @category Common
 * @subcategory Navigation
 * @example
 * return (
 *  <Sidebar openSidebar={openSidebar} />
 * )
 */

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexUrl: ''
    };
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    this.setState({ indexUrl: this.props.match.url });
    this.props.getRosterDashboard();
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   */
  componentDidUpdate() {
    if (this.state.indexUrl !== this.props.match.url) {
      this.setState({ indexUrl: this.props.match.url });
    }
  }

  render() {
    const { classes, openSidebar, menu } = this.props;
    let { indexUrl } = this.state;

    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openSidebar}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.props.setHideSidebar}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          {/*<ListItem selected={indexUrl === '/dashboard'} button component={Link} to="/dashboard">
            <ListItemIcon className={classes.icon}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          */}
          {can('Index User') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/users') === 0}
              component={Link}
              to="/dashboard/users"
            >
              <ListItemIcon className={classes.icon}>
                <People />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          )}
          {can('Set as Admin') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/completion-status') === 0}
              component={Link}
              to="/dashboard/completion-status"
            >
              <ListItemIcon className={classes.icon}>
                <People />
              </ListItemIcon>
              <ListItemText primary="Profile Status" />
            </ListItem>
          )}
          {can('Index Immaper') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/immapers') === 0}
              component={Link}
              to="/dashboard/immapers"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon icon={faUsers} size="lg" className={classes.fontAwesome} />
              </ListItemIcon>
              <ListItemText primary="iMMAPer" />
            </ListItem>
          )}
          {can('Index Role') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/roles') === 0}
              component={Link}
              to="/dashboard/roles"
            >
              <ListItemIcon className={classes.icon}>
                <Lock />
              </ListItemIcon>
              <ListItemText primary="Roles" />
            </ListItem>
          )}
          {can('Index Role|Index Permission|Set as Admin') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/permissions') === 0}
              component={Link}
              to="/dashboard/permissions"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon icon={faDoorOpen} size="lg" className={classes.fontAwesome} />
              </ListItemIcon>
              <ListItemText primary="Permissions" />
            </ListItem>
          )}

          {can('Index Roster Dashboard') &&
            menu.map((menu, key) => {
              return (
                <ListItem
                  key={key}
                  button
                  selected={indexUrl.indexOf('/dashboard/roster/' + menu.slug) === 0}
                  component={Link}
                  to={'/dashboard/roster/' + menu.slug}
                >
                  <ListItemIcon className={classes.icon}>
                    <FontAwesomeIcon icon={faListAlt} size="lg" className={classes.fontAwesome} />
                  </ListItemIcon>
                  <ListItemText primary={menu.name} />
                </ListItem>
              );
            })}
          {can('Index UN Org') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/un-organizations') === 0}
              component={Link}
              to="/dashboard/un-organizations"
            >
              <ListItemIcon className={classes.icon}>
                <AccountBalance />
              </ListItemIcon>
              <ListItemText primary="UN Organizations" />
            </ListItem>
          )}
          {can('Index Country') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/countries') === 0}
              component={Link}
              to="/dashboard/countries"
            >
              <ListItemIcon className={classes.icon}>
                <Flag />
              </ListItemIcon>
              <ListItemText primary="Countries" />
            </ListItem>
          )}
          {can('Index Job Status') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/job-status') === 0}
              component={Link}
              to="/dashboard/job-status"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faStream} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Job Status" />
            </ListItem>
          )}
          {can('Index Language Level') && (
            <ListItem
              button
              component={Link}
              to="/dashboard/language-levels"
              selected={indexUrl.indexOf('/dashboard/language-levels') === 0}
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faList} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Language Level" />
            </ListItem>
          )}
          {can('Index Language') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/languages') === 0}
              component={Link}
              to="/dashboard/languages"
            >
              <ListItemIcon className={classes.icon}>
                <Language />
              </ListItemIcon>
              <ListItemText primary="Languages" />
            </ListItem>
          )}
          {can('Index Sector') && (
            <ListItem
              button
              component={Link}
              to="/dashboard/sectors"
              selected={indexUrl.indexOf('/dashboard/sectors') === 0}
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faTh} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Sectors" />
            </ListItem>
          )}
          {can('Index Field of Work') && (
            <ListItem
              button
              component={Link}
              to="/dashboard/field-of-works"
              selected={indexUrl.indexOf('/dashboard/field-of-works') === 0}
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faBriefcase} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Areas of Expertise" />
            </ListItem>
          )}
          {can('Index Duration') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/durations') === 0}
              component={Link}
              to="/dashboard/durations"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faStopwatch} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Durations" />
            </ListItem>
          )}
          {can('Index Degree Level') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/degree-levels') === 0}
              component={Link}
              to="/dashboard/degree-levels"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faGraduationCap} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Degree Levels" />
            </ListItem>
          )}
          {can('Select Skill for Matching') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/skills') === 0}
              component={Link}
              to="/dashboard/skills"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faCertificate} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Skills" />
            </ListItem>
          )}
          {can('Index HR Job Level') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/hr-job-levels') === 0}
              component={Link}
              to="/dashboard/hr-job-levels"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faStream} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Job Levels" />
            </ListItem>
          )}
          {can('Index HR Job Category') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/hr-job-categories') === 0}
              component={Link}
              to="/dashboard/hr-job-categories"
            >
              <ListItemIcon className={classes.icon}>
                <Category />
              </ListItemIcon>
              <ListItemText primary="Job Category" />
            </ListItem>
          )}
          {can('Index HR Job Standard') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/hr-job-standards') === 0}
              component={Link}
              to="/dashboard/hr-job-standards"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faBoxes} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Job Standard" />
            </ListItem>
          )}
          {can('Index Roster Process') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/roster-processes') === 0}
              component={Link}
              to="/dashboard/roster-processes"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faAngleDoubleRight} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Roster Process" />
            </ListItem>
          )}
          {can('Index IM Test Template') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/im-test-templates') === 0}
              component={Link}
              to="/dashboard/im-test-templates"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faEnvelopeOpenText} size="lg" />
              </ListItemIcon>
              <ListItemText primary="IM Test Template" />
            </ListItem>
          )}
          {can('Index Contract Template') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/hr-contract-templates') === 0}
              component={Link}
              to="/dashboard/hr-contract-templates"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faFileContract} size="lg" />
              </ListItemIcon>
              <ListItemText primary="Contract Template" />
            </ListItem>
          )}
          {can('Index Immap Office') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/immap-offices') === 0}
              component={Link}
              to="/dashboard/immap-offices"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon className={classes.fontAwesome} icon={faBuilding} size="lg" />
              </ListItemIcon>
              <ListItemText primary="iMMAP Office" />
            </ListItem>
          )}
          {can('Set as Admin') && (
            <ListItem
              selected={indexUrl.indexOf('/dashboard/third-party') === 0}
              button
              component={Link}
              to="/dashboard/third-party"
            >
              <ListItemIcon className={classes.icon}>
                  <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary="Third Party" />
            </ListItem>
          )}
          {can('Set as Admin') && (
          <ListItem
            selected={indexUrl.indexOf('/reference-check') === 0}
            button
            component={Link}
            to="/reference-check"
          >
            <ListItemIcon className={classes.icon}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Reference Check" />
          </ListItem>
          )}
          {can('Index Setting') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/settings') === 0}
              component={Link}
              to="/dashboard/settings"
            >
              <ListItemIcon className={classes.icon}>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          )}
          {can('Manage Security Module') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/security-advisors') === 0}
              component={Link}
              to="/dashboard/security-advisors"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon icon={faUserShield} size="lg" className={classes.fontAwesome} />
              </ListItemIcon>
              <ListItemText primary="Security Advisors" />
            </ListItem>
          )}
          {(can('Manage Security Module') || can('Set as Admin')) && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/notify-travel') === 0}
              component={Link}
              to="/dashboard/notify-travel"
            >
              <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon icon={faBell} size="lg" className={classes.fontAwesome} />
              </ListItemIcon>
              <ListItemText primary="Notify Travel Settings" />
            </ListItem>
          )}
          {can('Set as Admin') && (
            <ListItem
              button
              selected={indexUrl.indexOf('/dashboard/risk-locations') === 0}
              component={Link}
              to="/dashboard/risk-locations"
            >
              <ListItemIcon className={classes.icon}>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Risk Locations" />
            </ListItem>
          )}
        </List>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  /**
   * openSidebar is a prop containing boolean data to show / close sidebar menu
   */
  openSidebar: PropTypes.bool.isRequired,
  /**
   * setHideSidebar is a redux action prop to hide left navigation menu when it's open
   */
  setHideSidebar: PropTypes.func.isRequired,
  /**
   * getRosterDashboard is a redux action prop to get all roster process data
   */
  getRosterDashboard: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * menu is a prop containing all roster process data to be shown on left navigation menu
   */
  menu: PropTypes.array.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  menu: state.rosterDashboard.rosterDashboard,
  openSidebar: state.web.openSidebar
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  setHideSidebar,
  getRosterDashboard
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
