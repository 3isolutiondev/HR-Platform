import {
    SET_TOR_TAB,
    SET_TOR_TAB_PAGE
} from '../../types/tor/torTabTypes';

/**
 * [TorTab]
 * AddtabValue is a function to change reducer data inside torTabReducer
 * @param {string} name
 * @param {*} value
 * @return {Object}
 */
export const AddtabValue = (name, value) => {
    return {
        type: SET_TOR_TAB,
        name,
        value
    };
};

/**
 * [ToRTab]
 * onChange is a function to change tab value data
 * @param {Object} value - object consist of tab and value key
 * @returns
 */
export const onChange = (value) => (dispatch, getState) => {
    dispatch({
		type: SET_TOR_TAB_PAGE,
        value
	});

	return Promise.resolve(getState());
};
