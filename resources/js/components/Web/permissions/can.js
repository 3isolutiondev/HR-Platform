import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { store } from '../redux/store';
import { addFlashMessage } from '../redux/actions/webActions';
import isEmpty from '../validations/common/isEmpty';

/**
 * can is a function check permission
 * @category Permission
 * @param {(string|string[])} permission
 * @returns {boolean}
 */
export function can(permission) {
  const permissions = store.getState().auth.user.permissions;

  if (Array.isArray(permission)) {
    let permissionExist = permissions.filter(el => {
      return permission.includes(el)
    })

    return permissionExist.length === permission.length
  }

  if (permission.indexOf('|') > 0) {
    let multiPermissions = permission.split('|');
    let permissionExist = permissions.filter(el => {
      return multiPermissions.includes(el)
    })

    return permissionExist.length > 0
  }

  return Array.isArray(permissions) ? permissions.includes(permission) : false;
}

/**
 * Component to check permission,
 * if pass it will render Child Component
 * if not it will redirect to previous page or redirect to specific url if it's specified
 * @category Permission
 * @param {{ permission: string, redirectUrl: string}} routeParam
 * @returns {object|Redirect}
 */
const Can = ({ permission, redirectUrl = '', ...props }) => {
  if (can(permission)) {
    return { ...props.children };
  }
  if (props.match.path === "/profile/:id") {
    const canPass = store.getState().myTeam.staffIds.some(id => id == props.match.params.id);
    if (canPass) {
      return { ...props.children };
    }
  }

  props.addFlashMessage({
    type: 'error',
    text: "You don't have permission to access the page"
  });

  return <Redirect to={!isEmpty(redirectUrl) ? redirectUrl : props.history.goBack()} />;
};

export default connect(null, { addFlashMessage })(withRouter(Can));
