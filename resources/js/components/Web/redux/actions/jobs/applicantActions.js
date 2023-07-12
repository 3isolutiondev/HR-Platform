import axios from 'axios';
import moment from 'moment';
import { SET_APPLICANT_LISTS, SET_BULK_APPLICANT_LISTS } from '../../types/jobs/applicantTypes';
import { addFlashMessage } from '../webActions';
import {onChangeRequestContract} from './requestContractActions'
import isEmpty from '../../../validations/common/isEmpty';
import Cookies from 'js-cookie';
import FileDownload from 'js-file-download';
import textSelector from "../../../utils/textSelector";

/**
 * [Applicant]
 * onChange is a redux action function.
 * It will change the value of applicant reducer state data (applicantReducer), by sending the new state name and value
 *
 * @param {string} name  reducer state name
 * @param {*} value      the new value to be put
 * @return {Promise}
 */
export const onChange = (name, value) => {
	return {
		type: SET_APPLICANT_LISTS,
		name,
		value
	};
};

/**
 * [Applicant]
 * bulkChange is a redux action function.
 * It will change the value of applicant reducer state data (applicantReducer) in bulk mode, by sending the new value
 *
 * @param {Object} value - new value in object i.e: { openAvailability: true, show_full_name: 'Name' }
 * @return {Promise}
 */
export const bulkChange = (value) => {
	return {
		type: SET_BULK_APPLICANT_LISTS,
		bulkData: value
	};
};

/**
 * [Applicant]
 * tabChange is a redux action function.
 * it change will change tab data
 *
 * @param {Event}   e
 * @param {number}  jobStatusTab - tab value ~ jobStatusTab in reducer state
 * @return {Promise}
 */
export const tabChange = (e, jobStatusTab) => (dispatch) => {
	return dispatch(onChange('jobStatusTab', jobStatusTab));
};

/**
 * [Applicant]
 * tabChange is a redux action function.
 * It get applicant profile
 *
 * @param {Boolean} pagination  - is Pagination or not
 * @param {number}  page_number - page number
 * @return {Promise}
 */
export const getApplicantProfiles = (pagination = false, page_number = '') => (dispatch, getState) => {
	let { job_id, jobStatusTab, job_status } = getState().applicant_lists;
	dispatch({
		type: SET_BULK_APPLICANT_LISTS,
		bulkData: {
			profiles: [],
			moveduser: [],
			isManager: []
		}
	});

	let {
		chosen_sector,
		chosen_skill,
		chosen_language,
		chosen_degree_level,
		chosen_field_of_work,
		chosen_country,
		chosen_nationality,
		chosen_country_of_residence,
		search,
		experience,
		immaper_status,
		select_gender,
		is_available,
		minimumRequirements,
	} = getState().filter;
	if (!isEmpty(job_status)) {
		const paginationLink = pagination ? '?page=' + page_number : '';
		if (!isEmpty(job_id)) {
			const apiURL =
				'/api/jobs/' + job_id + '/applicants/' + job_status[jobStatusTab]['value'] + '/filter' + paginationLink;
			axios
				.post(apiURL, {
					chosen_sector,
					chosen_skill,
					chosen_language,
					chosen_degree_level,
					chosen_field_of_work,
					chosen_country,
					chosen_nationality,
					chosen_country_of_residence,
					search,
					experience,
					minimum_requirements: minimumRequirements,
					immaper_status: isEmpty(immaper_status) ? null : immaper_status,
					select_gender: isEmpty(select_gender) ? null : select_gender,
					is_available: isEmpty(is_available) ? null : is_available
				})
				.then((res) => {
					return dispatch({
						type: SET_BULK_APPLICANT_LISTS,
						bulkData: {
							profiles: res.data.data.users,
							moveduser: res.data.data.moveduser,
							isManager: res.data.data.is_manager
						}
					});
				})
				.catch((err) => {
					return dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while retrieving applicants profile'
						})
					);
				});
		}
	}
};

/**
 * [Applicant]
 * openCloseProfile is a redux action function.
 * function to open / close profle modal
 *
 * @param {number} profile_id - profile id
 * @return {Promise}
 */
export const openCloseProfile = (profile_id = '') => (dispatch, getState) => {
	const { openProfile } = getState().applicant_lists;
	if (openProfile) {
		dispatch(onChange('selected_profile_id', ''));
		return dispatch(onChange('openProfile', false));
	} else {
		dispatch(onChange('selected_profile_id', profile_id));
		return dispatch(onChange('openProfile', true));
	}
};

/**
 * [Applicant]
 * openCloseRequestContractForm is a function to open / close request contract form
 * @param {Object} user
 * @return {Promise}
 */
export const openCloseRequestContractForm = (user={}) => (dispatch, getState) => {
	const { openRequestContract } = getState().applicant_lists;
	if (openRequestContract) {
		dispatch(getApplicantProfiles());
		dispatch(onChangeRequestContract('profile',user.profile));
		dispatch(onChangeRequestContract('full_name',user.full_name));
		return dispatch(onChange('openRequestContract', false));
	} else {
		dispatch(onChangeRequestContract('profile',user.profile));
		dispatch(onChangeRequestContract('full_name',user.full_name));
		return dispatch(onChange('openRequestContract', true));
	}
};

/**
 * [Applicant]
 * jobStatusOnChange is a function to change applicant status
 * @param {Object} job_status
 * @param {number} user_id
 * @return {Promise}
 */
export const jobStatusOnChange = (job_status, user_id) => (dispatch, getState) => {
	const { job_id } = getState().applicant_lists;
	return axios
		.post('/api/jobs/' + job_id + '/change-status', {
			job_status_id: job_status.value,
			user_id
		})
		.then((res) => {
			dispatch(
				addFlashMessage({
					type: 'success',
					text: 'Job status successfully changed'
				})
			);
			dispatch(getApplicantProfiles());
			return true;
		})
		.catch((err) => {
      let errorMsg = "Sorry, we cannot moving the applicant for now."
      if (!isEmpty(err.response)) {
        if (err.response.status === 422 && !isEmpty(err.response.data.message)) {
          errorMsg = err.response.data.message
        }
      }
			dispatch(
				addFlashMessage({
					type: 'error',
					text: errorMsg
				})
			);
			return false;
		});
};

/**
 * [Applicant]
 * saveInterviewDate is a function to save interview data
 * @param {number} user_id
 * @param {Object} job_status
 * @param {string} interviewDate
 * @return {Promise}
 */
export const saveInterviewDate = (user_id, job_status, interviewDate, timezone = '') => (dispatch, getState) => {
	const { job_id } = getState().applicant_lists;

	if (job_status.is_interview != 1) {
		return dispatch(
			addFlashMessage({
				type: 'error',
				text: 'Only can save interview date when job status is interview'
			})
		);
	}

	return axios
		.post('/api/jobs/' + job_id + '/save-interview-date', {
			user_id,
			job_status_id: job_status.value,
			interviewDate: moment(interviewDate).format('YYYY-MM-DD HH:mm:ss'),
			timezone,
		})
		.then((res) => {
			return dispatch(
				addFlashMessage({
					type: 'success',
					text: 'Job status successfully changed'
				})
			);
		})
		.catch((err) => {
			return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while saving interview date'
				})
			);
		});
};


/**
 * [Applicant]
 * sendInterview is a function to send interview invitation
 * @param {number} user_id
 * @param {Object} job_status
 * @param {string} interview_date
 * @param {Object} timezone
 * @param {string} skype_id
 * @param {Object[]} immaper_invite
 * @param {Object[]} panel_interview
 * @param {number} interview_type
 * @param {string} interview_address
 * @param {Boolean} noError
 * @param {string} commentText
 * @return {Promise}
 */
export const sendInterview = (
	user_id,
	job_status,
	interview_date,
	timezone,
	skype_id = '',
	immaper_invite,
	panel_interview,
	interview_type,
	interview_address,
	noError,
	commentText
) => (dispatch, getState) => {
	if (!noError) {
		return dispatch(
			addFlashMessage({
				type: 'error',
				text: 'There is an error in the form, please complete field below'
			})
		);
	}

	let { job_id } = getState().applicant_lists;

	if (job_status.is_interview != 1) {
		return dispatch(
			addFlashMessage({
				type: 'error',
				text: 'Send interview invitation is available in Interview step only'
			})
		);
	}

	return axios
		.post('/api/jobs/' + job_id + '/send-interview-invitation', {
			user_id,
			job_status_id: job_status.value,
			interview_date: moment(interview_date).format('YYYY-MM-DD HH:mm:ss'),
			timezone: timezone.value,
			skype_id: isEmpty(skype_id) ? null : skype_id,
			immaper_invite: immaper_invite,
			panel_interview: panel_interview,
			interview_type,
			interview_address: interview_type === 1 ? interview_address : '',
			microsoft_access_token: Cookies.get('microsoft_access_token') ? Cookies.get('microsoft_access_token') : '',
			microsoft_refresh_token: Cookies.get('microsoft_refresh_token') ? Cookies.get('microsoft_refresh_token') : '',
			microsoft_token_expire: Cookies.get('microsoft_token_expire') ? Cookies.get('microsoft_token_expire') : '',
			commentText: commentText
		})
		.then((res) => {
			if(res.data.data) {
				if(res.data.data.access_token) Cookies.set("microsoft_access_token", res.data.data.access_token);
				if(res.data.data.refresh_token) Cookies.set("microsoft_refresh_token", res.data.data.refresh_token);
				if(res.data.data.expires_in) Cookies.set("microsoft_token_expire",  res.data.data.expires_in);
			}
			return dispatch(
				addFlashMessage({
					type: 'success',
					text: 'Interview invitation successfully sent'
				})
			);
		})
		.catch((err) => {
      if (err.response.status === 403) {
        return dispatch(
          addFlashMessage({
            type: 'error',
            text: "You don't have access to use this feature"
          })
        );
      } else if(err.response.status === 500 && err.response.data.message && err.response.data.message.startsWith('http')) {
			return {
				url: err.response.data.message
			}
		}

		return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while sending interview invitation'
				})
			);
		});
};

/**
 * [Applicant]
 * uploadFiles is a function to upload interview files
 * @param {Object} data
 * @param {number} id_jobs_interview_files
 * @return {Promise}
 */
export const uploadFiles = (data, id_jobs_interview_files) => (dispatch, getState) => {
	let { immap_email, id, full_name } = getState().auth.user.data;
	const formData = new FormData();
	formData.append('file', data.file);
	formData.append('immap_email', immap_email);
	formData.append('user_interview_id', id);
	formData.append('user_interview_name', full_name);
	formData.append('job_id', data.job_id);
	formData.append('job_user_id', data.job_user_id);
	formData.append('user_id', data.user_id);

  const uploadURL = (data.type == 'post') ? '/api/job-interview-files' : `/api/job-interview-files/${id_jobs_interview_files}`;
  return axios
    .post(uploadURL, formData)
    .then((res) => {
      dispatch(getApplicantProfiles());
      return dispatch(
        addFlashMessage({
          type: 'success',
          text: 'Upload file succces'
        })
      );
    })
    .catch((err) => {
      return dispatch(
        addFlashMessage({
          type: (data.type == 'post') ? err.response.data.status : 'error',
          text: `There is an error while ${(data.type == 'post') ? 'submitting' : 'updating'} the data`
        })
      );
    });
};

/**
 * [Applicant]
 * changePhysicalInterview is a function to change physical interview data for an applicant
 * @param {number} user_id
 * @param {number} interview_type
 * @return {Promise}
 */
export const changePhysicalInterview = (user_id, interview_type) => (dispatch, getState) => {
	let { job_id } = getState().applicant_lists;
	return axios
		.post('/api/jobs/' + job_id + '/change-physical-interview', {
			user_id,
			interview_type
		})
		.then((res) => {
			dispatch(
				addFlashMessage({
					type: 'success',
					text: 'Physical Interview Already Updated'
				})
			);
			return true;
		})
		.catch((err) => {
			dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while updating physical interview'
				})
			);
			return false;
		});
};

//Detele an applicant by admin
/**
 * [Applicant]
 * deleteApplicant is a function to delete an applicant only by admin
 * @param {number} id     - job id
 * @param {number} userId - user id
 * @return {Promise}
 */
export const deleteApplicant = (id,userId) =>(dispatch) =>{
  return axios.delete('/api/jobs/delete-applicant' + '/' + id + '/' + userId).then((res) => {
	  dispatch(getApplicantProfiles());
	  dispatch(addFlashMessage({
		type: 'success',
		text: 'Applicant successfully deleted'
	  })
	);
	})
	.catch((err) => {
	  dispatch(
		addFlashMessage({
			type: 'error',
			text: 'There is an error while processing the delete request'
		  })
		);
	});
}

//Detele an application by own of the application
/**
 * [Applicant]
 * deleteApplication is a function to delete job application by the applicant itself
 * @param {number} id           - job id
 * @param {number} userId       - user id
 * @param {Function} fetchData  - fetch data
 * @return {Promise}
 */
export const deleteApplication = (id, userId, fetchData) =>(dispatch) =>{
	return axios.delete('/api/jobs/delete-application' + '/' + id + '/' + userId).then((res) => {
		fetchData();
		dispatch(addFlashMessage({
		  type: 'success',
		  text: 'Applicant successfully deleted'
		})
	  );
	  })
	  .catch((err) => {
		dispatch(
		  addFlashMessage({
			  type: 'error',
			  text: 'There is an error while processing the delete request'
			})
		  );
	  });
  }

  /**
   * [Applicant]
   * closeOpenAvailability is a function to close availability and current location pop up
   * @returns {Object}
   */
export const closeOpenAvailability = () => {
  return {
    type: SET_BULK_APPLICANT_LISTS,
    bulkData: {
      openAvailability: false,
      show_start_date_availability: '',
      show_departing_from: '',
      show_full_name: ''
    }
  }
}

/**
 * getJobProfilesForExport is an action to get job profiles data of the current status.
 * @returns {Promise|File}
 */
 export const getJobProfilesForExport = (jobTitle) => (dispatch, getState) => {
	let { job_id, jobStatusTab } = getState().applicant_lists;
	let job_status = getState().options.job_status;

	if (!isEmpty(job_id) && !isEmpty(jobStatusTab)) {
	  return axios
	  .get('/api/jobs/download-profiles/' + job_id + '/' + job_status[jobStatusTab]['value'], { responseType: 'blob'})
	  .then((res) => {
		return FileDownload(
		  res.data,
		  'Job profiles - ' +
		  jobTitle +
		  ' - ' +
		  ' #Step- ' +
		  job_status[jobStatusTab]['label'] +
		  ' - ' +
		  moment().format('YYYY-MM-DD-HH-mm-ss') +
		  '.xlsx'
		);
	  })
	  .catch((err) => {
		return dispatch(
		  addFlashMessage({
			type: 'error',
			text: textSelector('error', 'downloadError')
		  })
		);
	  });
	}
  };
