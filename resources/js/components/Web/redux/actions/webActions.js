/** import textSelector and types needed for this actions */
import textSelector from '../../utils/textSelector';
import {
	ADD_FLASH_MESSAGE,
	DELETE_FLASH_MESSAGE,
  DELETE_ALL_FLASH_MESSAGE,
	SET_OPEN_SIDEBAR,
	SET_HIDE_SIDEBAR,
	SET_MOBILE_MENU,
	SHOW_LOADING,
	CHECK_ERROR_FORM,
	SET_SPINNER
} from '../types/webTypes';

/**
 * setSpinner action to toggle loading circle inside reset password
 * @category Redux [Actions] - WebActions
 * @param {boolean} spinner - show or hide loading circle
 * @returns {object}
 */
export const setSpinner = (spinner) => {
	return {
		type: SET_SPINNER,
		spinner
	};
};

/**
 * setOpenSidebar action to show left side menu
 * @category Redux [Actions] - WebActions
 * @returns {object}
 */
export function setOpenSidebar() {
	return {
		type: SET_OPEN_SIDEBAR
	};
}

/**
 * setHideSidebar action to hide left side menu
 * @category Redux [Actions] - WebActions
 * @returns {object}
 */
export function setHideSidebar() {
	return {
		type: SET_HIDE_SIDEBAR
	};
}

/**
 * toggleMobileMenu action to toggle mobile menu
 * @category Redux [Actions] - WebActions
 * @returns {object}
 */
export const toggleMobileMenu = () => (dispatch, getState) => {
	return dispatch({
		type: SET_MOBILE_MENU,
		value: getState().web.openMobileMenu ? false : true
	});
};

/**
 * showLoading action to show or hide loading circle inside axiosSetup.js
 * @category Redux [Actions] - WebActions
 * @param {boolean} show - show or hide loading circle
 * @returns {object}
 * */
export function showLoading(show) {
	return {
		type: SHOW_LOADING,
		show
	};
}

/**
 * addFlashMessage action to show flash message on the website
 * @category Redux [Actions] - WebActions
 * @param {object}  message - data to show a message
 * @param {string}  message.type - type of the message: info,success,error
 * @param {string}  message.text - message
 * @returns {object}
 */
export function addFlashMessage(message) {
	return {
		type: ADD_FLASH_MESSAGE,
		message
	};
}

/**
 * serverErrorMessage action to show default error message on the website
 * @category Redux [Actions] - WebActions
 * @returns {object}
 */
export function serverErrorMessage() {
  return {
    type: ADD_FLASH_MESSAGE,
    message: {
      type: 'error',
      text: textSelector('error', 'default')
    }
  }
}

/**
 * deleteFlashMessage action to delete one flash message based on the id
 * @category Redux [Actions] - WebActions
 * @param {number|string} id - flash message id
 * @returns {object}
 */
export function deleteFlashMessage(id) {
	return {
		type: DELETE_FLASH_MESSAGE,
		id
	};
}

/**
 * deleteAllFlashMessage action to delete all flash message(s) stored on the system
 * @category Redux [Actions] - WebActions
 * @returns {object}
 */
export function deleteAllFlashMessage() {
	return {
		type: DELETE_ALL_FLASH_MESSAGE
	};
}

/**
 * checkError action to set an error and form data is valid on several components
 * @category Redux [Actions] - WebActions
 * @param {object}  error - list of errors stored in object, i.e { email: "Email is required" }
 * @param {boolean} valid - is valid or not
 * @returns {object}
 */
export const checkError = (error, valid) => {
	return {
		type: CHECK_ERROR_FORM,
		error,
		valid
	};
};
