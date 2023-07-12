/** import React, React.Component, PropTypes and Cookies */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

/** import Material UI withStyles, withWidth, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

/** import configuration value */
import { primaryColor } from '../../config/colors';

/** import custom components */
import CookieGroupConsentCard from './CookieGroupDialogCard';
import CookieCard from './CookieDialogCard';

/** import redux and it's actions */
import { connect } from 'react-redux';
import { setShowCookieConsent } from '../../redux/actions/common/CookieConsentActions';

// Define Cookies Data
const cookies = [
	{
		name: 'Essential Cookies',
		description: `These are used to maintain your identity or session on the website. These cookies are important to keep the website functioning appropriately.`,
		cookies: [
      {
        list: ['isNewUser', 'token', 'immap_careers_session', 'XSRF-TOKEN'],
        name: 'Authentication',
        details: 'These cookies store information about your current session on the site.'
      },
      {
        list: ['backToSecurity'],
        name: 'Navigation',
        details: 'These cookies save data that is used for a successful and smooth navigation.'
      },
      {
        list: ['apply-job-id', 'apply-job-cover-letter'],
        name: 'Job Application',
        details: 'These cookies store information about the latest job applied to provide direct access to it after registering or logging into the platform.'
      },
      {
        list: [ 'microsoft_refresh_token', 'microsoft_token_expire', 'microsoft_access_token'],
        name: 'Microsoft Graph',
        details: 'These cookies store information regarding the authentication with Microsoft for the consumption of services using Microsoft Graph.'
      }
    ],
		isEditable:  false,
		value: 'iMMAPCareersCookieConsent'
	},
	{
		name: 'Analytics Cookies',
		description: `These cookies monitor how visitors behave on the website. These are used in order to maintain our system up to date and continuously enhance our platform so that your experience is always better than the previous one.`,
		cookies: [
      {
        list: ['_ga', '_gat_gtag_UA_155978569_1', '_gid'],
        name: 'Google Analytics',
        details: 'These cookies store information that is used by the Google Analytics service to collect data regarding your current navigation experience.'}
    ],
		value: 'iMMAPCareersCookieConsentAnalytic'
	}
]

/**
 * Component for showing GDPR / Cookie Consent Banner
 *
 * Permission: -
 *
 * @name CookieConsent
 * @component
 * @category Common
 * @subcategory GDPR
 * @example
 * return (
 *    <CookieConsent
 *      cookieName: 'iMMAPCareersCookieConsent',
 *      cookieValue: true,
 *      expires: 365,
 *    />
 * )
 *
 */
class CookieConsent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
      analyticCookies: false,
			acceptedCookies: ['iMMAPCareersCookieConsent', 'iMMAPCareersCookieConsentAnalytic'],
			customizeDialog: false,
			selectedGroup: false
		};

		this.toogleAcceptCookies = this.toogleAcceptCookies.bind(this);
		this.acceptCookies = this.acceptCookies.bind(this);
		this.setSelectedGroup = this.setSelectedGroup.bind(this);
		this.rejectCookies = this.rejectCookies.bind(this);
	}

  /**
   * setSelectedGroup is a function to set selectedGroup
   * @param {boolean} group
   */
	setSelectedGroup(group) {
		this.setState({selectedGroup: group})
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		if (Cookies.get(this.props.cookieName) === undefined && this.props.showCookieConsent === false) {
			this.setState({ visible: true });
		} else {
			if (Cookies.get(this.props.cookieAnalyticName) === undefined) {
				this.setState({ acceptedCookies: ['iMMAPCareersCookieConsent'] });
			}
		}
	}

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
	componentDidUpdate(prevProps, prevState) {
		if(this.props.showCookieConsent && !this.state.visible) {
			this.setState({ visible: true });
		}
	}

  /**
   * toogleAcceptCookies is a function to set accepted cookies
   * @param {string[]} cookieValue - accepted
   */
	toogleAcceptCookies(cookieValue) {
		const { acceptedCookies } = this.state;
		const cookieList = acceptedCookies;
		if(cookieList.includes(cookieValue)) {
			cookieList.splice(cookieList.indexOf(cookieValue), 1);
		} else {
			cookieList.push(cookieValue);
		}
		this.setState({acceptedCookies: cookieList})
	}

  /**
   * rejectCookies is a function to reject cookies
   */
	rejectCookies() {
		const { cookieName, cookieValue, expires} = this.props;
		Cookies.set(cookieName, cookieValue, { expires: expires });
		if(this.props.setShowCookieConsent) this.props.setShowCookieConsent(false);
		this.setState({customizeDialog: false, visible: false})
	}

  /**
   * acceptCookies is a function to accept cookies
   */
	acceptCookies() {
		const { expires } = this.props;
		cookies.forEach(co => {
			Cookies.set(co.value, this.state.acceptedCookies.includes(co.value), { expires: expires });
		})
		if(this.props.setShowCookieConsent) this.props.setShowCookieConsent(false);
		this.setState({customizeDialog: false, visible: false});
	}

	render() {
		const { classes } = this.props;
		const { visible } = this.state;

		if (!visible) {
			return null;
		}

		return (
			<div id="cookie-consent-banner" className={classes.cookieConsent}>
				<Dialog
					open={visible}
					onClose={()=>{}}
					aria-labelledby="alert-dialog-title"
					fullWidth={true}
					disableEnforceFocus
					PaperProps={{ style: { overflow: 'visible' } }}
				>
					<DialogTitle id="scroll-dialog-title">Cookie Policy</DialogTitle>
					<DialogContent className={scroll === 'body' ? classes.overflowVisible : null} >
						<Typography variant="body1">
							<span className={classes.bodyLine}>
								When you visit any web site, it may store or retrieve information on your browser, mostly in the form of cookies.
								This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to.
								The information does not directly identify you, but it can give you a more personalized web experience.
							</span>
							<span className={classes.bodyLine}>
								Because we respect your right to privacy, you can choose not to allow some types of cookies.
								Click on the different category headings to find out more and change our default settings.
							</span>
							<span className={classes.bodyLine}>
								Your choices will be effective on this entire site. You can change your mind and revisit your
								preferences at any time by accessing the "Cookie Policy" link in the footer of this site.
							</span>
							<a href='/cookie-policy' target="_blank" className={classes.link}>
								<Typography variant="body1" color="primary">
									Learn more
								</Typography>
							</a>
						</Typography>
						<Typography variant='h3' className={classes.sectionTitle}>
							Manage Preferences
						</Typography>
						<div>
							{cookies.map(c => <CookieGroupConsentCard
												 toogleAcceptCookies={this.toogleAcceptCookies}
												 active={this.state.acceptedCookies.includes(c.value)}
												 key={c.name} title={c.name}
												 description={c.description}
												 isEditable={c.isEditable}
												 value={c.value}
												 setSelectedGroup={this.setSelectedGroup} />)}
						</div>
					</DialogContent>
					<DialogActions>
						<Button  color="secondary" variant="contained" onClick={this.rejectCookies}>
							Reject All
						</Button>
						<Button  color="primary" variant="contained" autoFocus onClick={this.acceptCookies}>
							Confirm My choices
						</Button>
					</DialogActions>
				</Dialog>
				{this.state.selectedGroup && <Dialog
					open={true}
					onClose={()=>{}}
					aria-labelledby="alert-dialog-title"
					fullWidth={true}
					disableEnforceFocus
					PaperProps={{ style: { overflow: 'visible' } }}
				>
					<DialogTitle id="scroll-dialog-title">
					<div className={classes.cookieHeader}>
						<ChevronLeft  onClick={()=>{
							this.setState({selectedGroup: false})
						}}  />
						<Typography
							variant="body1"
							className={classes.dialogTitle}
							onClick={() => {
								this.setState({ keyword: '' })
								this.props.resetFilter()
							}}
						>
							 {cookies.find(c => c.value === this.state.selectedGroup).name}
						</Typography>
					</div>
					</DialogTitle>
					<DialogContent className={scroll === 'body' ? classes.overflowVisible : null} >
						<div>
							{cookies.find(c =>c.value === this.state.selectedGroup).cookies.map(c =>
							 <CookieCard title={c.name} data={c.list} key={c.name} details={c.details}  />)}
						</div>
					</DialogContent>
					<DialogActions>
						<Button  color="primary" variant="contained" autoFocus onClick={()=>{
							this.setState({selectedGroup: false})
						}}>
							Close
						</Button>
					</DialogActions>
				</Dialog>}
			</div>
		);
	}
}

CookieConsent.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired,
  /**
   * cookieAnalyticName is a name of the Cookie we want to store on our browser
   */
   cookieAnalyticName: PropTypes.string,
  /**
   * cookieName is a name of the Cookie we want to store on our browser
   */
  cookieName: PropTypes.string,
  /**
   * cookieValue is a value that we saved on our Cookie
   */
  cookieValue: PropTypes.bool,
  /**
   * expires containing value of how many days we want to save the Cookie in the browser
   */
	expires: PropTypes.number,
  /**
   * showCookieConsent is a prop containing value to show Cookie Consent
   */
  showCookieConsent: PropTypes.bool.isRequired,
  /**
   * setShowCookieConsent is a prop containg a function to change showCookieConsent value
   */
  setShowCookieConsent: PropTypes.func.isRequired
};

CookieConsent.defaultProps = {
	cookieName: 'iMMAPCareersCookieConsent',
  cookieAnalyticName: 'iMMAPCareersCookieConsentAnalytic',
	cookieValue: true,
	expires: 365,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  setShowCookieConsent
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  showCookieConsent: state.cookieConsent.showCookieConsent
})

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	cookieConsent: {
		zIndex: '99999999',
		width: '100%',
		position: 'fixed',
		bottom: 0,
		left: 0,
		background: primaryColor
	},
	cookieHeader: {
		display: 'flex',
		marginTop: '0px',
		marginLeft: -5
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 15,
		marginBottom: 10
	},
	link: {
		textDecoration: 'none'
	},
	bodyLine: {
		display: 'block',
		marginTop: 5
	}
});

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CookieConsent)));
