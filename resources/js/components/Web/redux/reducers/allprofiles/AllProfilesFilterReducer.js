import {
    SET_COMPLETED_PROFILE_FILTER_DATA,
    RESET_FILTER_COMPLETED_PROFILE_FILTER_DATA
} from '../../types/allprofiles/allProfilesTypes';

const initialState = {
    // filter data
    search: '',
    searchTemp: '',
    language_lists:[],
    degree_level_lists: [],
    sector_lists:[],
    skill_lists: [],
    field_of_work_lists:[],
    country_lists:[],
    nationality_lists:[],
    chosen_language: [],
    chosen_degree_level: [],
    chosen_sector: [],
    chosen_skill: [],
    chosen_field_of_work: [],
    chosen_country: [],
    chosen_nationality: [],
    chosen_country_of_residence: '',
    is_available: [],
    gender_filter: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'do_not_want_specify', label:'Do not want to specify' },
        { value: 'other', label: 'Other' }
    ],
    immaper_filter: [{ value: 'is_immaper', label: 'Consultant' }, { value: 'not_immaper', label: 'Not Consultant' }],
    available_filter: [
        { value: 'available', label: 'Available' },
        { value: 'not_available', label: 'Not Available' }
    ],
    show_starred_only: "no",
    search_language: '',
    search_sector: '',
    search_skill: '',
    search_degree_level: '',
    search_field_of_work: '',
    search_country: '',
    search_nationality: '',
    experience: 0,
    immaper_status: [],
    select_gender:[],
    languageDialog: false,
    sectorDialog: false,
    skillDialog: false,
    degreeLevelDialog: false,
    fieldOfWorkDialog: false,
    countryDialog: false,
    nationalityDialog: false,
    languageParameters: {
        id: '',
        language_level: {
            value: '',
            label: ''
        },
        is_mother_tongue: 0
    },
    sectorParameters: {
        id: '',
        years: 1
    },
    skillParameters: {
        id: '',
        years: 1,
        rating: 1
    },
    degreeLevelParameters: {
        id: '',
        degree: '',
        study: ''
    },
    fieldOfWorkParameters: {
        id: ''
    },
    nationalityParameters: {
        id: ''
    },
    countryParameters: {
        id: '',
        years: 1
    },
    filterFor: 'applicant',
    errors: {},
    current_page: 1,
    last_page: 1,
    totalCount: 0,
    filterType: 'talent-pool'
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_COMPLETED_PROFILE_FILTER_DATA:
            return {
                ...state,
                [action.name]: action.value
            };
        case RESET_FILTER_COMPLETED_PROFILE_FILTER_DATA:
            return {
                ...state,
                chosen_sector: [],
                chosen_skill: [],
                chosen_language: [],
                chosen_degree_level: [],
                chosen_field_of_work: [],
                chosen_country: [],
                chosen_nationality: [],
                chosen_country_of_residence: '',
                is_available: [],
                search: '',
                searchTemp: '',
                experience: 0,
                immaper_status: [],
                select_gender: [],
                search_language: '',
                search_sector: '',
                search_skill: '',
                search_degree_level: '',
                search_field_of_work: '',
                search_country: '',
                search_nationality: '',
                show_starred_only: "no"
            };
        default:
            return state;
    }
};
