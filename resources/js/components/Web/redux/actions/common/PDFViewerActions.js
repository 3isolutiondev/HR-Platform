import axios from 'axios';
import { SET_PDF } from '../../types/common/PDFViewerTypes';
import { addFlashMessage } from '../webActions';

/** import FileDownload */
import FileDownload from 'js-file-download';

/**
 * [PdfViewer]
 * onPDFLoaded is a redux action function.
 * It will change the value of pdfViewer reducer state, by sending the new state name and value
 *
 * @param {string} name  reducer state name
 * @param {*} value      the new value to be put
 * @returns
 */
export const onPDFLoaded = (name, value) => (dispatch) => {
	return dispatch({
		type: SET_PDF,
		name,
		value
	});
};

/**
 * [PdfViewer]
 * getPDF is a redux action function to get pdf file by calling an api
 *
 * @param {string} apiURL
 * @param {boolean} canDownload
 * @returns
 */
export const getPDF = (apiURL, canDownload = true) => (dispatch) => {
	return axios
		.get(apiURL)
		.then(async (res) => {
			dispatch(onPDFLoaded('pdfViewerOpen', true));
			dispatch(onPDFLoaded('canDownload', canDownload));

      const getFileURL = res.data.data.replace(window.location.origin, `${window.location.origin}/api`);
      await axios.get(getFileURL, {responseType: 'blob'})
      .then(res => {
        let fileReader = new window.FileReader();
        fileReader.readAsDataURL(res.data);
        fileReader.onload = () => {
          dispatch(onPDFLoaded('blobFile', fileReader.result));
          dispatch(onPDFLoaded('fileURL', getFileURL));
        };
        return true;
      })
			dispatch(onPDFLoaded('fileURL', res.data.data));
		})
		.catch((err) => {
			return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while getting pdf file'
				})
			);
		});
		
};

/**
 * getWORD is a redux action function to download word document by calling an api
 *
 * @param {string} apiURL
 * @param {boolean} canDownload
 * @returns
 */

export const getWORD = (apiURL)=>(dispatch) =>{
	return axios
		.get(apiURL)
		.then(async (res) =>{

			const link = document.createElement('a');
			link.href = res.data['data'];
			link.target = "_blank";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			return dispatch(
				addFlashMessage({
					type: 'success',
					text: 'ToR Word document downloaded'
				})
			);
		})
		.catch((err)=>{
			return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while downloading ToR Word document'
				})
			);
		})
}

/**
 * [PdfViewer]
 * getPDFInNewTab is a redux action function to get pdf file by calling an api and open it on the new tab
 *
 * @param {string} apiURL
 * @param {boolean} canDownload
 * @returns
 */
export const getPDFInNewTab = (apiURL) => (dispatch) => {
  return axios
		.get(apiURL)
		.then((res) => {
			return window.open(res.data.data, "_blank");
		})
		.catch((err) => {
			return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while getting pdf file'
				})
			);
		});
}

/**
 * [Download Document]
 * downloadDoc is a redux action function to download document file by calling an api
 *
 * @param {string} apiURL
 * @returns
 */
export const downloadDocument = (apiURL) => (dispatch) => {
	return axios
		.get(apiURL)
		.then(async (res) => {
			return window.open(res.data.data, "_blank");
		})
		.catch((err) => {
			return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while getting document file'
				})
			);
		});	
};
