/** import React and PropTypes */
import React from 'react';
import PropTypes from 'prop-types';

/** import Material UI and it's component */
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

/** import configuration value */
import { primaryColor, secondaryColor } from '../config/colors';

/** import redux and it's actions */
import { connect } from 'react-redux';
import { setShowCookieConsent } from '../redux/actions/common/CookieConsentActions';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	title: {
		fontSize: '2.25rem',
		textAlign: 'center'
	},
	subtitle: {
		fontSize: '1.25rem',
		fontWeight: 'bold'
	},
	subsubtitle: {
		fontSize: '1.15rem',
		fontWeight: 'bold'
	},
	content: {
		color: secondaryColor,
		fontFamily: "'Barlow', sans-serif",
		border: '1px solid' + primaryColor,
		borderRadius: theme.spacing.unit,
		padding: theme.spacing.unit / 2 + 'px ' + theme.spacing.unit * 2 + 'px',
		marginTop: theme.spacing.unit * 3,
		margin: '0 auto',
		[theme.breakpoints.up('md')]: {
			width: '60%'
		},
		[theme.breakpoints.only('sm')]: {
			width: '80%'
		},
		[theme.breakpoints.only('xs')]: {
			width: '90%'
		}
	},
	link: {
		color: primaryColor,
		cursor: 'pointer'
	}

});

const CookiePolicy = ({ classes, setShowCookieConsent }) => (
	<div>
		<Typography variant="h1" className={classes.title} color="primary">
			Cookie Policy
		</Typography>
		<div className={classes.content}>
			<h2 className={classes.subtitle}>About this Cookie Policy</h2>
			<p>
				This Cookie Policy states why and how iMMAP uses cookies and similar technologies when you visit our
				website at{' '}
				<a href="https://careers.immap.org" className={classes.link}  target="_blank">
					https://careers.immap.org
				</a>. It explains what these technologies are and why we use them, as well as your rights to control our
				use of them.
				<b />
			</p>
			<h2 className={classes.subtitle}>1. What are cookies?</h2>
			<p>
				Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies
				are widely used by website owners in order to make their websites work, or work more efficiently, as
				well as to provide reporting information.
			</p>
			<p>
				Cookies set by the website you are visiting are called "first party cookies". In addition, a website may
				potentially use external services, that also set their own cookies, known as "third party cookies".
			</p>
			<p>
				Third party cookies enable third party features or functionalities through the website (e.g. like
				advertising, interactive content and analytics).
			</p>
			<h2 className={classes.subtitle}>2. Our use of cookies</h2>
			<p>We may collect information automatically when you visit the website by using cookies.</p>
			<p>
				Cookies allow us to identify your computer and find out which topic caught your attention the most
				during your last visit. The objective is to enhance each of your experiences on our website and online
				tool.
			</p>
			<p>
				In compliance with our GDPR Policy, you can choose, below, to disable cookies collection. If you do, we
				cannot guarantee that your experience will be as good as if you allowed cookies.
			</p>
			<p>
				The information collected by cookies does not personally identify you; it includes general information
				about your computer settings, your connection to the Internet e.g. operating system and platform, IP
				address, your browsing patterns and timings of browsing on the website and your location.
			</p>
			<p>
				Most browsers accept cookies automatically, but you can change the settings of your browser to erase
				cookies or prevent automatic acceptance.
			</p>
			<p>
				For your information, if you turn off cookies in your browser then these settings will apply to all
				websites, not just this one.
			</p>
			<h2 className={classes.subtitle}>3. Types of cookie that may be used during your visit to the Website</h2>
			<p>The following types of cookies are used on this site.</p>
			<p>For a detailed list of all the cookies and their names, please see the next section.</p>
			<h3 className={classes.subsubtitle}>3.1. Essential Cookies</h3>
			<p>
				These are used to maintain your identity or session on the website. These cookies are important to keep
				the website functioning appropriately.
			</p>
			<p>
				These cookies cannot be turned off individually but you can change your browser settings to refuse all
				cookies. However, note that doing this will affect your user experience on the website.
			</p>
			<h3 className={classes.subsubtitle}>3.2. Analytics Cookies</h3>
			<p>
				These cookies monitor how visitors behave on the website. These are used in order to maintain our
				system up to date and continuously enhance our platform so that your experience is always better than
				the previous one.
			</p>
			<p>
				This website uses <b>Google Analytics</b> for analytics cookies.
			</p>
			<h2 className={classes.subtitle}>4. Control the use of our cookies</h2>
			<p>We provide a detailed list of the cookies we use as well as the ability to enable and disable them, with
			the exception of the Essential Cookies, as they are always active to ensure the correct functioning of our site.</p>
			<p>To access the area where to customize your cookies settings, please click{" "}
				<span onClick={()=>{
						setShowCookieConsent(true);
				}} className={classes.link}>here</span>{"."}
			</p>
		</div>
	</div>
);

CookiePolicy.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
   classes: PropTypes.object.isRequired,
  /**
   * setShowCookieConsent is a prop containg a function to change showCookieConsent value
   */
   setShowCookieConsent: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  setShowCookieConsent
}

export default withStyles(styles)(connect("", mapDispatchToProps)(CookiePolicy));
