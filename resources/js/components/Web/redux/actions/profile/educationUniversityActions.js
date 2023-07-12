import axios from "axios";
import { SET_UNIVERSITY } from "../../types/profile/profileTypes";
import { ADD_FLASH_MESSAGE } from "../../types/webTypes";

// GET UNIVERSITY
export const getUniversity = () => {
  return (dispatch, getState) => {
    const { profileID } = getState().profileRosterProcess;
    if (profileID === true) {
      return axios
        .get("/api/profile-education-universities/")
        .then((res) => {
          let data = res.data.data;
          if (res.data.data.education_universities_counts >= 1) {
            data = { ...res.data.data, show: true };
          } else if (res.data.data.education_universities_counts <= 0) {
            data = { ...res.data.data, show: false };
          }
          dispatch(setUniversity(data));
        })
        .catch((err) => {
          dispatch(setUniversityFailed(err));
        });
    } else if (profileID > 0) {
      return axios
        .get("/api/profile-education-universities/" + profileID)
        .then((res) => {
          let data = res.data.data;
          if (res.data.data.education_universities_counts >= 1) {
            data = { ...res.data.data, show: true };
          } else if (res.data.data.education_universities_counts <= 0) {
            data = { ...res.data.data, show: false };
          }
          dispatch(setUniversity(data));
        })
        .catch((err) => {
          dispatch(setUniversityFailed(err));
        });
    }
  };
};

// SET UNIVERSITY
export const setUniversity = (university) => {
  return {
    type: SET_UNIVERSITY,
    university,
  };
};

// SET UNIVERSITY ERROR MESSAGE
export const setUniversityFailed = () => {
  return {
    type: ADD_FLASH_MESSAGE,
    message: {
      type: "error",
      text: "There is an error while retrieving education data",
    },
  };
};
