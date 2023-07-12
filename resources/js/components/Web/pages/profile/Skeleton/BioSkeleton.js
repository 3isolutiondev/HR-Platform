import React from 'react';
import Skeleton from 'react-loading-skeleton';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import classname from 'classnames';

const BioSkeleton = ({ classes }) => {
	return (
		<Card className={classes.card}>
			<div className={classes.avatarContainer}>
				<Skeleton circle={true} height={200} width={200} />
			</div>
			<div className={classes.details}>
				<CardContent>
					<Grid container className={classes.addBorderBottom}>
						<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
							<div className={classname(classes.addMarginBottom)}>
								<Skeleton height={50} />
							</div>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<div className={classname(classes.addMarginBottom, classes.addMarginRight)}>
								<Skeleton height={35} />
							</div>
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<div className={classname(classes.addMarginBottom, classes.addMarginRight)}>
								<Skeleton height={35} />
							</div>
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<div className={classname(classes.addMarginBottom, classes.addMarginRight)}>
								<Skeleton height={35} />
							</div>
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<div className={classname(classes.addMarginBottom, classes.addMarginRight)}>
								<Skeleton height={35} />
							</div>
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<div className={classname(classes.addMarginBottom, classes.addMarginRight)}>
								<Skeleton height={35} />
							</div>
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<div className={classname(classes.addMarginBottom, classes.addMarginRight)}>
								<Skeleton height={35} />
							</div>
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<div className={classname(classes.addMarginBottom, classes.addMarginRight)}>
								<Skeleton height={35} />
							</div>
						</Grid>
						<Grid item xs={12} md={6} lg={8} xl={3}>
							<div className={classname(classes.addMarginBottom, classes.addMarginRight)}>
								<Skeleton height={35} />
							</div>
						</Grid>
					</Grid>
				</CardContent>
			</div>
		</Card>
	);
};

export default BioSkeleton;
