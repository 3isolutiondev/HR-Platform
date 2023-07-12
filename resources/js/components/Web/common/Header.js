/** import React, Component, classname, query string, React Router and PropTypes*/
import React, { Component } from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/** import React Redux and it's actions */
import { logoutUser } from '../redux/actions/authActions';
import { connect } from 'react-redux';
import { setOpenSidebar, toggleMobileMenu } from '../redux/actions/webActions';
import { resetFilter } from '../redux/actions/jobs/jobFilterActions';
import { onChange } from '../redux/actions/jobs/jobTabActions';

/** import Material UI withStyles, withTheme, components and icons */
import { withStyles, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from '@material-ui/core/Icon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


/** import logo, configuration value, validation helper and permission checker */
import mainLogo from '../../../../img/immap-career-logo.png';
import { primaryColor, white } from '../config/colors';
import { drawerWidth } from '../config/web';
import isEmpty from '../validations/common/isEmpty';
import { can } from '../permissions/can';


/** import custom components */
import MobileMenu from './menu/mobileMenu';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => {
	const css = {
		root: {
			flexGrow: 1,
			position: 'sticky',
			top: 0,
			zIndex: 10
		},
		appBar: {
			backgroundColor: white,
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			}),
			boxShadow: 'none',
			borderBottom: '1px solid #e6e6e6'
		},
		appBarShift: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen
			})
		},
		menuButton: {
			marginLeft: 12,
			marginRight: 20
		},
		hide: {
			display: 'none'
		},
		logo: {
			flexGrow: 1
		},
		navSeparator: {
			marginLeft: '8px',
			marginRight: '8px',
			fontSize: '1rem',
			paddingTop: '25px',
			paddingBottom: '25px',
		},
		navMenu: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			paddingLeft: '8px',
			paddingRight: '8px',
			paddingTop: '25px',
			paddingBottom: '25px',
			fontSize: '1rem',
			cursor: 'pointer',
			'text-decoration': 'none',
			'&:hover': {
				'border-bottom': '2px solid ' + primaryColor
			},
			'& > p': {
				fontSize: '1rem'
			}
		},

		dropdown_menu: {
			top: '60px',
			backgroundColor: 'white',
			listStyleType: 'none',
			padding: '0',
			backgroundColor: '#f9f9f9',
			position: 'absolute',
			cursor: 'pointer',
			boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.2)',
		},
		navDropMenu: {
			display: 'grid',
			paddingLeft: '15px',
			paddingRight: '50px',
			paddingTop: '10px',
			paddingBottom: '10px',
			textDecoration: 'none',
			fontSize: '1rem',
			cursor: 'pointer',
			'text-decoration': 'none',
			'&:hover': {
				'border-bottom': '2px solid ' + primaryColor
			},
			'& > p': {
				fontSize: '1rem'
			}
		},
		navMenuTitle: {
			display: 'flex',
		},
		sideMenuBtn: {
			cursor: 'pointer !important',
			marginRight: theme.spacing.unit * 2
		},
		mobileMenuBtn: {
			cursor: 'pointer !important'
		},
		activeMenu: {
			'border-bottom': '2px solid ' + primaryColor
		},
		textLogo: {
			display: 'inline-block',
			'vertical-align': 'middle',
			'font-weight': 'bold',
			color: primaryColor,
			'margin-top': theme.spacing.unit / 2 * -1
		},
		imgLogo: {
			display: 'inline-block',
			'vertical-align': 'middle',
			padding: '0.5em'
		},
		logoLink: {
			'text-decoration': 'none',
			'white-space': 'nowrap'
		},
		menuContainer: {
			display: 'flex'
		}
	};
	return css;
};

/**
 * Header (Navbar) Component. It contains iMMAP Careers logo and navigation
 *
 * @name Header
 * @component
 * @category Common
 * @subcategory Navigation
 * @example
 *  return (
 *    <Header {...props} />
 *  )
 *
 */
class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			browserWidth: 0,
			dashboardWith: 200,
			dashboardBtnWidth: 40,
			logoWidth: 248,
			navWidth: 0,
			is_mobile_menu: false,
			profileShowDrop: false,
			jobsShowDrop: false,
			travelShowDrop: false,
			talentPoolShowDrop: false
		};

		this.menuContainer = React.createRef();
		this.logo = React.createRef();
		this.dashboardBtn = React.createRef();

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.logout = this.logout.bind(this);
		this.profileMenuShowDrop = this.profileMenuShowDrop.bind(this);
	}


	/**
	 * componentDidMount is a lifecycle function called where the component is mounted
	 * It will call a function to detect window width when component mounted
	 */
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	/**
	 * componentDidUpdate is a lifecycle function called where the component is updated
	 * It will call a function to detect window width when there is a prop or a state value is changed
	 * @param {object} prevProps - previous props state
	 * @param {object} prevState - previous state
	 */
	componentDidUpdate(prevProps, prevState) {
		if (prevState.browserWidth == 0 && this.state.browserWidth != 0) {
			this.updateWindowDimensions();
		}

		if (this.props.openSidebar !== prevProps.openSidebar) {
			this.updateWindowDimensions();
		}
	}

	/**
	 * componentWillUnmount is a lifecycle function callled where the component will unmount
	 * It will run remove event listener for detecting window with (decide is it mobile or not)
	 */
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	/**
   * updateWindowDimensions is a function to detect window width to detect is mobile or not
   */
	updateWindowDimensions() {
		let update = {
			browserWidth: window.innerWidth
		};

		if (!isEmpty(this.menuContainer.current)) {
			update.navWidth = this.menuContainer.current.offsetWidth;
		}

		this.setState(update, () => {
			const { browserWidth, logoWidth, dashboardBtnWidth, navWidth, dashboardWith } = this.state;

			let tempBrowserWidth = browserWidth;
			if (!isEmpty(localStorage.openSidebar)) {
				if (localStorage.openSidebar == 'true') {
					tempBrowserWidth = browserWidth - dashboardWith;
				} else {
					tempBrowserWidth = browserWidth;
				}
			}

			this.setState({
				is_mobile_menu: tempBrowserWidth - (logoWidth + dashboardBtnWidth + 50) <= navWidth ? true : false
			});
		});
	}

	/**
	 * logout is a function to logout user
	 * @param {event} e
	 */
	logout(e) {
		e.preventDefault();
		this.props.logoutUser();
	}

	/**
	* profileMenuShowDrop is a function to toggle the dropdown menu
	* @param {('travelShowDrop'|'profileShowDrop'|'jobsShowDrop'|'talentPoolShowDrop')} stateName
	*/
	profileMenuShowDrop(show) {
		this.setState({
			[show]: !this.state[show],
		});
	}


	/**
	 * Render the component
	 */
	render() {
		let { user, classes, auth, openSidebar, ...otherProps } = this.props;
		let indexUrl = this.props.match.url;
		const queryParams = queryString.parse(this.props.location.search);

		const securityActive =
			indexUrl == '/security' ||
				(indexUrl.indexOf('security') !== -1 && (indexUrl.indexOf('dom') !== -1 || indexUrl.indexOf('int') !== -1))
				? true
				: false;

		const { is_mobile_menu } = this.state;

		const dashboardAccess = can('Dashboard Access') && user.isIMMAPER;

		const seeTravelLink =
			auth.isAuthenticated === true && can('Can Make Travel Request') && user.isIMMAPER ? true : false;



		return (
			<div>
				<AppBar
					color="default"
					className={classnames(classes.appBar, {
						[classes.appBarShift]: openSidebar
					})}
					ref={this.navWidth}
				>
					<Toolbar>
						{dashboardAccess && (
							<Icon
								color="secondary"
								onClick={this.props.setOpenSidebar}
								className={classnames(classes.sideMenuBtn, openSidebar && classes.hide)}
								ref={this.dashboardBtn}
							>
								<MenuIcon />
							</Icon>
						)}
						<div className={classes.logo}>
							<Link
								onClick={() => {
									this.props.resetFilter();
									this.props.onChange({ tab: 0, page: '1' });
								}}
								to="/"
								className={classes.logoLink}
								ref={this.logo}
							>
								<img src={mainLogo} width="69" height="60" alt="immap careers" className={classes.imgLogo} />{' '}
								<Typography variant="h5" className={classes.textLogo}>
									iMMAP Careers
								</Typography>
							</Link>
						</div>
						{is_mobile_menu ? (
							<Icon
								color="secondary"
								onClick={this.props.toggleMobileMenu}
								className={classnames(classes.mobileMenuBtn, openSidebar && classes.hide)}
							>
								<MenuIcon />
							</Icon>
						) : (
							<div className={classes.menuContainer} ref={this.menuContainer}>
								{!isEmpty(user.data) && (
									<Typography color="secondary" className={classes.navSeparator}>
										Hi {user.data.first_name}!
									</Typography>
								)}



								<div onMouseEnter={() => this.profileMenuShowDrop("travelShowDrop")} onMouseLeave={() => this.profileMenuShowDrop("travelShowDrop")}>

									{seeTravelLink && (
										<Link
											to="/travel?travel=all"
											className={
												(indexUrl === '/travel' && 'travel' in queryParams) ||
													(indexUrl.indexOf('security') === -1 && ((indexUrl.indexOf('dom') !== -1 || indexUrl.indexOf('int') !== -1))) ? (
													classnames(classes.navMenu, classes.activeMenu)
												) : (
													classes.navMenu
												)
											}
										>
											<Typography color="secondary" className={classes.navMenuTitle}>My Travel<KeyboardArrowDownIcon /></Typography>
										</Link>
									)}

									{
										this.state.travelShowDrop
										&& (
											<ul className={classes.dropdown_menu}>
												<li>
													{auth.isAuthenticated === true && user.isIMMAPER &&
														can('View Travel Dashboard') && (
															<Link
																to="/travel-dashboard?date=null"
																className={
																	indexUrl === '/travel-dashboard' ? (
																		classnames(classes.navDropMenu, classes.activeMenu)
																	) : (
																		classes.navDropMenu
																	)
																}
															>
																<Typography color="secondary">Travel Calendar</Typography>
															</Link>
														)}
												</li>


												<li>
													{auth.isAuthenticated === true && user.isIMMAPER &&
														can('Approve Domestic Travel Request|Approve Global Travel Request|View Other Travel Request|View SBP Travel Request|View Only On Security Page') && (
															<Link
																to="/security?tab=0&archiveTypes[]=latest"
																className={
																	securityActive ? (
																		classnames(classes.navDropMenu, classes.activeMenu)
																	) : (
																		classes.navDropMenu
																	)
																}
															>
																<Typography color="secondary">Travel Requests</Typography>
															</Link>
														)}
												</li>
											</ul>
										)
									}
								</div>


								<div onMouseEnter={() => this.profileMenuShowDrop("profileShowDrop")} onMouseLeave={() => this.profileMenuShowDrop("profileShowDrop")}>

									{auth.isAuthenticated === true && (
										<Link
											to="/profile"
											className={
												indexUrl === '/profile' ? (
													classnames(classes.navMenu, classes.activeMenu)
												) : (
													classes.navMenu
												)
											}
										>
											<Typography color="secondary" className={classes.navMenuTitle}>My Profile<KeyboardArrowDownIcon /></Typography>
										</Link>
									)}
									{
										this.state.profileShowDrop
										&& (
											<ul className={classes.dropdown_menu}>
												<li>
													{auth.isAuthenticated === true && (
														<Link
															to="/job-applications"
															className={
																indexUrl === '/job-applications' ? (
																	classnames(classes.navDropMenu, classes.activeMenu)
																) : (
																	classes.navDropMenu
																)
															}
														>
															<Typography color="secondary">My Applications</Typography>
														</Link>
													)}
												</li>

											</ul>
										)}
								</div>


								<div onMouseEnter={() => this.profileMenuShowDrop("jobsShowDrop")} onMouseLeave={() => this.profileMenuShowDrop("jobsShowDrop")}>
									{auth.isAuthenticated === true && (

										<Link
											onClick={() => this.props.resetFilter()}
											to="/jobs"
											className={
												indexUrl.indexOf('/jobs') === 0 ? (
													classnames(classes.navMenu, classes.activeMenu)
												) : (
													classes.navMenu
												)
											}
										>
											<Typography color="secondary" className={classes.navMenuTitle}>Jobs<KeyboardArrowDownIcon /></Typography>
										</Link>
									)}
									{
										this.state.jobsShowDrop
										&& (
											<ul className={classes.dropdown_menu}>
												<li>
													{auth.isAuthenticated === true && user.isIMMAPER &&
														can('Index ToR') && (
															<Link
																to="/tor"
																className={
																	indexUrl.indexOf('/tor') === 0 ? (
																		classnames(classes.navDropMenu, classes.activeMenu)
																	) : (
																		classes.navDropMenu
																	)
																}
															>
																<Typography color="secondary">ToR</Typography>
															</Link>
														)}
												</li>
											</ul>
										)}
								</div>

								<div onMouseEnter={() => this.profileMenuShowDrop("talentPoolShowDrop")} onMouseLeave={() => this.profileMenuShowDrop("talentPoolShowDrop")}>

									{auth.isAuthenticated === true && can('See Completed Profiles') && user.isIMMAPER && (
										<Link
											to="/all-profiles/talent-pool"
											className={
												indexUrl === '/all-profiles/talent-pool' ? (
													classnames(classes.navMenu, classes.activeMenu)
												) : (
													classes.navMenu
												)
											}
											>
											<Typography color="secondary" className={classes.navMenuTitle}>Talent Pool<KeyboardArrowDownIcon /></Typography>
										</Link>
									)}
									{
										this.state.talentPoolShowDrop
										&& (
											<ul className={classes.dropdown_menu}>
												<li>
													{auth.isAuthenticated === true && user.isIMMAPER && can('View Surge Overview') &&
															<Link
																to="/surge-roster-deployment-dashboard"
																className={
																	indexUrl === '/surge-roster-deployment-dashboard' ? (
																		classnames(classes.navDropMenu, classes.activeMenu)
																	) : (
																		classes.navDropMenu
																	)
																}
															>
																<Typography color="secondary">Surge Overview</Typography>
															</Link>
													}
												</li>
												<li>
													{auth.isAuthenticated === true && user.isIMMAPER &&
														can('Index Roster') && (
															<Link
																to="/roster"
																className={
																	indexUrl === '/roster' ? (
																		classnames(classes.navDropMenu, classes.activeMenu)
																	) : (
																		classes.navDropMenu
																	)
																}
															>
																<Typography color="secondary">Roster</Typography>
															</Link>
														)}
												</li>
											</ul>
										)}
								</div>

								{auth.isAuthenticated === true &&
									can('Show Repository') &&
									user.isIMMAPER && (
										<Link
											to="/policy-repository"
											className={
												indexUrl.indexOf('/policy-repository') === 0 ? (
													classnames(classes.navMenu, classes.activeMenu)
												) : (
													classes.navMenu
												)
											}
										>
											<Typography color="secondary">Policy</Typography>
										</Link>
									)}


								{auth.isAuthenticated !== true && (
									<Link to="/login" className={classes.navMenu}>
										<Typography color="secondary">Login</Typography>
									</Link>
								)}
								{auth.isAuthenticated !== true && (
									<Typography color="secondary" className={classes.navSeparator}>
										{' '}
										|{' '}
									</Typography>
								)}
								{auth.isAuthenticated !== true && (
									<Link to="/register" className={classes.navMenu}>
										<Typography color="secondary">Register</Typography>
									</Link>
								)}
								{auth.isAuthenticated === true && (
									<Link to="#" className={classes.navMenu} onClick={this.logout}>
										<Typography color="secondary">Logout</Typography>
									</Link>
								)}
							</div>
						)}
					</Toolbar>
					{is_mobile_menu && (
						<MobileMenu seeTravelLink={seeTravelLink} queryParams={queryParams} {...otherProps} />
					)}
				</AppBar>
			</div>
		);
	}
}

Header.propTypes = {
	/**
	 * auth is an object containing authentication data
	 */
	auth: PropTypes.object.isRequired,
	/**
	 * user is an object containing user data
	 */
	user: PropTypes.object.isRequired,
	/**
	 * logoutUser is a function that will run when the user clicked the logout button
	 */
	logoutUser: PropTypes.func.isRequired,
	/**
	 * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
	 * (see the source file to see more information about the styles)
	 */
	classes: PropTypes.object.isRequired,
	/**
	 * openSidebar is a boolean value that containing value to show or hide the left side navigation
	 */
	openSidebar: PropTypes.bool.isRequired,
	/**
	 * setOpenSidebar is a function to change openSidebar value
	 */
	setOpenSidebar: PropTypes.func.isRequired,
	/**
	 * resetFilter is a function to reset filter on the home page
	 */
	resetFilter: PropTypes.func.isRequired,
	/**
	 * toggleMobileMenu is a function to show or hiding the mobile menu
	 */
	toggleMobileMenu: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	user: state.auth.user,
	auth: state.auth,
	openSidebar: state.web.openSidebar,
	openMobileMenu: state.web.openMobileMenu
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	logoutUser,
	setOpenSidebar,
	toggleMobileMenu,
	resetFilter,
	onChange
};

export default withTheme()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header)));
