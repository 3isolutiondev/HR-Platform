import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { primaryColor } from '../config/colors';
import immap from '../../../../img/iMMAP-logostrapline_transparent-copy.png';

// whoWeAre data (it will show on footer of the page)
const whoWeAre = [
	{ title: 'Home', link: '/', external: false },
	{ title: 'Contact Us', link: 'https://mywebsite.org/contact-us-2/', external: true },
	{ title: 'Locations', link: 'https://mywebsite.org/where-we-work/', external: true },
	{ title: 'History', link: 'https://mywebsite.org/history-timeline/', external: true },
	{ title: 'Team', link: 'https://mywebsite.org/meet-the-team/', external: true },
	{ title: 'Careers', link: 'https://mywebsite.org/careers-2/', external: true },
	{ title: 'Photo Credits', link: 'https://mywebsite.org/credits/', external: true }
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
 * Component for showing details about iMMAP on the footer of 3iSolution Careers (iMMAP logo, links to iMMAP official website, and iMMAP social media).
 *
 *
 * Permission: -
 *
 * @component
 * @name About
 * @category Common
 * @subcategory Footer
 * @example
 * return (
 *    <About />
 * )
 *
 */
const About = ({ classes }) => (
	<Grid container spacing={24} style={{ backgroundColor: '#f5f5f5' }}>
		<Grid item xs={2} />
		<Grid item xs={8}>
			<Grid container spacing={24} className={classes.footerContainer}>
				<Grid item xs={4}>
					<div className={classes.imagesWorld} />
				</Grid>
				<Grid item xs={2}>
					<Typography variant="body2" className={classes.title}>
						Who we are
					</Typography>
					{whoWeAre.map((dt, index) => (
						<Typography key={index} variant="body2" className={classes.copyright}>
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
				<Grid item xs={2}>
					<Typography variant="body2" className={classes.title}>
						What we do
					</Typography>
					{whatWeDo.map((dt, index) => (
						<Typography key={index} variant="body2" className={classes.copyright}>
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
				<Grid item xs={4}>
					<Typography variant="body2" className={classes.title}>
						About iMMAP
					</Typography>

					<Typography variant="body2" className={classes.copyright}>
						3iSolution Is an international not-for-profit organization
					</Typography>
				</Grid>
			</Grid>
		</Grid>
		<Grid item xs={2} />
	</Grid>
);

About.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   *
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired
}

const heightDefault = 50;

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	imagesWorld: {
		background: 'url(' + immap + ')',
		height: heightDefault + 'px',
		width: '250px',
		position: 'relative',
		backgroundSize: 'cover'
	},
	footer: {
		'text-align': 'center'
	},
	linked: {
		color: '#696969',
		textDecoration: 'none'
	},
	copyright: {
		color: '#696969',
		'&:hover $linked': {
			color: primaryColor
		}
	},
	title: {
		display: 'block',
		fontSize: ' 1.17em',
		marginBlockEnd: '1em',
		marginInlineStart: '0px',
		marginInlineEnd: '0px',
		fontWeight: 'bold'
	},
	footerContainer: {
		background: '#f5f5f5',
		width: '100%',
		margintop: '0',
		paddingBottom: '50px'
	}
});

export default withStyles(styles)(About);
