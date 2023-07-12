import {
  SET_USER_FILTER
} from '../../types/completionstatusTypes';

export const onChangeStatus = (name, value) => (dispatch, getState) => {
	dispatch({
		type: SET_USER_FILTER,
		name,
		value
	});
	return Promise.resolve(getState());
};


export const resetFilter = () => (dispatch, getState) => {

	dispatch(onChangeStatus('search', ""));
	dispatch(onChangeStatus('status', []));
	dispatch(onChangeStatus('steps', []));
	dispatch(onChangeStatus('roles', []))
};

export const filterUserArray = (name, value) => (dispatch, getState) => {
  let stateName = [...getState().userFilterStatus[name]];
	let arrIndex = stateName.indexOf(value);

	if (arrIndex >= 0) {
		stateName.splice(arrIndex, 1);
	} else {
		stateName.push(value);
	}

	return dispatch(onChangeStatus(name, stateName));
}

