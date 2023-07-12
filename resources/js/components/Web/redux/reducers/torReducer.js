import isEmpty from "../../validations/common/isEmpty";

const initialState = {
  job_standard_id: false,
  job_category_id: false,
  job_level_id: {},
  title: '',
  duty_station: ''
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: !isEmpty(action.user),
        user: action.user
      }
    default: return state;
  }
}
