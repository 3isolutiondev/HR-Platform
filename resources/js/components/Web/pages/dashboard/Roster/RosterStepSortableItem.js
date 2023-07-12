import React from 'react';
import classname from 'classnames';
import { connect } from 'react-redux';
import { SortableElement } from 'react-sortable-hoc';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { primaryColor } from '../../../config/colors';
import { getStepData } from '../../../redux/actions/dashboard/roster/rosterStepActions';

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

const RosterStepSortableItem = ({ stepIndex, value, onDelete, classes, getStepData }) => {
	return (
		<Paper className={classname(classes.addMarginBottom, classes.noStyleInList)}>
			<ListItem button>
				<ListItemText
					primary={
						stepIndex +
						1 +
						'. ' +
						value.step +
						(value.default_step === 1 ? ' - Default Step' : value.last_step === 1 ? ' - Last Step' : '')
					}
				/>
				<ListItemSecondaryAction>
					<IconButton
						aria-label="Edit"
						color="secondary"
						onClick={() => {
							getStepData(stepIndex);
						}}
					>
						<Edit />
					</IconButton>
					<IconButton aria-label="Delete" color="primary" onClick={() => onDelete(stepIndex)}>
						<Delete />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		</Paper>
	);
};

export default SortableElement(withStyles(styles)(connect(null, { getStepData })(RosterStepSortableItem)));
