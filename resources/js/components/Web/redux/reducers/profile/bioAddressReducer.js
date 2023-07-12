import {
	SET_BIO_ADDRESS,
	ONCHANGE_BIO_ADDRESS,
	// ONCHANGE_MULTI_SELECT_BIO,
	ONCHANGE_PERMANENT_ADDRESS_BIO,
	ONCHANGE_PRESENT_ADDRESS_BIO,
	CHECK_ERROR_BIO,
	RESET_PROFILE
} from '../../types/profile/profileTypes';

const initialState = {
	errors: {},
	show: false,
	isValid: false,
	id: '',
	relevant_facts: 0,
	objections_making_inquiry_of_present_employer: 0,
	objection_name: '',
	objection_email: '',
	objection_organization: '',
	objection_position: '',
	accept_employment_less_than_six_month: 0,
	office_telephone: '',
	office_email: '',
	skype: '',
	field_of_works_counts: 0,
	preferred_field_of_work: [],
	preferred_sector: [],
	field_of_works: [],
	sectors: [],
	sameWithPermanent: false,
	permanent_address: {},
	present_address: {},
	share_profile_consent: 1,
	hear_about_us_from: '',
	other_text: '',
	
	// birth_nationalities: [
	// 	{
	// 		value: '',
	// 		label: '',
	// 		country_code: ''
	// 	}
	// ],
	// present_nationalities: [
	// 	{
	// 		value: '',
	// 		label: '',
	// 		country_code: ''
	// 	}
	// ],
	_method: 'PUT'
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_BIO_ADDRESS:
			return {
				...state,
				id: action.bio.id,
				relevant_facts: action.bio.relevant_facts,
				objections_making_inquiry_of_present_employer: action.bio.objections_making_inquiry_of_present_employer,
				objection_name: action.bio.objection_name,
				objection_email: action.bio.objection_email,
				objection_position: action.bio.objection_position,
				objection_organization: action.bio.objection_organization,
				accept_employment_less_than_six_month: action.bio.accept_employment_less_than_six_month,
				office_telephone: action.bio.office_telephone,
				office_email: action.bio.office_email,
				skype: action.bio.skype,
				field_of_works_counts: action.bio.field_of_works_counts,
				field_of_works: action.bio.field_of_works,
				sectors: action.bio.sectors,
				preferred_sector: action.bio.preferred_sector,
				permanent_address: action.bio.permanent_address,
				present_address: action.bio.present_address,
				// birth_nationalities: action.bio.birth_nationalities,
				preferred_field_of_work: action.bio.preferred_field_of_work,
				sameWithPermanent: action.bio.sameWithPermanent,
				// present_nationalities: action.bio.present_nationalities,
				show: true,
				share_profile_consent: action.bio.share_profile_consent,
				hear_about_us_from: action.bio.hear_about_us_from,
				other_text: action.bio.other_text
			};
		case CHECK_ERROR_BIO:
			return {
				...state,
				errors: action.error,
				isValid: action.valid
			};
		case ONCHANGE_BIO_ADDRESS:
			return {
				...state,
				[action.name]: action.value
			};
		// case ONCHANGE_MULTI_SELECT_BIO:
		// 	return {
		// 		...state,
		// 		birth_nationalities: [
		// 			{
		// 				...state.birth_nationalities[0],
		// 				value: action.value[0].value,
		// 				label: action.value[0].label
		// 			}
		// 		]
		// 	};
		case ONCHANGE_PERMANENT_ADDRESS_BIO:
			return {
				...state,
				permanent_address: {
					...state.permanent_address,
					[action.name]: action.value
				}
			};
		case ONCHANGE_PRESENT_ADDRESS_BIO:
			return {
				...state,
				present_address: {
					...state.present_address,
					[action.name]: action.value
				}
			};
		case 'bio_address':
			return {
				...state,
				show: action.value
			};
		case RESET_PROFILE:
			return initialState;
		default:
			return state;
	}
};
