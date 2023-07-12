import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Header from '../common/Header';
import PageWrapper from '../common/PageWrapper';
import BasicContainer from '../common/BasicContainer';
import FlashMessageList from '../common/FlashMessageList';
import Footer from '../common/Footer';
import Authenticated from '../permissions/isAuthenticated';
import Verified from '../permissions/isVerified';
import P11Completed from '../permissions/isP11Completed';
// import CookieConsent from '../common/GDPR/CookieConsent';

// import Sidebar from '../common/Sidebar'
// import DashboardContainer from '../common/DashboardContainer'
// import isEmpty from '../validations/common/isEmpty'

const P11Route = ({ component: Component, auth, classes, ...rest }) => (
	<Route
		{...rest}
		render={(props) => (
			<Authenticated>
				<Verified>
					<P11Completed>
						<div className={classes.pageContainer}>
							<Header {...props} />
							<PageWrapper>
								<BasicContainer>
									<Component {...props} />
								</BasicContainer>
							</PageWrapper>
							<Footer />
							<FlashMessageList />
							{/* <CookieConsent path={props.match.url} /> */}
						</div>
					</P11Completed>
				</Verified>
			</Authenticated>
		)}
	/>
);

P11Route.propTypes = {
	auth: PropTypes.object.isRequired,
	component: PropTypes.func.isRequired
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

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	pageContainer: {
		position: 'relative',
		'min-height': 'calc(100vh - 64px)',
		background: '#fbfbfb'
	}
});

export default connect(mapStateToProps)(withStyles(styles)(P11Route));
// export default P11Route
