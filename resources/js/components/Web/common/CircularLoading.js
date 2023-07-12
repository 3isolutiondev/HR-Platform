import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Circle loading component
 *
 * Permission: -
 *
 * @component
 * @name CircularLoading
 * @category Common
 * @example
 * return (
 *  <CircularLoading />
 * )
 *
 */
const CircularLoading = () => {
	return (
		<CircularProgress
			style={{ display: 'block', margin: '0 auto', marginTop: '10%', marginBottom: '10%' }}
			size={30}
		/>
	);
};

export default CircularLoading;
