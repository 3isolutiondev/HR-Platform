import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Fab from '@material-ui/core/Fab';
import { primaryColor, white } from '../../config/colors';
// import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	capitalize: {
		'text-transform': 'capitalize'
	},
	formControl: {
		margin: theme.spacing.unit * 3
	},
	group: {
		margin: `${theme.spacing.unit}px 0`
	},
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 1,
		paddingBottom: theme.spacing.unit * 1,
		marginTop: 2,
		marginBottom: 2
	},
	active: {
		backgroundColor: primaryColor,
		color: white
	}
});

const MultipleSelectChoice = ({ classes, paragraph, handleChange, choice, selected }) => {
	return (
		<div>
			<Paper className={classes.root} elevation={1}>
				{paragraph.map((p, i) => {
					return (
						<Typography key={i} className={classes.capitalize} variant="subtitle2" gutterBottom>
							{p.p}
						</Typography>
					);
				})}
				<FormControl component="fieldset" className={classes.formControl}>
					<FormGroup>
						{choice.map((choice, index) => {
							return (
								<FormControlLabel
									key={index}
									control={
										<Checkbox
											// checked={false}
											onChange={() => handleChange(choice.variable)}
											value={choice.value}
											color="primary"
										/>
									}
									label={choice.value}
								/>
							);
						})}
					</FormGroup>
				</FormControl>
			</Paper>
		</div>
	);
};

export default withStyles(styles)(MultipleSelectChoice);
