// import React from 'react';
// import { connect } from 'react-redux';
// import { withRouter, Redirect } from 'react-router-dom';
import { store } from '../redux/store';
// import { addFlashMessage } from '../redux/actions/webActions';

export default function check_office(immap_office_id) {
	const immap_offices = store.getState().auth.user.offices;

	return Array.isArray(immap_offices) ? immap_offices.includes(immap_office_id) : false;
}

// const Can = ({ permission, ...props }) => {

// 	if (can(permission)) {
// 		return { ...props.children };
// 	}

// 	props.addFlashMessage({
// 		type: 'error',
// 		text: "You don't have permission to access the page"
// 	});

// 	return <Redirect to={props.history.goBack()} />;
// };

// export default connect(null, { addFlashMessage })(withRouter(Can));
