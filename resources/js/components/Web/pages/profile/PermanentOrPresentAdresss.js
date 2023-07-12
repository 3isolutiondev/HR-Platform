import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	displayInline: {
		display: 'inline-block',
		'margin-right': '4px',
		'margin-bottom': '.5em'
	}
});

const PermanentOrPresentAdresss = ({ address, classes }) => {
	return (
		<Grid container>
			<Grid item xs={12}>
				<Typography variant="h6" color="primary">
					{address.permanent_address ? 'Permanent Address' : 'Present Address'}
				</Typography>
				<div>
					<Typography variant="subtitle2">Address : </Typography>
					{address.permanent_address ? (
						<Typography variant="body2" className={classes.displayInline}>
							{address.permanent_address}
						</Typography>
					) : (
						address.present_address && (
							<Typography variant="body2" className={classes.displayInline}>
								{address.present_address}
							</Typography>
						)
					)}
				</div>
				<div>
					<Typography variant="subtitle2" className={classes.displayInline}>
						City :{' '}
					</Typography>
					{address.permanent_city ? (
						<Typography variant="body2" className={classes.displayInline}>
							{address.permanent_city}{' '}
						</Typography>
					) : (
						address.present_city && (
							<Typography variant="body2" className={classes.displayInline}>
								{address.present_city}{' '}
							</Typography>
						)
					)}
				</div>
				<div>
					<Typography variant="subtitle2" className={classes.displayInline}>
						Country :{' '}
					</Typography>
					{address.permanent_country ? (
						<Typography variant="body2" className={classes.displayInline}>
							{address.permanent_country.label}
						</Typography>
					) : (
						address.present_country && (
							<Typography variant="body2" className={classes.displayInline}>
								{address.present_country.label}
							</Typography>
						)
					)}
				</div>
				<div>
					<Typography variant="subtitle2" className={classes.displayInline}>
						Postcode :{' '}
					</Typography>
					{address.permanent_postcode ? (
						<Typography variant="body2" className={classes.displayInline}>
							{address.permanent_postcode}
						</Typography>
					) : (
						address.present_postcode && (
							<Typography variant="body2" className={classes.displayInline}>
								{address.present_postcode}
							</Typography>
						)
					)}
				</div>
				<div>
					<Typography variant="subtitle2" className={classes.displayInline}>
						Telephone :{' '}
					</Typography>
					{address.permanent_telephone ? (
						<Typography variant="body2" className={classes.displayInline}>
							{address.permanent_telephone}
						</Typography>
					) : (
						address.present_telephone && (
							<Typography variant="body2" className={classes.displayInline}>
								{address.present_telephone}
							</Typography>
						)
					)}
				</div>
				<div>
					<Typography variant="subtitle2" className={classes.displayInline}>
						Fax :{' '}
					</Typography>
					{address.permanent_fax ? (
						<Typography variant="body2" className={classes.displayInline}>
							{address.permanent_fax}
						</Typography>
					) : (
						address.present_fax && (
							<Typography variant="body2" className={classes.displayInline}>
								{address.present_fax}
							</Typography>
						)
					)}
				</div>
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(PermanentOrPresentAdresss);
