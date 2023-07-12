import {
    SET_JOB_TAB,
    SET_TAB_PAGE
} from '../../types/jobs/jobsTabTypes';

/**
 * [JobTab]
 * AddtabValue is a function to change reducer data inside jobTabReducer
 * @param {string} name
 * @param {*} value
 * @return {Object}
 */
export const AddtabValue = (name, value) => {
    return {
        type: SET_JOB_TAB,
        name,
        value
    };
};

/**
 * [JobTab]
 * onChange is a function to change tab value data
 * @param {Object} value - object consist of tab and value key
 * @returns
 */
export const onChange = (value) => (dispatch, getState) => {
    dispatch({
		type: SET_TAB_PAGE,
        value
	});

	return Promise.resolve(getState());
};
