import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { store } from '../redux/store';
import { addFlashMessage } from '../redux/actions/webActions';

export function isIMMAPer() {
	return store.getState().auth.user.isIMMAPER;
}

const CheckIMMAPer = ({ needIMMAPer, ...props }) => {
	if (needIMMAPer && !isIMMAPer()) {
    props.addFlashMessage({
      type: 'error',
      text: 'Sorry, you cannot access the page'
    });
    return <Redirect to="/" />;
	}

  return { ...props.children };
};

CheckIMMAPer.defaultProps = {
  needIMMAPer: false
}

CheckIMMAPer.propTypes = {
  needIMMAPer: PropTypes.bool.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

export default connect(null, { addFlashMessage })(withRouter(CheckIMMAPer));
