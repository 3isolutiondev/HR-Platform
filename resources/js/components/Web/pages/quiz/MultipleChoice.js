import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import { primaryColor, white } from '../../config/colors';

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

const MultipleChoice = ({ classes, paragraph, handleChange, selectedIndex, choice }) => {
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
				<List component="nav">
					{choice.map((choice, index) => {
						return (
							<ListItem
								key={index}
								button
								selected={selectedIndex === choice.variable}
								onClick={(event) => handleChange(event, choice.variable)}
							>
								<ListItemIcon>
									<Fab
										size="small"
										className={selectedIndex === choice.variable ? classes.active : null}
									>
										{choice.variable}
									</Fab>
								</ListItemIcon>
								<ListItemText primary={choice.value} />
							</ListItem>
						);
					})}
				</List>
			</Paper>
		</div>
	);
};

export default withStyles(styles)(MultipleChoice);
