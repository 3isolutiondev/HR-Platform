import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEmpty from '../validations/common/isEmpty';
import FlashMessageList from '../common/FlashMessageList';

const AuthRoute = ({ component: Component, auth, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			auth.isAuthenticated === false || isEmpty(auth.isAuthenticated) ? (
				<div>
					<Component {...props} />
					<FlashMessageList />
				</div>
			) : (
      <Redirect to="/" />
      )}
	/>
);

AuthRoute.propTypes = {
	auth: PropTypes.object.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(AuthRoute);
