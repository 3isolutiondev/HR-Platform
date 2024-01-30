import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	'page-container': {
		marginTop: '76px',
		'padding-bottom': '275px',
		[theme.breakpoints.only('sm')]: {
			paddingBottom: '632px'
		},
		[theme.breakpoints.only('xs')]: {
			paddingBottom: '860px'
		}
	}
});

/**
 * PageWrapper is a component to wrap every child component defined in routes.js (resources/js/components/Web/routes/routes.js).
 *
 * This component is used in custom Route listed inside resources/js/components/Web/routes folder (NormalRoute, P11Route, PermissionRoute, VerifiedRoute).
 *
 * @name PageWrapper
 * @component
 * @category Common
 *
 */
function PageWrapper(props) {
	const { classes } = props;
	return <div className={classes['page-container']}>{props.children}</div>;
}

PageWrapper.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PageWrapper);
