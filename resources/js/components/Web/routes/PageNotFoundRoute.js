import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import CookieConsent from '../common/GDPR/CookieConsent';

const PageNotFound = ({ component: Component, auth, isHome, ...rest }) => (
	<Route
		{...rest}
		render={(props) => (
			<div>
				<Component {...props} />
				{/* <CookieConsent path={props.match.url} /> */}
			</div>
		)}
	/>
);

PageNotFound.propTypes = {
	auth: PropTypes.object.isRequired
	// allowedRoles: PropTypes.array.isRequired
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

export default connect(mapStateToProps)(PageNotFound);
// export default NormalRoute
