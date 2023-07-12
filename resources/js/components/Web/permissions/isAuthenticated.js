/** import withRouter from react-router-dom */
import { withRouter } from 'react-router-dom';

/** import function related to Redux */
import { connect } from 'react-redux';
import { store } from '../redux/store';
import { addFlashMessage } from '../redux/actions/webActions';
import { logoutUser } from '../redux/actions/authActions';

/**
 * isAuthenticated is a function to check if the user is logged in or not
 * @returns {boolean}
 */
export function isAuthenticated() {
  	return store.getState().auth.isAuthenticated;
}

/**
 * Authenticated is a function component to render component for logged in user
 * @param {object} props - props in object form
 * @returns
 */
const Authenticated = ({ ...props }) => {
	if (isAuthenticated()) {
		return { ...props.children };
	}

	props.addFlashMessage({
		type: 'error',
		text: 'You should login or register first'
	});

	store.dispatch(logoutUser());
	return null;
};

export default connect(null, { addFlashMessage })(withRouter(Authenticated));
