import React from 'react';
import classname from 'classnames';
import { Link } from 'react-router-dom';
import { SortableElement } from 'react-sortable-hoc';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { primaryColor } from '../config/colors';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addMarginBottom: {
		'margin-bottom': '.5em'
	},
	noStyleInList: {
		'list-style-type': 'none !important'
	},
	primaryColor: {
		color: primaryColor
	}
});

const SortableItem = ({ index, value, baseLink, onDelete, classes }) => {
	let label = index + 1 + '. ' + value.label;
	if (value.status === 1) {
		label = label + ' - Default';
	} else if (value.last_step === 1) {
		label = label + ' - Last Step';
	} else if (value.is_interview === 1) {
		label = label + ' - Is Interview';
	}

	return (
		<Paper className={classname(classes.addMarginBottom, classes.noStyleInList)}>
			<ListItem button>
				<ListItemText primary={label} />
				<ListItemSecondaryAction>
					<Link to={baseLink + value.value + '/edit'}>
						<IconButton aria-label="Edit" color="secondary">
							<Edit />
						</IconButton>
					</Link>
					<IconButton aria-label="Delete" color="primary" onClick={() => onDelete(value.value)}>
						<Delete />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		</Paper>
	);
};

export default SortableElement(withStyles(styles)(SortableItem));
