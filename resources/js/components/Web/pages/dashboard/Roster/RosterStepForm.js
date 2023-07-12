import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import RosterStepSortableLists from './RosterStepSortableLists';
import RosterStepModal from './RosterStepModal';
import { onChange, updateOrder, onDelete, resetStep } from '../../../redux/actions/dashboard/roster/rosterStepActions';

class RosterStepForm extends Component {
	render() {
		const { onChange, updateOrder, onDelete, resetStep } = this.props;
		const { roster_steps } = this.props.rosterProcess;

		return (
			<Grid container>
				<Grid item xs={12} sm={8} md={9} lg={10}>
					<Typography variant="h6">Roster Steps</Typography>
				</Grid>
				<Grid item xs={12} sm={4} md={3} lg={2}>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						onClick={() => {
							resetStep();
							onChange('isOpen', true);
						}}
					>
						<Add /> Add Step
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle1">Change Order / Step</Typography>
				</Grid>
				<Grid item xs={12}>
					<RosterStepSortableLists
						items={roster_steps}
						onSortEnd={({ oldIndex, newIndex }) => updateOrder(oldIndex, newIndex)}
						onDelete={onDelete}
						distance={2}
					/>
				</Grid>
				<RosterStepModal />
			</Grid>
		);
	}
}

RosterStepForm.propTypes = {
	rosterProcess: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	updateOrder: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChange,
	updateOrder,
	onDelete,
	resetStep
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	rosterProcess: state.rosterProcess.rosterProcess
});

export default connect(mapStateToProps, mapDispatchToProps)(RosterStepForm);
