import axios from 'axios';
import {
	SET_BIO_ADDRESS,
	ONCHANGE_BIO_ADDRESS,
	// ONCHANGE_MULTI_SELECT_BIO,
	ONCHANGE_PERMANENT_ADDRESS_BIO,
	ONCHANGE_PRESENT_ADDRESS_BIO,
	CHECK_ERROR_BIO
} from '../../types/profile/profileTypes';
// import { pluck } from '../../../utils/helper';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET BIO ADDRESS
export const getBioAdress = (id) => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-biodata-address-and-nationalities/')
				.then((resBio) => {
					// let presentCountry = resBio.data.data.present_address;
					// let preferredFieldOfWork = resBio.data.data.field_of_works.map((data) => {
					// 	return data.field_of_work.field;
					// });
					// if (resBio.data.data.present_address == null) {
					// 	presentCountry = {
					// 		present_address: '',
					// 		present_country: {},
					// 		present_city: '',
					// 		present_postcode: '',
					// 		present_telephone: '',
					// 		present_fax: ''
					// 	};
					// }
					// let birth_nationalities = [
					// 	{
					// 		value: resBio.data.data.birth_nationalities[0].id,
					// 		label: resBio.data.data.birth_nationalities[0].name,
					// 		country_code: resBio.data.data.birth_nationalities[0].country_code
					// 	}
					// ];
					let data = resBio.data.data;
					data = {
						...resBio.data.data,
						office_telephone:
							resBio.data.data.office_telephone == null ? '' : resBio.data.data.office_telephone,
						skype: resBio.data.data.skype == null ? '' : resBio.data.data.skype,
						// present_address: presentCountry,
						// preferred_field_of_work: preferredFieldOfWork,
						preferred_field_of_work: resBio.data.data.field_of_works,
						preferred_sector: resBio.data.data.sectors,
						// birth_nationalities,
						show: true
					};
					return dispatch(setBioAdress(data));
				})
				.catch((err) => {
					return dispatch(setBioAdressFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-biodata-address-and-nationalities/' + profileID)
				.then((resBio) => {
					// let presentCountry = resBio.data.data.present_address;
					// let preferredFieldOfWork = resBio.data.data.field_of_works.map((data) => {
					// 	return data.field_of_work.field;
					// });
					// if (resBio.data.data.present_address == null) {
					// 	presentCountry = {
					// 		present_address: '',
					// 		present_country: {},
					// 		present_city: '',
					// 		present_postcode: '',
					// 		present_telephone: '',
					// 		present_fax: ''
					// 	};
					// }
					// let birth_nationalities = [
					// 	{
					// 		value: resBio.data.data.birth_nationalities[0].id,
					// 		label: resBio.data.data.birth_nationalities[0].name,
					// 		country_code: resBio.data.data.birth_nationalities[0].country_code
					// 	}
					// ];
					let data = resBio.data.data;
					data = {
						...resBio.data.data,
						office_telephone:
							resBio.data.data.office_telephone == null ? '' : resBio.data.data.office_telephone,
						skype: resBio.data.data.skype == null ? '' : resBio.data.data.skype,
						// present_address: presentCountry,
						// preferred_field_of_work: preferredFieldOfWork,
						preferred_field_of_work: resBio.data.data.field_of_works,
						// birth_nationalities,
						show: true
					};
					return dispatch(setBioAdress(data));
				})
				.catch((err) => {
					return dispatch(setBioAdressFailed(err));
				});
		}
	};
};

// SET BIO ADDRESS
export const setBioAdress = (bio) => {
	return {
		type: SET_BIO_ADDRESS,
		bio
	};
};

// SET BIO ADDRESS ERROR MESSAGE
export const setBioAdressFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving data'
		}
	};
};

export const onChangeBioAddress = (name, value) => {
	return {
		type: ONCHANGE_BIO_ADDRESS,
		name,
		value
	};
};

// export const onChangeMultiSelect = (name, value) => {
// 	return {
// 		type: ONCHANGE_MULTI_SELECT_BIO,
// 		name,
// 		value
// 	};
// };

export const onChangeBio = (name, value, option) => {
	if (option == 'permanent') {
		return {
			type: ONCHANGE_PERMANENT_ADDRESS_BIO,
			name,
			value
		};
	} else if (option == 'present') {
		return {
			type: ONCHANGE_PRESENT_ADDRESS_BIO,
			name,
			value
		};
	}
};

export const checkErrorBio = (error, valid) => {
	return {
		type: CHECK_ERROR_BIO,
		error,
		valid
	};
};
