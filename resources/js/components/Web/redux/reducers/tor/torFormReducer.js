import { SET_TOR_FORM_DATA, RESET_TOR_FORM, CHECK_ERROR_TOR_FORM } from '../../types/tor/torFormTypes';
import moment from 'moment';


const initialState = {
    id: null,
    jobStandards: [],
    jobStandard: '',
    jobCategories: [],
    jobCategory: '',
    jobLevels: [],
    jobLevel: '',
    id: '',
    title: '',
    contract_start: moment(new Date()),
    contract_end: moment(new Date()).add(6, 'M'),
    duty_station: '',
    mailing_address: '',
    matching_requirements: [],
    matching_errors: {},
    sub_sections: [],
    default_section: {
        sub_section: '',
        sub_section_content: '',
        level: 0
    },
    organization: 'iMMAP',
    relationship: '',
    country: '',
    program_title: '',
    durations: [],
    duration: '',
    min_salary: '',
    max_salary: '',
    is_immap_inc: 0,
    is_immap_france: 0,
    is_international: 0,
    with_template: 1,
    is_organization: 0,
    immap_office: '',
    skillset: '',
    jobLevelURL: '/api/hr-job-levels/all-options',
    errors: {},
    isEdit: false,
    apiURL: '/api/tor',
    redirectURL: '/tor',
    jobStandardURL: '/api/hr-job-standards',
    jobCategoryURL: '/api/hr-job-categories',
    organizationURL: '/api/settings',
    mailingAddressURL: '/api/settings/options/mailing-address',
    durationsURL: '/api/durations/all-options',
    isLoading: false,
    loading: false,
    duplicatingLoading: false,
    is_shared: false,
    hq_us: '',
    hq_france: '',
    other_category_open: false,
    other_category: '',
    isValid: false,
    change: false,
    cluster_seconded:'',
    cluster: ''
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_TOR_FORM_DATA:
            return {
                ...state,
                [action.name]: action.value
            };
        case CHECK_ERROR_TOR_FORM:
            return {
                ...state,
                errors: action.error,
                isValid: action.valid,
            };
        case RESET_TOR_FORM:
            return initialState;
        default:
            return state;
    }
};
