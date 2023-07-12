import {
	SET_ROSTER_STEP_FORMDATA,
	SET_BULK_ROSTER_STEP_FORMDATA,
	SET_ROSTER_PROCESS_FORMDATA,
	RESET_ROSTER_STEP_FORMDATA
} from '../../../types/dashboard/roster/rosterProcesses';
import { addFlashMessage } from '../../webActions';
import arrayMove from 'array-move';
import axios from 'axios';
import isEmpty from '../../../../validations/common/isEmpty';
import { validate } from '../../../../validations/Roster/rosterStep';

export const isValid = () => {
	return (dispatch, getState) => {
		const { rosterStep } = getState().rosterProcess;

		const { errors, isValid } = validate(rosterStep);

		dispatch(onChange('errors', errors));

		return isValid;
	};
};

export const updateOrder = (oldIndex, newIndex) => (dispatch, getState) => {
	let { roster_steps } = getState().rosterProcess.rosterProcess;

	roster_steps = arrayMove(roster_steps, oldIndex, newIndex);
	roster_steps.forEach((step, index) => {
		step.order = index;
	});

	return dispatch({
		type: SET_ROSTER_PROCESS_FORMDATA,
		name: 'roster_steps',
		value: roster_steps
	});
};

export const removeStep = (stepIndex, roster_steps) => (dispatch, getState) => {
	roster_steps.splice(stepIndex, 1);

	return dispatch({
		type: SET_ROSTER_PROCESS_FORMDATA,
		name: 'roster_steps',
		value: roster_steps
	});
};

export const onDelete = (stepIndex) => (dispatch, getState) => {
	let { roster_steps } = getState().rosterProcess.rosterProcess;
	const id = roster_steps[stepIndex]['id'];

	if (!isEmpty(id)) {
		return axios
			.delete('/api/roster-steps/' + id)
			.then((res) => {
				dispatch(removeStep(stepIndex, roster_steps));
				dispatch(
					addFlashMessage({
						type: 'success',
						text: 'Step successfully deleted'
					})
				);
			})
			.catch((err) => {
				dispatch(
					addFlashMessage({
						type: 'error',
						text: !isEmpty(err.response)
							? !isEmpty(err.response.data)
								? err.response.data.errors
								: 'There is an error while deleting step'
							: 'There is an error while deleting step'
					})
				);
			});
	} else {
		return dispatch(removeStep(stepIndex, roster_steps));
	}
};

export const onChange = (name, value) => (dispatch) => {
	if (name === 'quiz_template') {
		dispatch({
			type: SET_ROSTER_STEP_FORMDATA,
			name: 'quiz_template_id',
			value: value.value
		});
	}

	if (name === 'has_quiz') {
		if (value == 0) {
			dispatch({
				type: SET_ROSTER_STEP_FORMDATA,
				name: 'quiz_template',
				value: []
			});
			dispatch({
				type: SET_ROSTER_STEP_FORMDATA,
				name: 'quiz_template_id',
				value: ''
			});
		}
	}
	return dispatch({
		type: SET_ROSTER_STEP_FORMDATA,
		name,
		value
	});
};

export const getStepData = (order) => (dispatch, getState) => {
	dispatch(onChange('isEdit', true));
	dispatch(onChange('isOpen', true));

	let { roster_steps } = getState().rosterProcess.rosterProcess;

	return dispatch({
		type: SET_BULK_ROSTER_STEP_FORMDATA,
		bulkData: roster_steps[order]
	});
};

export const resetStep = () => (dispatch) => {
	return dispatch({
		type: RESET_ROSTER_STEP_FORMDATA
	});
};
