/** import React, Prop Types and React Router */
import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

/** import Material UI styles */
import { withStyles } from '@material-ui/core/styles';

/** import other components needed for this component */
import Header from '../common/Header';
import PageWrapper from '../common/PageWrapper';
import Sidebar from '../common/Sidebar';
import DashboardContainer from '../common/DashboardContainer';
import FlashMessageList from '../common/FlashMessageList';
import Footer from '../common/Footer';

/** import Permission related functions and components */
import Authenticated from '../permissions/isAuthenticated';
import Verified from '../permissions/isVerified';
import Can, { can } from '../permissions/can';
import P11Complete from '../permissions/isP11Completed';
import CheckIMMAPer from '../permissions/isIMMAPer';

/**
 * PermissionRoute is a component act as a wrapper to page component, especially for the page that can be needs to can be accessed based on the permission
 * @name PermissionRoute
 * @component
 * @category Route
 * @param {object} permissionRouteParam - parameter for PermissionRoute
 * @returns {component}
 */
const PermissionRoute = ({ component: Component, permission, isIMMAPer, classes, redirectUrl = '/404', ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <Authenticated>
        <Verified>
          <P11Complete>
            <CheckIMMAPer needIMMAPer={isIMMAPer}>
              <Can permission={permission} redirectUrl={redirectUrl}>
                <div className={classes.pageContainer}>
                  <Header {...props} />
                  <PageWrapper>
                    {can('Dashboard Access') ? <Sidebar {...props} /> : null}
                    <DashboardContainer>
                      <Component {...props} />
                    </DashboardContainer>
                  </PageWrapper>
                  <Footer />
                  <FlashMessageList />
                </div>
              </Can>
            </CheckIMMAPer>
          </P11Complete>
        </Verified>
      </Authenticated>
    )}
  />
);

PermissionRoute.defaultProps = {
  isIMMAPer: false
}

PermissionRoute.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * component is a prop containing component needs to be load as child component of this component
   */
	component: PropTypes.func.isRequired,
  /**
   * permission is a prop containing permission
   */
	permission: PropTypes.string.isRequired,
  /**
   * isIMMAPer is a prop containing boolean value to check if the logged in user is iMMAPer
   */
  isIMMAPer: PropTypes.bool.isRequired,
  /**
   * redirectUrl is a prop containing redirect url when the user don't have the permission needed
   */
  redirectUrl: PropTypes.string
};

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

export default withStyles(styles)(PermissionRoute);
