import { SET_DROPZONE_OPEN, SET_FILES } from '../../types/formFields/dropzoneTypes'

const initialState = {
  dropzoneOpen: false,
  files: [],
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_DROPZONE_OPEN:
      return {
        ...state,
        dropzoneOpen: action.isOpen
      }
    case SET_FILES:
      return {
        ...state,
        files: action.files
      }
    default: return state;
  }
}
