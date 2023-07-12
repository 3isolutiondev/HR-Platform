import {
	SET_SECTOR_FORMDATA,
	SET_BULK_SECTOR_FORMDATA,
	RESET_SECTOR_FORMDATA
} from '../../../types/dashboard/sector/sectorTypes';

const initialState = {
	id: '',
	name: '',
	is_approved: 1,
	errors: {},
	isEdit: false,
	apiURL: '/api/sectors',
	redirectURL: '/dashboard/sectors',
	showLoading: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_SECTOR_FORMDATA:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_SECTOR_FORMDATA:
			let dashboardSector = { ...state };

			Object.keys(dashboardSector).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					dashboardSector[key] = action.bulkData[key];
				}
			});

			return dashboardSector;
		case RESET_SECTOR_FORMDATA:
			return initialState;
		default:
			return state;
	}
};
