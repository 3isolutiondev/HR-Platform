import axios from "axios";
import { SET_COMPLETED_PROFILE_DATA } from "../../types/allprofiles/allProfilesTypes";
import { addFlashMessage } from "../webActions";
import { onChange as filterOnChange } from './AllProfilesFilterActions';

import isEmpty from "../../../validations/common/isEmpty";
import pick from "lodash/pick";

export const onChange = (name, value) => {
  return {
    type: SET_COMPLETED_PROFILE_DATA,
    name,
    value,
  };
};

export const getCompletedProfile = () => (dispatch, getState) => {
  const {
    chosen_sector,
    chosen_skill,
    chosen_language,
    chosen_degree_level,
    chosen_field_of_work,
    chosen_country,
    chosen_nationality,
    chosen_country_of_residence,
    is_available,
    search,
    experience,
    immaper_status,
    select_gender,
    current_page,
    filterType,
    show_starred_only
  } = getState().allProfilesFilter;

  let formData = {
    chosen_sector,
    chosen_skill,
    chosen_language,
    chosen_degree_level,
    chosen_field_of_work,
    chosen_country,
    chosen_nationality,
    chosen_country_of_residence,
    is_available,
    search,
    experience,
    immaper_status,
    select_gender,
    filterType,
    show_starred_only
  };

  dispatch(onChange("isLoading", true));
  return axios
    .post(`/api/completed-profiles?page=${current_page}`, formData)
    .then((res) => {
      dispatch(onChange("profiles", res.data.data.data));
      dispatch(filterOnChange('current_page', res.data.data.current_page));
      dispatch(filterOnChange('last_page', res.data.data.last_page));
      dispatch(filterOnChange('totalCount', res.data.data.total));
      return dispatch(onChange("isLoading", false));
    })
    .catch((err) => {
      return dispatch(
        addFlashMessage({
          type: "error",
          message: "There is an error while retrieving completed profiles data",
        })
      );
    });
};

export const openCloseProfile = (id = "") => (dispatch) => {
  dispatch(onChange("selected_profile_id", id));
  return dispatch(onChange("openProfile", isEmpty(id) ? false : true));
};

export const selectProfile = (isChecked, id) => (dispatch, getState) => {
  let selected = pick(getState().allProfiles, ["selected_profile_ids"]);

  if (isChecked) {
    selected.selected_profile_ids.push(id);
  } else {
    let idExist = selected.selected_profile_ids.indexOf(id);
    if (idExist > -1) {
      selected.selected_profile_ids.splice(idExist, 1);
    }
  }

  return dispatch(
    onChange("selected_profile_ids", selected.selected_profile_ids)
  );
};

export const getJobOpening = () => (dispatch) => {
  return axios
    .get("/api/get-available-job")
    .then((res) => {
      return dispatch(onChange("job_openings", res.data.data));
    })
    .catch((err) => {
      return dispatch(
        addFlashMessage({
          type: "error",
          text: "There is an error while retrieving job openings",
        })
      );
    });
};

export const getRosterProcess = () => (dispatch) => {
  return axios
    .get("/api/get-roster-process")
    .then((res) => {
      return dispatch(onChange("roster_process", res.data.data));
    })
    .catch((err) => {
      return dispatch(
        addFlashMessage({
          type: "error",
          text: "There is an error while retrieving roster process",
        })
      );
    });
};

export const sendInvitation = (profile_id, invitation_type, data) => (
  dispatch
) => {
  let invite_data = {
    profile_id: profile_id,
    invitation_type: invitation_type,
    chosen_job_id: invitation_type === "0" ? data : "",
    chosen_roster_id: invitation_type === "1" ? data : "",
  };

  return axios
    .post("/api/send-invitation-complete-profile", invite_data)
    .then((res) => {
      return dispatch(
        addFlashMessage({
          type: "success",
          text: "Invitation successfully sent!",
        })
      );
    })
    .catch((err) => {
      let message = "There is an error while sending the invitation";
      if(err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      return dispatch(
        addFlashMessage({
          type: "error",
          text: message
        })
      );
    });
};

export const toggleArchive = (user_id) => async (dispatch) => {
  dispatch(onChange('archiveUserId', user_id));
  await dispatch(onChange('archiveLoading', true));
  return axios
    .post('/api/completed-profiles/archive', { user_id })
    .then(res => {
      dispatch(onChange('archiveLoading', false))
      if (!isEmpty(res.data.data.cannotArchive)) {
        dispatch(onChange('jobRecruitmentProcess', res.data.data.jobRecruitmentProcess));
        dispatch(onChange('rosterRecruitmentProcess', res.data.data.rosterRecruitmentProcess));
        dispatch(onChange('surgeAlertRecruitmentProcess', res.data.data.surgeAlertRecruitmentProcess));
        dispatch(onChange('openInfo', true));
        return dispatch(addFlashMessage({ type: 'warning', text: res.data.message }));
      }
      dispatch(addFlashMessage({ type: 'success', text: res.data.message }));
      return dispatch(getCompletedProfile())
    })
    .catch(err => {
      if (!isEmpty(err.response)) {
        if (err.response.status) {
          if (err.response.status == 422) {
            return dispatch(
              addFlashMessage({
                type: "error",
                text: err.response.data.message,
              })
            );
          }
        }
      }
      return dispatch(
        addFlashMessage({
          type: "error",
          text: "There is an error while archive/unarchive the user",
        })
      );
    })
}

export const toggleStar = (user_id) => (dispatch) => {
  return axios
    .post('/api/completed-profiles/star', { user_id })
    .then(res => {
      dispatch(addFlashMessage({ type: 'success', text: res.data.message }))
      return dispatch(getCompletedProfile())
    })
    .catch(err => {
      if (!isEmpty(err.response)) {
        if (err.response.status) {
          if (err.response.status == 422) {
            return dispatch(
              addFlashMessage({
                type: "error",
                text: err.response.data.message,
              })
            );
          }
        }
      }
      return dispatch(
        addFlashMessage({
          type: "error",
          text: "There is an error while star/unstar the user",
        })
      );
    })
}
