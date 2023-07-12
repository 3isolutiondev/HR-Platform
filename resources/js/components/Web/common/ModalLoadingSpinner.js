import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	backdrop: {
		display: 'block' /* Hidden by default */,
		position: 'fixed' /* Stay in place */,
		zIndex: 1 /* Sit on top */,
		paddingTop: '100px' /* Location of the box */,
		left: 0,
		top: 0,
		width: '100%' /* Full width */,
		height: '100%' /* Full height */,
		overflow: 'auto' /* Enable scroll if needed */,
		backgroundColor: 'rgb(0,0,0)' /* Fallback color */,
		backgroundColor: 'rgba(0,0,0,0.4)' /* Black w/ opacity */
	}
});

/**
 * ModaLoading spinner is a component to show loading progress when submitting your profile in P11 page
 *
 * @name ModalLoadingSpinner
 * @component
 * @category Common
 *
 */
const ModalLoadingSpinner = ({ isLoading, classes }) => {
	if (isLoading) {
		return (
			<div className={classes.backdrop}>
				<CircularProgress
					style={{ display: 'block', position: 'absolute', left: '48%', top: '40%' }}
					size={30}
				/>
			</div>
		);
	} else {
		return null;
	}
};

ModalLoadingSpinner.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   *
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired,
  /**
   * isLoading is a prop to show or hide this component
   */
  isLoading: PropTypes.bool.isRequired
}

export default withStyles(styles)(ModalLoadingSpinner);
