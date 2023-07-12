/** import types needed for this reducer */
import {
	ADD_FLASH_MESSAGE,
	DELETE_FLASH_MESSAGE,
  DELETE_ALL_FLASH_MESSAGE,
	SET_SIDEBAR_ACTIVE,
	SET_OPEN_SIDEBAR,
	SET_HIDE_SIDEBAR,
	SET_MOBILE_MENU,
	SHOW_LOADING,
	CHECK_ERROR_FORM,
	SET_SPINNER
} from '../types/webTypes';

/** import third party library to help this reducer process data */
import shortid from 'shortid';
import { findIndex } from 'lodash/array';

// define initial state value
const initialState = {
	sidebarActive: '',
	openSidebar: false,
	flashMessage: [],
	showLoading: false,
	isValid: false,
	errors: {},
	spinner: false,
	openMobileMenu: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_SIDEBAR_ACTIVE:
			return {
				...state,
				sidebarActive: action.text
			};
		case SET_SPINNER:
			return {
				...state,
				spinner: action.spinner
			};
		case SET_OPEN_SIDEBAR:
			localStorage.setItem('openSidebar', true);

			return {
				...state,
				openSidebar: true
			};
		case SET_HIDE_SIDEBAR:
			localStorage.setItem('openSidebar', false);

			return {
				...state,
				openSidebar: false
			};
		case SET_MOBILE_MENU:
			return {
				...state,
				openMobileMenu: action.value
			};
		case SHOW_LOADING:
			return {
				...state,
				showLoading: action.show
			};
		case CHECK_ERROR_FORM:
			return {
				...state,
				errors: action.error,
				isValid: action.valid
			};
		case ADD_FLASH_MESSAGE:
			return {
				...state,
				flashMessage: [
					...state.flashMessage,
					{ id: shortid.generate(), type: action.message.type, text: action.message.text }
				]
			};
		case DELETE_FLASH_MESSAGE:
			const index = findIndex(state.flashMessage, { id: action.id });
			if (index >= 0) {
				return {
					...state,
					flashMessage: [ ...state.flashMessage.slice(0, index), ...state.flashMessage.slice(index + 1) ]
				};
			}
			return state;
    case DELETE_ALL_FLASH_MESSAGE:
      return {
        ...state,
        flashMessage: []
      }
		default:
			return state;
	}
};
