import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { logoutUser } from '../../redux/actions/authActions';
import { toggleMobileMenu } from '../../redux/actions/webActions';
import { drawerWidth } from '../../config/web';
import isEmpty from '../../validations/common/isEmpty';
import { can } from '../../permissions/can';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const MobileMenu = ({
	classes,
	openMobileMenu,
	toggleMobileMenu,
	isAuthenticated,
	user,
	match,
	logoutUser,
	seeTravelLink,
	queryParams
}) => {
	let indexUrl = match.url;
	const securityActive =
		indexUrl == '/security' ||
			(indexUrl.indexOf('security') !== -1 && (indexUrl.indexOf('dom') !== -1 || indexUrl.indexOf('int') !== -1))
			? true
			: false;

	const [profileShowDrop, setProfileShowDrop] = React.useState(false);
	const [jobsShowDrop, setJobsShowDrop] = React.useState(false);
	const [travelShowDrop, setTravelShowDrop] = React.useState(false);
	const [talentPoolShowDrop, setTalentPoolShowDrop] = React.useState(false);


	return (
		<Drawer
			className={classes.drawer}
			variant="persistent"
			anchor="right"
			open={openMobileMenu}
			classes={{
				paper: classes.drawerPaper
			}}
		>
			<div className={classes.drawerHeader}>
				<IconButton onClick={toggleMobileMenu}>
					<ChevronRight />
				</IconButton>
			</div>
			<Divider />
			<List>
				{!isEmpty(user.data) && (
					<ListItem>
						<ListItemText secondary={'Hi ' + user.data.first_name + '!'} />
					</ListItem>
				)}
				{/*can('Dashboard Access') && (
					<ListItem
						selected={indexUrl.indexOf('/dashboard') === 0 ? true : false}
						button
						component={Link}
						to="/dashboard"
					>
						<ListItemText secondary="Dashboard" />
					</ListItem>
				)*/}

        {seeTravelLink && user.isIMMAPER && (
          <ListItem
            selected={(indexUrl.indexOf('/travel?travel=') === 0 && 'travel' in queryParams ? true : false) || (!securityActive && ((indexUrl.indexOf('dom') !== -1 || indexUrl.indexOf('int') !== -1)))}
            button
            component={Link}
            to="/travel?travel=all"
          >
            <ListItemText secondary="My Travel" />
            <ListItemSecondaryAction>
              {!travelShowDrop ? (
                <KeyboardArrowDownIcon
                  className={classes.arrowDropdown} onClick={() => setTravelShowDrop(true)} color='disabled' fontSize='small'
                />
              ) : (
                <KeyboardArrowUpIcon
                  className={classes.arrowDropdown} onClick={() => setTravelShowDrop()} color='disabled' fontSize='small'
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        )}

        {
          travelShowDrop
          && (
            <div>

              {isAuthenticated && user.isIMMAPER &&
                can('View Travel Dashboard') && (
                  <ListItem
                    selected={indexUrl.indexOf('/travel-dashboard') === 0 ? true : false}
                    button
                    component={Link}
                    to="/travel-dashboard?date=null"
                  >
                    <ListItemText secondary="Travel Calendar" className={classes.dropDownMenu} />
                  </ListItem>
                )}

              {isAuthenticated && user.isIMMAPER &&
                can('Approve Domestic Travel Request|Approve Global Travel Request|View Other Travel Request|View SBP Travel Request|View Only On Security Page') && (
                  <ListItem selected={securityActive} button component={Link} to="/security?tab=0&archiveTypes[]=latest" >
                    <ListItemText secondary="Travel Requests" className={classes.dropDownMenu} />
                  </ListItem>
                )}

            </div>

          )
        }

        {isAuthenticated && (
          <ListItem
            selected={indexUrl.indexOf('/profile') === 0 ? true : false}
            button
            component={Link}
            to="/profile"
          >
            <ListItemText secondary="My Profile" />
            <ListItemSecondaryAction>
              {!profileShowDrop ? (
                <KeyboardArrowDownIcon
                  className={classes.arrowDropdown} onClick={() => setProfileShowDrop(true)} color='disabled' fontSize='small'
                />
              ) : (
                <KeyboardArrowUpIcon
                  className={classes.arrowDropdown} onClick={() => setProfileShowDrop()} color='disabled' fontSize='small'
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        )}

        {
          profileShowDrop
          && (
            <div>
              {isAuthenticated && (
                <ListItem
                  selected={indexUrl.indexOf('/job-applications') === 0 ? true : false}
                  button
                  component={Link}
                  to="/job-applications"
                >
                  <ListItemText secondary="My Applications" className={classes.dropDownMenu} />
                </ListItem>
              )}

            </div>

          )
        }

        {isAuthenticated && (
          <ListItem selected={indexUrl.indexOf('/jobs') === 0 ? true : false} button component={Link} to="/jobs">
            <ListItemText secondary="Jobs" />
            <ListItemSecondaryAction>
              {!jobsShowDrop ? (
                <KeyboardArrowDownIcon
                  className={classes.arrowDropdown} onClick={() => setJobsShowDrop(true)} color='disabled' fontSize='small'
                />
              ) : (
                <KeyboardArrowUpIcon
                  className={classes.arrowDropdown} onClick={() => setJobsShowDrop()} color='disabled' fontSize='small'
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        )}

        {
          isAuthenticated && jobsShowDrop
          && (
            <div>

              {isAuthenticated && user.isIMMAPER &&
                can('Index ToR') && (
                  <ListItem
                    selected={indexUrl.indexOf('/tor') === 0 ? true : false}
                    button
                    component={Link}
                    to="/tor"
                  >
                    <ListItemText secondary="ToR" className={classes.dropDownMenu}/>
                  </ListItem>
                )}
            </div>
          )
        }

        { isAuthenticated === true && can('See Completed Profiles') && user.isIMMAPER && (
          <ListItem selected={indexUrl.indexOf('/all-profiles') === 0 ? true : false} button component={Link} to="/all-profiles/talent-pool">
            <ListItemText secondary="Talent Pool" />
            <ListItemSecondaryAction>
              {!talentPoolShowDrop ? (
                <KeyboardArrowDownIcon
                  className={classes.arrowDropdown} onClick={() => setTalentPoolShowDrop(true)} color='disabled' fontSize='small'
                />
              ) : (
                <KeyboardArrowUpIcon
                  className={classes.arrowDropdown} onClick={() => setTalentPoolShowDrop()} color='disabled' fontSize='small'
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        )}

        {
          isAuthenticated && talentPoolShowDrop
          && (
            <div>

                {isAuthenticated && user.isIMMAPER &&
                  can('Index Roster') && (
                    <ListItem
                      selected={indexUrl.indexOf('/roster') === 0 ? true : false}
                      button
                      component={Link}
                      to="/roster"
                    >
                      <ListItemText secondary="Roster" className={classes.dropDownMenu} />
                    </ListItem>
                )}
            </div>
          )
        }

				{isAuthenticated === true &&
					can('Show Repository') &&
					user.isIMMAPER && (
						<ListItem
							selected={indexUrl.indexOf('/policy-repository') === 0 ? true : false}
							button
							component={Link}
							to="/policy-repository"
						>
							<ListItemText secondary="Policy" />
						</ListItem>
					)}

				{isAuthenticated !== true && (
					<ListItem
						selected={indexUrl.indexOf('/login') === 0 ? true : false}
						button
						component={Link}
						to="/login"
					>
						<ListItemText secondary="Login" />
					</ListItem>
				)}

				{isAuthenticated !== true && (
					<ListItem
						selected={indexUrl.indexOf('/register') === 0 ? true : false}
						button
						component={Link}
						to="/register"
					>
						<ListItemText secondary="Register" />
					</ListItem>
				)}
				{isAuthenticated === true && (
					<ListItem
						button
						component={Link}
						to="#"
						onClick={(e) => {
							e.preventDefault();
							logoutUser();
						}}
					>
						<ListItemText secondary="Logout" />
					</ListItem>
				)}
			</List>
		</Drawer>
	);
};

MobileMenu.defaultProps = {
	openMobileMenu: false
};

MobileMenu.propTypes = {
	toggleMobileMenu: PropTypes.func.isRequired,
	logoutUser: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	openMobileMenu: PropTypes.bool.isRequired,
	isAuthenticated: PropTypes.bool,
	user: PropTypes.object,
	queryParams: PropTypes.object
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	toggleMobileMenu,
	logoutUser
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	user: state.auth.user,
	isAuthenticated: state.auth.isAuthenticated,
	openMobileMenu: state.web.openMobileMenu
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerHeader: {
		...theme.mixins.toolbar,
		justifyContent: 'flex-start',
		display: 'flex',
		alignItems: 'center',
		padding: '6px 8px',
		minHeight: `${(theme.spacing.unit * 8) - 1}px !important`
	},
	dropDownMenu: {
		marginLeft: '20px'
	},
  arrowDropdown: {
    paddingLeft: theme.spacing.unit * 2 - (theme.spacing.unit / 2),
    paddingRight: theme.spacing.unit * 2 - (theme.spacing.unit / 2)
  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MobileMenu));
