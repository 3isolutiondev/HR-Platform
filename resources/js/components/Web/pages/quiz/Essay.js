import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

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
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 1,
		paddingBottom: theme.spacing.unit * 1,
		marginTop: 2,
		marginBottom: 2
	}
});

const Essay = ({ paragraph, classes, onChange, value }) => {
	return (
		<Paper className={classes.root} elevation={1}>
			{paragraph.map((p, i) => {
				return (
					<Typography key={i} className={classes.capitalize} variant="subtitle2" gutterBottom>
						{p.p}
					</Typography>
				);
			})}
			<TextField
				onChange={onChange}
				id="answer"
				label="Type Answer Here"
				multiline
				rows="6"
				defaultValue={value}
				className={classes.textField}
				margin="normal"
				fullWidth
			/>
		</Paper>
	);
};

export default withStyles(styles)(Essay);
