import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { store } from '../redux/store';
import { addFlashMessage } from '../redux/actions/webActions';

export function isP11Completed() {
	return store.getState().auth.user.p11Completed;
}

const P11Complete = ({ ...props }) => {
	if (isP11Completed()) {
		if (props.location.pathname == '/p11') {
			return <Redirect to="/profile" />;
		}
		return { ...props.children };
	}

	props.addFlashMessage({
		type: 'error',
		text: 'You should fill this form first'
	});

	if (props.location.pathname != '/p11') {
		return <Redirect to="/p11" />;
	}
	return { ...props.children };
};

export default connect(null, { addFlashMessage })(withRouter(P11Complete));
