import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../common/Header';
import PageWrapper from '../common/PageWrapper';
import FlashMessageList from '../common/FlashMessageList';
import Footer from '../common/Footer';
// import CookieConsent from '../common/GDPR/CookieConsent';

const VerifiedRoute = ({ component: Component, auth, classes, ...rest }) => (
	<Route
		{...rest}
		render={(props) => (
			<div className={classes.pageContainer}>
				<Header {...props} />
				<PageWrapper>
					<Component {...props} />
				</PageWrapper>
				<Footer />
				<FlashMessageList />
			</div>
		)}
	/>
);

VerifiedRoute.propTypes = {
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

export default connect(mapStateToProps)(withStyles(styles)(VerifiedRoute));
