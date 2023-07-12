import React from 'react';
import Grid from '@material-ui/core/Grid';
import Skeleton from 'react-loading-skeleton';

const Placeholder = () => {
	return (
		<Grid container spacing={24}>
			<Grid item xs={12} sm={12}>
				<Skeleton height={30} />
			</Grid>
			<Grid item xs={12} sm={12}>
				<Skeleton />
				<Skeleton />
			</Grid>
			<Grid item xs={8} sm={8} />
			<Grid item xs={2} sm={2}>
				<Skeleton />
			</Grid>
			<Grid item xs={2} sm={2}>
				<Skeleton />
			</Grid>
			<Grid item xs={12} sm={12}>
				<Skeleton />
			</Grid>
			<Grid item xs={12} sm={12}>
				<Skeleton width={900} />
				<Skeleton width={700} />
				<Skeleton width={800} />
				<Skeleton width={600} />
			</Grid>

			<Grid item xs={12} sm={12} />

			<Grid item xs={8} sm={8} />
			<Grid item xs={2} sm={2}>
				<Skeleton />
			</Grid>
			<Grid item xs={2} sm={2}>
				<Skeleton />
			</Grid>

			<Grid item xs={12} sm={12} />
			<Grid item xs={4} sm={4}>
				<Skeleton />
				<Skeleton />
				<Skeleton />
			</Grid>
			<Grid item xs={8} sm={8} />
		</Grid>
	);
};

export default Placeholder;
