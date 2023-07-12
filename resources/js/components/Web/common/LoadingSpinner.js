import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

/**
 * Loading Spinner is a component to show progress when the component is being called using lazy load using react-loadable or being called by other component.
 *
 * For more information about react-loadable please visit: https://github.com/thejameskyle/react-loadable#readme
 *
 * @name LoadingSpinner
 * @component
 * @category Common
 *
*/
const LoadingSpinner = ({ isLoading, error, timedOut, pastDelay }) => {
	// Handle if the isLoading props is sent from the component using this component
	if (isLoading) {
		return (
			<CircularProgress
				style={{ display: 'block', margin: '0 auto', marginTop: '10%', marginBottom: '10%' }}
				size={30}
			/>
		);
	} else if (error) {
		// Handle the error state
		return (
			<Typography variant="h5" gutterBottom align="center" style={{ paddingTop: '16px' }}>
				Sorry, there was a problem loading the page.{' '}
				<Button color="primary" variant="contained" onClick={() => window.location.reload()}>
					Please Retry
				</Button>
			</Typography>
		);
	} else if (timedOut) {
    // Handle time out
		return (
			<Typography variant="h5" gutterBottom align="center" style={{ paddingTop: '16px' }}>
				Taking a long time...{' '}
				<Button color="primary" variant="contained" onClick={() => window.location.reload()}>
					Please Retry
				</Button>
			</Typography>
		);
	} else if (pastDelay) {
    // Handle past delay
		return (
			<CircularProgress
				style={{ display: 'block', margin: '0 auto', marginTop: '10%', marginBottom: '10%' }}
				size={30}
			/>
		);
	} else {
		return null;
	}
};

LoadingSpinner.propTypes = {
  /** isLoading is a prop custom props to show if this component should show the loading circle. This props is not part of react-loadable properties  */
  isLoading: PropTypes.bool,
  /** error is a prop define from react-loadable. It's shows an error when there is something wrong while loading the component */
  error: PropTypes.object,
  /** timedOut is a prop define from react-loadable. It will be set to true when the loader has timed out */
  timedOut: PropTypes.bool,
  /** pastDelay is a prop define from react-loadable. It will be true once the component has taken longer to load than a set delay */
  pastDelay: PropTypes.bool
}

export default LoadingSpinner;
