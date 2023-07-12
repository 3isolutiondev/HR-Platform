import React from 'react';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import ReactCountryFlag from 'react-country-flag';
import Tooltip from '@material-ui/core/Tooltip';

const flag = {
	width: '32px',
	height: '32px',
	backgroundSize: '44px 44px'
};

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addSmallMarginBottom: {
		'margin-bottom': '.25em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	capitalize: {
		'text-transform': 'capitalize'
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50%'
	},
	label: {
		maxWidth: 300,
		'& > span': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inline !important'
		}
	}
});

const BirthNationalities = ({ birth_nationalities, classes }) => (
	<Grid container>
		<Grid item xs={12}>
			<Typography variant="h6" color="primary">
				Birth Nationality
			</Typography>
			{birth_nationalities ?
				birth_nationalities.map((nationality, index) => {
					const FlagContainer = (props) => <div className={classes.countryAvatar}>{props.children}</div>;
					return (
						<Tooltip key={index} title={nationality.label}>
							<Chip
								avatar={
									<FlagContainer>
										<ReactCountryFlag code={nationality.country_code} svg styleProps={flag} />
									</FlagContainer>
								}
								label={nationality.label}
								// onDelete={handleDelete}
								color="primary"
								className={classname(classes.addSmallMarginRight, classes.capitalize, classes.label)}
							/>
						</Tooltip>
					);
				}) :  null}
		</Grid>
	</Grid>
);

export default withStyles(styles)(BirthNationalities);
