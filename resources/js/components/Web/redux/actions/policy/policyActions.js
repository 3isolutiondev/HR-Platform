import {
  SET_POLICY_PERMISSION,
  SET_OPEN_SHARE_POLICY_DIALOG,
  SET_SHARE_POLICY_ID,
  SET_DELETE_POLICY_ID,
  SET_OPEN_DELETE_POLICY_DIALOG,
  SET_RELOAD_POLICY_DOCUMENTS,
  SET_OPEN_EDIT_CATEGORY_DIALOG,
  SET_EDIT_CATEGORY,
  SET_DELETE_CATEGORY_ID,
  SET_OPEN_DELETE_CATEGORY_DIALOG
} from '../../types/policy/policyTypes';
import { can } from '../../../permissions/can'

export const setPolicyPermission = () => {
	return {
		type: SET_POLICY_PERMISSION,
    showShare: can('Share Repository') || can('Set as Admin') ? true : false,
    showEditCategory: can('Edit Repository') || can('Set as Admin') ? true : false,
    showDeleteCategory: can('Delete Repository') || can('Set as Admin') ? true : false
	};
};

export const setSharePolicyId = (policyId = '') => {
  return {
    type: SET_SHARE_POLICY_ID,
    value: policyId
  }
}

export const setToggleShareDialog = () => (dispatch, getState) => {
  const { openShareDialog, sharePolicyId } = getState().policy

  return dispatch({
    type: SET_OPEN_SHARE_POLICY_DIALOG,
    value: openShareDialog ? false : true,
    sharePolicyId: openShareDialog ? '' : sharePolicyId
  })
}

export const setDeletePolicyId = (policyId = '', policyName = '', categoryId = '') => {
  return {
    type: SET_DELETE_POLICY_ID,
    value: policyId,
    deletePolicyCategoryId: categoryId,
    deletePolicyName: policyName
  }
}

export const setToggleDeletePolicyDialog = () => (dispatch, getState) => {
  const { openDeletePolicyDialog, deletePolicyId, deletePolicyCategoryId, deletePolicyName } = getState().policy

  return dispatch({
    type: SET_OPEN_DELETE_POLICY_DIALOG,
    value: openDeletePolicyDialog ? false : true,
    deletePolicyId: openDeletePolicyDialog ? '' : deletePolicyId,
    deletePolicyName: openDeletePolicyDialog ? '' : deletePolicyName,
    deletePolicyCategoryId: openDeletePolicyDialog ? '' : deletePolicyCategoryId
  })
}

export const setReloadPolicyByCategory = (categoryId = '') => {
  return {
    type: SET_RELOAD_POLICY_DOCUMENTS,
    value: categoryId
  }
}

export const setEditCategory = (category = '') => {
  return {
    type: SET_EDIT_CATEGORY,
    value: category
  }
}

export const setToggleEditCategoryDialog = () => (dispatch, getState) => {
  const { openEditCategoryDialog, editCategory } = getState().policy

  return dispatch({
    type: SET_OPEN_EDIT_CATEGORY_DIALOG,
    value: openEditCategoryDialog ? false : true,
    editCategory: openEditCategoryDialog ? '' : editCategory
  })
}

export const setDeleteCategoryId = (categoryId = '', categoryName = '') => {
  return {
    type: SET_DELETE_CATEGORY_ID,
    value: categoryId,
    deleteCategoryName: categoryName
  }
}

export const setToggleDeleteCategoryDialog = () => (dispatch, getState) => {
  const { openDeleteCategoryDialog, deleteCategoryId, deleteCategoryName } = getState().policy

  return dispatch({
    type: SET_OPEN_DELETE_CATEGORY_DIALOG,
    value: openDeleteCategoryDialog ? false : true,
    deleteCategoryId: openDeleteCategoryDialog ? '' : deleteCategoryId,
    deleteCategoryName: openDeleteCategoryDialog ? '' : deleteCategoryName
  })
}
