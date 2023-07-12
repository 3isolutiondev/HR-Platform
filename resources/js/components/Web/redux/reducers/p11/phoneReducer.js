import { ONCHANGE_PHONE, SET_PHONE_LISTS } from '../../types/p11/phoneType';
import { stat } from 'fs';

const initialState = {
  phone: '',
  phoneLists: [],
  phoneTableColumns: [
    {
      name: 'id',
      options: {
        display: 'excluded',
        filter: false,
        sort: false
      }
    },
    {
      name: 'Phone',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'Primary Number',
      options: {
        filter: false,
        sort: false
      }
    },
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false
      }
    }
  ],
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case ONCHANGE_PHONE:
      return {
        ...state,
        phone: action.value
      };
    case SET_PHONE_LISTS:
      return {
        ...stat,
        phoneLists: []
      };

    default:
      return state;
  }
}

