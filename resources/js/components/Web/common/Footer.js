/** import React, PropTypes, classnames, moment and React Router Link */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';

/** import Material UI withStyles and components */
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

/** import Fontawesome icons */
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/** import image and configuration value */
import immap from '../../../../img/iMMAP-logostrapline_transparent-copy.png';
import { primaryColor, white } from '../config/colors';

/** import redux and it's actions */
import { connect } from 'react-redux';
import { setShowCookieConsent } from '../redux/actions/common/CookieConsentActions';

// whoWeAre data (it will show on footer of the page)
const whoWeAre = [
	{ title: 'Home', link: '/', external: false },
	{ title: 'Contact Us', link: 'https://mywebsite.org/contact-us/', external: true },
	{ title: 'Locations', link: 'https://mywebsite.org/where-we-work/', external: true },
	{ title: 'History', link: 'https://mywebsite.org/history-timeline/', external: true },
	{ title: 'Team', link: 'https://mywebsite.org/meet-the-team/', external: true },
	{ title: 'Careers', link: 'https://mywebsite.org/careers/', external: true },
	{ title: 'Photo Credits', link: 'https://mywebsite.org/credits/', external: true },
	{ title: 'Cookie Policy', link: 'none', dialog: true}
];

// whatWeDo data (it will show on footer of the page)
const whatWeDo = [
	{ title: 'About Us', link: 'https://mywebsite.org/who-we-are/', external: true },
	{ title: 'Our Service', link: 'https://mywebsite.org/our-service/', external: true },
	{ title: 'Partnerships', link: 'https://mywebsite.org/our-partners/', external: true },
	{ title: 'Portofolio', link: 'https://mywebsite.org/products/', external: true },
	{ title: 'Success Stories', link: 'https://mywebsite.org/our-success-stories/', external: true },
	{ title: 'Latest News', link: 'https://mywebsite.org/latest-news/', external: true },
	{ title: 'Donate', link: 'https://mywebsite.org/donate/', external: true }
];

/**
 * Footer component for showing navigation to iMMAP website, iMMAP logo, and iMMAP social media
 *
 * @name Footer
 * @component
 * @category Common
 * @subcategory Footer
 * @example
 *  return(
 *    <Footer />
 *  )
 *
 */
const Footer = ({ classes, setShowCookieConsent }) => {
	return <div>
		<div className={classes.aboutiMMAPRow}>
			<div className={classes.aboutiMMAPContainer}>
				<Grid container spacing={16}>
					<Grid item xs={12} sm={12} md={4} lg={4}>
						<div className={classes.imagesWorld} />
					</Grid>
					<Grid item xs={12} sm={12} md={4} lg={4}>
						<Grid container spacing={0}>
							<Grid item xs={12} sm={6}>
								<Typography variant="body2" className={classes.title}>
									Who we are
								</Typography>
								{whoWeAre.map((dt, index) => (
									<Typography key={index} variant="body2" className={classes.menu}>
										{dt.external ? (
											<a href={`${dt.link}`} className={classes.linked}>
												{dt.title}
											</a>
										) : (
											<Link to={dt.link} onClick={e =>{
												if(dt.dialog) {
													e.preventDefault();
													setShowCookieConsent(true);
												}
											}} className={classes.linked}>
												{dt.title}
											</Link>
										)}
									</Typography>
								))}
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="body2" className={classes.title}>
									What we do
								</Typography>
								{whatWeDo.map((dt, index) => (
									<Typography key={index} variant="body2" className={classes.menu}>
										{dt.external ? (
											<a href={`${dt.link}`} className={classes.linked}>
												{dt.title}
											</a>
										) : (
											<Link to={dt.link} className={classes.linked}>
												{dt.title}
											</Link>
										)}
									</Typography>
								))}
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={12} md={4} lg={4}>
						<Typography variant="body2" className={classes.title}>
							About iMMAP
						</Typography>

						<Typography variant="body2" className={classes.iMMAPDesc}>
							iMMAP is an international not-for-profit organization
						</Typography>
						<Grid item xs={12} className={classes.socMedContainer}>
							<a
								href={`https://www.facebook.com/immap.org/`}
								className={classnames(classes.socialMedia, classes.facebookHover)}
							>
								<FontAwesomeIcon
									icon={faFacebookF}
									size="xs"
									className={classnames(classes.icon, classes.facebook)}
								/>
							</a>
							<a
								href={`https://twitter.com/iMMAP_org/`}
								className={classnames(classes.socialMedia, classes.twitterHover)}
							>
								<FontAwesomeIcon
									icon={faTwitter}
									size="xs"
									className={classnames(classes.icon, classes.twitter)}
								/>
							</a>
							<a
								href={`https://www.youtube.com/channel/UCZgOvNTt3HbztQ60tOq-d7g/`}
								className={classnames(classes.socialMedia, classes.youtubeHover)}
							>
								<FontAwesomeIcon
									icon={faYoutube}
									size="xs"
									className={classnames(classes.icon, classes.youtube)}
								/>
							</a>
							<a
								href={`https://www.linkedin.com/company/immap`}
								className={classnames(classes.socialMedia, classes.linkedinHover)}
							>
								<FontAwesomeIcon
									icon={faLinkedin}
									size="xs"
									className={classnames(classes.icon, classes.linkedin)}
								/>
							</a>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</div>

		<Grid container spacing={24} className={classes.footerContainer}>
			<Grid item xs={12}>
				<div className={classes.footer}>
					<Typography variant="body2" className={classes.copyright}>
						© Copyright {moment().format('YYYY')}. All Rights Reserved.
					</Typography>
				</div>
			</Grid>
		</Grid>
	</div>
};

Footer.propTypes = {
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

const heightDefault = 50;

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	socMedContainer: {
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	},
	socialMedia: {
		position: 'relative',
		background: 'transparent',
		height: '27px',
		margin: '0 5px',
		width: '27px',
		borderRadius: '50%',
		display: 'inline-block',
		textAlign: 'center',
		verticalAlign: 'middle',

		border: '1px solid #828282',
		'&:hover > svg': {
			color: '#fff'
		}
	},
	facebookHover: {
		'margin-left': 0,
		'&:hover': {
			background: '#3b5998',
			borderColor: '#3b5998'
		}
	},
	twitterHover: {
		'&:hover': {
			background: '#3b8aca',
			borderColor: '#3b8aca'
		}
	},
	youtubeHover: {
		'&:hover': {
			background: '#cc181e',
			borderColor: '#cc181e'
		}
	},
	linkedinHover: {
		'&:hover': {
			background: '#0077b5',
			borderColor: '#0077b5'
		}
	},
	imagesWorld: {
		background: 'url(' + immap + ')',
		height: heightDefault + 'px',
		width: '250px',
		position: 'relative',
		backgroundSize: 'cover',
		[theme.breakpoints.down('sm')]: {
			margin: '0 auto'
		}
	},
	title: {
		display: 'block',
		marginBottom: 'calc(' + theme.spacing.unit * 3 + 'px - 2px)',
		fontWeight: 500,
		fontSize: theme.spacing.unit * 2,
		fontFamily: "'Barlow Condensed', sans-serif",
		color: '#4c4c4c',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	},
	linked: {
		color: '#696969',
		textDecoration: 'none'
	},
	icon: {
		color: '#585858',
		position: 'absolute',
		left: '50%',
		top: '50%'
	},
	facebook: {
		marginLeft: '-4px',
		marginTop: '-6px',
		height: '12px',
		width: '8px'
	},
	twitter: {
		marginLeft: '-6px',
		marginTop: '-5px',
		height: '10px',
		width: '12px'
	},
	youtube: {
		marginLeft: '-7px',
		marginTop: '-5px',
		height: '10px',
		width: '14px'
	},
	linkedin: {
		marginLeft: '-6px',
		marginTop: '-6px',
		height: '12px',
		width: '12px'
	},
	menu: {
		color: '#696969',
		'&:hover $linked': {
			color: primaryColor
		},
		opacity: '0.' + theme.spacing.unit,
		marginBottom: 'calc(' + theme.spacing.unit + 'px - 1px)',
		fontSize: 'calc(' + theme.spacing.unit * 2 + 'px - 3px)',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	},
	iMMAPDesc: {
		color: '#4c4c4c',
		boxSizing: 'border-box',
		letterSpacing: '0.5px',
		lineHeight: '20px',
		'text-size-adjust': '100%',
		opacity: '0.' + theme.spacing.unit,
		fontSize: 'calc(' + theme.spacing.unit * 2 + 'px - 3px)',
		marginBottom: '20px',

		[theme.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	},
	footer: {
		'text-align': 'center'
	},
	copyright: {
		color: white
	},
	footerContainer: {
		background: primaryColor,
		position: 'absolute',
		bottom: 0,
		height: '15px',
		width: '100%',
		margin: '0'
	},
	aboutiMMAPRow: {
		background: '#f5f5f5',
		borderTop: '1px solid #e6e6e6',
		borderBottom: '1px solid #e6e6e6',
		position: 'absolute',
		bottom: '15px',
		width: '100%',
		paddingTop: theme.spacing.unit * 10,
		paddingBottom: theme.spacing.unit * 10
	},
	aboutiMMAPContainer: {
		margin: '0 auto',
		width: '1200px',
		[theme.breakpoints.only('md')]: {
			width: '940px'
		},
		[theme.breakpoints.only('sm')]: {
			width: '580px'
		},
		[theme.breakpoints.only('xs')]: {
			width: '100%'
		}
	}
});

export default withStyles(styles)(connect("", mapDispatchToProps)(Footer));
