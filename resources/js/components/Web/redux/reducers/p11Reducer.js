import {
	CHECK_ERROR,
	SET_P11FORM_DATA,
	ONCHANGE_FORM1,
	ONCHANGE_FORM2,
	ONCHANGE_FORM3,
	ONCHANGE_FORM4,
	ONCHANGE_FORM5,
	ONCHANGE_FORM6,
	ONCHANGE_FORM7,
	ONCHANGE_FORM8,
	SET_LOADING,
	SET_NEXT_STEP,
	SET_P11STATUS,
	SET_ROSTER_PROCESS_P11,
	SET_DISCLAIMER_AGREE,
	SET_DISCLAIMER_OPEN
} from '../types/p11Types';
import moment from 'moment';
import { SET_ROSTER_PROCESS } from '../types/optionTypes';

const initialState = {
	p11Status: {
		form1: 0,
		form2: 0,
		form3: 0,
		form4: 0,
		form5: 0,
		form6: 0,
		form7: 0,
		form8: 0,
	},
	errors: {},
	isValid: false,
	loading: false,
	nextStep: false,
	form1: {
		family_name: '',
		first_name: '',
		// maiden_name: '',
		middle_name: '',
		// bdate: '',
		// bmonth: '',
		// byear: '',
		// years: [],
		// place_of_birth: '',
		// marital_status: '',
		birth_nationalities: [],
		present_nationalities: [],
		gender: 1,
		// has_disabilities: 1,
		// disabilities: '',
		immap_office: {},
		phone_counts: 0,
		phones: [],
		is_primary: '',
		is_immaper: 0,
		immap_email: '',
		immap_office: '',
		project: '',
		is_immap_inc: 1,
		is_immap_france: 0,
		job_title: '',
		duty_station: '',
		start_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
		end_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
		line_manager: '',
		line_manager_id: '',
		immap_contract_international: 0,
		country_residence: '',
		office_telephone: '',
		skype: '',
		office_email: ''
	},
	form2: {
		values: [],
		preferred_field_of_work: [],
		un_organizations: [],
		accept_employment_less_than_six_month: 1,
		previously_submitted_application_for_UN: 0,
		previously_submitted_application_for_UN_counts: 0
	},
	form3: {
		languages: [],
		knowledge_of_language_counts: 0
	},
	form4: {
		education_universities_counts: 0,
		education_schools_counts: 0
	},
	form5: {
		employment_records_counts: 0,
		objections_making_inquiry_of_present_employer: 0,
		sectors: 0,
		sectors_count: 0,
		skills: 0,
		skills_counts: 0,
		permanent_civil_servant: 0,
		permanent_civil_servants_counts: 0,
		objection_name: '',
		objection_email: '',
		objection_position: '',
		objection_organization: '',
		// professional_societies_counts: 0,
		publications_counts: 0,
		// has_professional_societies: 1,
		has_publications: 1
	},
	form6: {
		references_counts: 0,
		relevant_facts: ''
	},
	form7: {
		portfolios_counts: 0,
		skills: [],
		skills_counts: 0
	},
	form8: {
		cv: {},
		signature: {},
		photo: {},
		linkedin_url: '',
		become_roster: 0,
		selected_roster_process: [],
		share_profile_consent: 0,
		hear_about_us_from: '',
		other_text: '',
	},
	roster_processes: [],
	disclaimer_agree: 1,
	disclaimer_open: 0
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_P11STATUS:
			return {
				...state,
				p11Status: action.p11Status
			};
		case CHECK_ERROR:
			return {
				...state,
				errors: action.error,
				isValid: action.valid
			};
		case SET_LOADING:
			return {
				...state,
				loading: action.loading
			};
		case SET_NEXT_STEP:
			return {
				...state,
				nextStep: action.next
			};
		case SET_P11FORM_DATA:
			return {
				...state,
				[action.form_name]: action.form_data
			};
		case ONCHANGE_FORM1:
			return {
				...state,
				form1: {
					...state.form1,
					[action.name]: action.value
				}
			};
		case ONCHANGE_FORM2:
			return {
				...state,
				form2: {
					...state.form2,
					[action.name]: action.value
				}
			};
		case ONCHANGE_FORM3:
			return {
				...state,
				form3: {
					...state.form3,
					[action.name]: action.value
				}
			};
		case ONCHANGE_FORM4:
			return {
				...state,
				form4: {
					...state.form4,
					[action.name]: action.value
				}
			};
		case ONCHANGE_FORM5:
			return {
				...state,
				form5: {
					...state.form5,
					[action.name]: action.value
				}
			};
		case ONCHANGE_FORM6:
			return {
				...state,
				form6: {
					...state.form6,
					[action.name]: action.value
				}
			};
		case ONCHANGE_FORM7:
			return {
				...state,
				form7: {
					...state.form7,
					[action.name]: action.value
				}
			};
		case ONCHANGE_FORM8:
			return {
				...state,
				form8: {
					...state.form8,
					[action.name]: action.value
				}
			};
		case SET_ROSTER_PROCESS_P11:
			return {
				...state,
				roster_processes: action.value
			};
		case SET_DISCLAIMER_AGREE:
			return {
				...state,
				disclaimer_agree: action.value
			};
		case SET_DISCLAIMER_OPEN:
			return {
				...state,
				disclaimer_open: action.value
			};
		default:
			return state;
	}
};
