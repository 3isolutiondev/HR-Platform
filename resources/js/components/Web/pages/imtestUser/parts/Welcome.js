import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';

const Welcome = ({ classes, data }) => {
	return (
		// <div>welcome</div>
		<Grid container spacing={24}>
			<Grid item xs={12} sm={12} md={12}>
				<Typography
					variant="h4"
					component="h4"
					className={classnames(classes.subTitle, classes.capitalize)}
					gutterBottom
				>
					{data[0].title}
				</Typography>
			</Grid>
			<Grid item xs={12} sm={12} md={12}>
				<div className={classes.correctFont} dangerouslySetInnerHTML={{ __html: data[0].text1 }} />
			</Grid>
		</Grid>
	);
};

export default Welcome;
