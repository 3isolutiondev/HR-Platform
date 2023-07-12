/** import React, Route, connect and PropTypes */
import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/** import components needed for this file */
import { withStyles } from '@material-ui/core/styles';
import Header from '../common/Header';
import PageWrapper from '../common/PageWrapper';
import Sidebar from '../common/Sidebar';
import DashboardContainer from '../common/DashboardContainer';
import FlashMessageList from '../common/FlashMessageList';
import Footer from '../common/Footer';

/** import permission checker */
import { can } from '../permissions/can';

/**
 * NormalRoute is a component act as a wrapper to page component, especially for the page that can be accessed without permission
 * @name NormalRoute
 * @component
 * @category Route
 * @param {object} normalRouteParam - parameter for NormalRoute
 * @returns {component}
 */
const NormalRoute = ({ component: Component, auth, classes, isHome, ...rest }) => (
	<Route
		{...rest}
		render={(props) => (
			<div className={classes.pageContainer}>
				<Header {...props} />
				<PageWrapper>
					{can('Dashboard Access') ? <Sidebar {...props} /> : null}
					{isHome ? (
						<Component {...props} />
					) : (
						<DashboardContainer>
							<Component {...props} />
						</DashboardContainer>
					)}
				</PageWrapper>
				<Footer />
				<FlashMessageList />
			</div>
		)}
	/>
);

NormalRoute.propTypes = {
  /**
   * auth is a prop containing auth reducer data
   */
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

export default connect(mapStateToProps)(withStyles(styles)(NormalRoute));
