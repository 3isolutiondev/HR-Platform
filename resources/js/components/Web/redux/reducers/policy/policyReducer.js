import {
  SET_OPEN_SHARE_POLICY_DIALOG,
  SET_POLICY_PERMISSION,
  SET_SHARE_POLICY_ID,
  SET_OPEN_DELETE_POLICY_DIALOG,
  SET_DELETE_POLICY_ID,
  SET_RELOAD_POLICY_DOCUMENTS,
  SET_OPEN_EDIT_CATEGORY_DIALOG,
  SET_EDIT_CATEGORY,
  SET_OPEN_DELETE_CATEGORY_DIALOG,
  SET_DELETE_CATEGORY_ID
} from '../../types/policy/policyTypes';

const initialState = {
  showShare: false,
  showEditCategory: false,
  showDeleteCategory: false,
  openShareDialog: false,
  sharePolicyId: '',
  openDeletePolicyDialog: false,
  deletePolicyId: '',
  deletePolicyCategoryId: '',
  deletePolicyName: '',
  reloadPolicyByCategory: '',
  openEditCategoryDialog: false,
  editCategory: '',
  openDeleteCategoryDialog: false,
  deleteCategoryId: '',
  deleteCategoryName: ''
}

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_POLICY_PERMISSION:
      return {
        ...state,
        showShare: action.showShare,
        showEditCategory: action.showEditCategory,
        showDeleteCategory: action.showDeleteCategory
      }
    case SET_SHARE_POLICY_ID:
      return {
        ...state,
        sharePolicyId: action.value
      }
    case SET_OPEN_SHARE_POLICY_DIALOG:
      return {
        ...state,
        openShareDialog: action.value,
        sharePolicyId: action.sharePolicyId
      }
    case SET_DELETE_POLICY_ID:
      return {
        ...state,
        deletePolicyId: action.value,
        deletePolicyCategoryId: action.deletePolicyCategoryId,
        deletePolicyName: action.deletePolicyName
      }
    case SET_OPEN_DELETE_POLICY_DIALOG:
      return {
        ...state,
        openDeletePolicyDialog: action.value,
        deletePolicyId: action.deletePolicyId,
        deletePolicyCategoryId: action.deletePolicyCategoryId,
        deletePolicyName: action.deletePolicyName
      }
    case SET_RELOAD_POLICY_DOCUMENTS:
      return {
        ...state,
        reloadPolicyByCategory: action.value
      }
    case SET_EDIT_CATEGORY:
      return {
        ...state,
        editCategory: action.value
      }
    case SET_OPEN_EDIT_CATEGORY_DIALOG:
      return {
        ...state,
        openEditCategoryDialog: action.value,
        editCategory: action.editCategory
      }
    case SET_DELETE_CATEGORY_ID:
      return {
        ...state,
        deleteCategoryId: action.value,
        deleteCategoryName: action.deleteCategoryName
      }
    case SET_OPEN_DELETE_CATEGORY_DIALOG:
      return {
        ...state,
        openDeleteCategoryDialog: action.value,
        deleteCategoryId: action.deleteCategoryId,
        deleteCategoryName: action.deleteCategoryName
      }
    default: return state;
  }
}
