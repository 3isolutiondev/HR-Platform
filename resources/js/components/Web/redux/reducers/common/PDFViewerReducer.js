import { SET_PDF } from '../../types/common/PDFViewerTypes';

const initialState = {
	page_number: 1,
	total_page_number: 1,
	fileURL: '',
  blobFile: '',
	pdfViewerOpen: false,
	canDownload: true,
  canClosePdfViewer: true,
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_PDF:
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
};
