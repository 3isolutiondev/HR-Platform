import {
    SET_TOR_TAB,
    SET_TOR_TAB_PAGE
} from '../../types/tor/torTabTypes';

const initialState = {
    tabValue: null,
    page: '1',
    tabs: []
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_TOR_TAB:
            return {
                ...state,
                [action.name]: action.value
            };
        case SET_TOR_TAB_PAGE:
            return {
                ...state,
                tabValue: action.value.tab,
                page: action.value.page
            };
        default:
            return state;
    }
};
