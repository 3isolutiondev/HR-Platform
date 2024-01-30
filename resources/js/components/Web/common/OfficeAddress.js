import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { primaryColor, white } from '../config/colors';
import world from '../../../../img/world.png'

/**
 * Component for showing iMMAP office address in home page
 *
 * Permission: -
 *
 * @component
 * @name OfficeAddress
 * @category Page
 * @subcategory Home
 * @example
 * return (
 *    <OfficeAddress />
 * )
 *
 */
const OfficeAddress = ({ classes }) => (
	<div className={classes.officeAddressRow}>
		<div className={classes.officeAddressContainer}>
			<Grid container spacing={16}>
				<Grid item xs={12} md={6} lg={6}>
					<div className={classes.imagesWorld} />
				</Grid>
				<Grid item xs={12} md={6} lg={6}>
					<Typography variant="body1" className={classes.copyright}>
						Headquarters Marseille office
					</Typography>
					<Typography variant="body2" className={classes.subTitle}>
            10 rue Stanislas Torrents, 13006, Marseille, France
					</Typography>
				</Grid>
			</Grid>
		</div>
	</div>
);

OfficeAddress.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired
}

const heightDefault = 150;

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	imagesWorld: {
		background: 'url(' + world + ')',
		height: heightDefault + 'px',
		maxWidth: '300px',
		width: '100%',
		position: 'relative',
		backgroundSize: 'cover',
		[theme.breakpoints.down('md')]: {
			margin: '0 auto'
		}
	},
	copyright: {
		color: white,
		lineHeight: 1.1,
		marginBottom: '10px',
		fontWeight: '300',
		fontFamily: "'Barlow Condensed', sans-serif",
		fontSize: theme.spacing.unit + 10 + 'px',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	},
	subTitle: {
		color: white,
		fontSize: '14px',
		lineHeight: '23px',
		marginBottom: '10px',
		paddingTop: '10px',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	},
	officeAddressRow: {
		background: primaryColor,
		width: '100%',
		paddingTop: theme.spacing.unit * 10,
		paddingBottom: theme.spacing.unit * 10
	},
	officeAddressContainer: {
		margin: '0 auto',
		paddingLeft: theme.spacing.unit * 3,
		paddingRight: theme.spacing.unit * 3,
		width: '1200px',
		[theme.breakpoints.only('md')]: {
			width: '940px'
		},
		[theme.breakpoints.only('sm')]: {
			width: '580px'
		},
		[theme.breakpoints.only('xs')]: {
			width: 'calc(100% - ' + theme.spacing.unit * 6 + 'px)'
		}
	}
});

export default withStyles(styles)(OfficeAddress);
