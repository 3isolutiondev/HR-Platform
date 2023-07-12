import axios from "axios";
import { SET_SCHOOL } from "../../types/profile/profileTypes";
import { ADD_FLASH_MESSAGE } from "../../types/webTypes";

// GET SCHOOL
export const getSchool = () => {
  return (dispatch, getState) => {
    const { profileID } = getState().profileRosterProcess;
    if (profileID === true) {
      return axios
        .get("/api/profile-education-schools/")
        .then((res) => {
          let data = res.data.data;
          if (res.data.data.education_schools_counts >= 1) {
            data = { ...res.data.data, show: true };
          } else if (res.data.data.education_schools_counts <= 0) {
            data = { ...res.data.data, show: false };
          }
          dispatch(setSchool(data));
        })
        .catch((err) => {
          dispatch(setSchoolFailed(err));
        });
    } else if (profileID > 0) {
      return axios
        .get("/api/profile-education-schools/" + profileID)
        .then((res) => {
          let data = res.data.data;
          if (res.data.data.education_schools_counts >= 1) {
            data = { ...res.data.data, show: true };
          } else if (res.data.data.education_schools_counts <= 0) {
            data = { ...res.data.data, show: false };
          }
          dispatch(setSchool(data));
        })
        .catch((err) => {
          dispatch(setSchoolFailed(err));
        });
    }
  };
};

// SET SCHOOL
export const setSchool = (school) => {
  return {
    type: SET_SCHOOL,
    school,
  };
};

// SET SCHOOL ERROR MESSAGE
export const setSchoolFailed = () => {
  return {
    type: ADD_FLASH_MESSAGE,
    message: {
      type: "error",
      text: "There is an error while retrieving school data",
    },
  };
};
