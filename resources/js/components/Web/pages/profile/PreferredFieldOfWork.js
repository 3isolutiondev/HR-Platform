import React from 'react';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
// import moment from 'moment';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addMarginTop: {
		'margin-top': '.75em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	addMarginBottom: {
		'margin-bottom': '.75em'
	},
	capitalize: {
		'text-transform': 'capitalize'
	}
});

const PreferredFieldOfWork = ({ field_of_works, classes }) => (
	<Grid container>
		<Grid item xs={12}>
			<Typography variant="h6" color="primary">
				Areas of expertise
			</Typography>
			{field_of_works.map((fieldOfWork) => {
				return (
					<Chip
						key={fieldOfWork.label + '-' + fieldOfWork.value}
						label={fieldOfWork.label}
						color="primary"
						className={classname(classes.capitalize, classes.addSmallMarginRight)}
					/>
				);
			})}
		</Grid>
	</Grid>
);

export default withStyles(styles)(PreferredFieldOfWork);
