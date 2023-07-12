import {
	SET_BIO,
	ONCHANGE_BIO,
	ONCHANGE_BIO_PRESENT_NATIONALITY,
	RESET_PROFILE
} from '../../types/profile/profileTypes';
import isEmpty from '../../../validations/common/isEmpty';

const initialState = {
	first_name: '',
	middle_name: '',
	family_name: '',
	// maiden_name: '',
	full_name: '',
	// bdate: '',
	// bmonth: '',
	// byear: '',
	// birth_date: '',
	// place_of_birth: '',
	gender: '',
	// marital_status: '',
	photo: '',
	user_id: '',

	// permanent_address: '',
	// permanent_city: '',
	// permanent_postcode: '',
	// permanent_telephone: '',
	// permanent_fax: '',
	linkedin_url: '',
	// type: '',
	// become_roster: 0,
	skype: '',
	// permanent_country: {
	// 	value: '',
	// 	label: '',
	// 	country_code: ''
	// },
	country_residence: '',
	present_nationalities: [
		{
			value: '',
			label: '',
			country_code: ''
		}
	],
	updated_at: '',
	verified_immaper: '0',
	is_immaper: '0',
	email: '',
	immap_email: '',
	last_login_at: '',
	_method: 'PUT'
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_BIO:
			return {
				...state,
				first_name: action.bio.first_name,
				middle_name: action.bio.middle_name,
				family_name: action.bio.family_name,
				// maiden_name: action.bio.maiden_name == null ? '' : action.bio.maiden_name,
				full_name: action.bio.user.full_name,
				email: action.bio.user.email,
				// bdate: action.bio.bdate,
				// bmonth: action.bio.bmonth,
				// byear: action.bio.byear,
				// birth_date: action.bio.birth_date,
				// place_of_birth: action.bio.place_of_birth,
				gender: action.bio.gender,
				// marital_status: action.bio.marital_status,
				photo: action.bio.photo,
				// become_roster: action.bio.become_roster,
				// permanent_address: isEmpty(action.bio.permanent_address.permanent_address)
				// 	? ''
				// 	: action.bio.permanent_address.permanent_address,
				// permanent_city: action.bio.permanent_address.permanent_city,
				// permanent_postcode: action.bio.permanent_address.permanent_postcode,
				// permanent_telephone: action.bio.permanent_address.permanent_telephone,
				// permanent_fax: action.bio.permanent_address.permanent_fax,
				// type: action.bio.permanent_address.type,
				linkedin_url: action.bio.linkedin_url,
				skype: action.bio.skype,
				updated_at: action.bio.updated_at,
				last_login_at: action.bio.user.last_login_at,
				// permanent_country: {
				// 	...state.permanent_country,
				// 	value: action.bio.permanent_address.country.value,
				// 	label: action.bio.permanent_address.country.label,
				// 	country_code: action.bio.permanent_address.country.country_code
				// },
				country_residence: isEmpty(action.bio.country_residence) ? { labels: 'need-country-residence' } : { value: action.bio.country_residence.id, label: action.bio.country_residence.name, labels: 'working-fine' },
				present_nationalities: action.bio.present_nationalities,
				verified_immaper: action.bio.verified_immaper,
				is_immaper: action.bio.is_immaper,
				immap_email: action.bio.immap_email
				// present_nationalities: [
				// 	{
				// 		...state.present_nationalities[0],
				// 		value: action.bio.present_nationalities[0].value,
				// 		label: action.bio.present_nationalities[0].label,
				// 		country_code: action.bio.present_nationalities[0].country_code
				// 	}
				// ]
			};
		case ONCHANGE_BIO:
			return {
				...state,
				[action.name]: action.value
			};
		case ONCHANGE_BIO_PRESENT_NATIONALITY:
			return {
				...state,
				present_nationalities: action.value
				// present_nationalities: [
				// 	{
				// 		...state.present_nationalities[0],
				// 		value: action.value[0].value,
				// 		label: action.value[0].label
				// 	}
				// ]
			};
		case RESET_PROFILE:
			return initialState;
		default:
			return state;
	}
};
