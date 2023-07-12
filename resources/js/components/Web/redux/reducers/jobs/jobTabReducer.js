import {
    SET_JOB_TAB,
    SET_TAB_PAGE
} from '../../types/jobs/jobsTabTypes';

const initialState = {
    tabValue: 0,
    page: '1',
    tabs: [
      {id: 0, name: 'All Jobs', slug: 'all-jobs'},
      {id: 4, name: 'Surge Roster Recruitment Campaign', slug: 'surge-roster-recruitment-campaign'},
      {id: 3, name: 'Surge Roster Program Alert', slug: 'surge-roster-program-alert'},
      {id: 1, name: 'My Recruitments', slug: 'my-recruitments'},
      {id: 2, name: 'Archives', slug: 'archives'}
    ]
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_JOB_TAB:
            return {
                ...state,
                [action.name]: action.value
            };
        case SET_TAB_PAGE:
            return {
                ...state,
                tabValue: action.value.tab,
                page: action.value.page
            };
        default:
            return state;
    }
};
