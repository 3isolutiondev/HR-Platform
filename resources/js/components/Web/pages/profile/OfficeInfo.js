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

const OfficeInfo = ({ email, skype, phone, classes }) => {
	return (
		<Grid container>
			<Grid item xs={12}>
				<Typography variant="h6" color="primary">
					Office Info
				</Typography>
				<div>
					<Typography variant="subtitle2" className={classes.displayInline}>
						Email :{' '}
					</Typography>
					<Typography variant="body2" className={classes.displayInline}>
						{email}{' '}
					</Typography>
				</div>
				<div>
					<Typography variant="subtitle2" className={classes.displayInline}>
						Telephone :{' '}
					</Typography>
					<Typography variant="body2" className={classes.displayInline}>
						{phone}{' '}
					</Typography>
				</div>
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(OfficeInfo);
