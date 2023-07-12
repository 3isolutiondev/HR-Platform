import {
	SET_IMMAP_OFFICE_FORMDATA,
	SET_BULK_IMMAP_OFFICE_FORMDATA,
	RESET_IMMAP_OFFICE_FORMDATA
} from '../../../types/dashboard/immap-office/immapOfficeTypes';

const initialState = {
	id: '',
	city: '',
	country: '',
	is_active: 1,
	is_hq: 0,
	errors: {},
	isEdit: false,
	apiURL: '/api/immap-offices',
	redirectURL: '/dashboard/immap-offices',
	showLoading: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_IMMAP_OFFICE_FORMDATA:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_IMMAP_OFFICE_FORMDATA:
			let dashboardImmapOffice = { ...state };

			Object.keys(dashboardImmapOffice).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					dashboardImmapOffice[key] = action.bulkData[key];
				}
			});

			return dashboardImmapOffice;
		case RESET_IMMAP_OFFICE_FORMDATA:
			return initialState;
		default:
			return state;
	}
};
