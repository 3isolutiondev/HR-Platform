// import axios from 'axios';
import { SET_DROPZONE_OPEN, SET_FILES } from '../../types/formFields/dropzoneTypes';
// import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

export const openDropzone = () => {
	return {
		type: SET_DROPZONE_OPEN,
		isOpen: true
	};
};

export const closeDropzone = () => {
	return {
		type: SET_DROPZONE_OPEN,
		isOpen: false
	};
};

export const setFiles = (files) => {
	return {
		type: SET_FILES,
		files
	};
};

// export const setGalleryFiles = (files) => {
//   return {
//     type: SET_GALLERY_FILES,
//     files
//   }
// }

// export const uploadFailed = (err) => {
//   return {
//     type: ADD_FLASH_MESSAGE,
//     message: {
//       type: 'error',
//       message: 'There is an error while retrieving nationalities data'
//     }
//   }
// }

// export const uploadFiles = (apiURL, files) => {
//   return dispatch => {
//     axios.post(apiURL, files)
//     .then(res => {
//       dispatch(setGalleryFiles(res.data.data))
//     })
//     .catch(err => {
//       dispatch(uploadFailes(err))

//     })
//   }
// }
