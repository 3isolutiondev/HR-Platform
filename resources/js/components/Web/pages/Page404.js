import React, { Component } from 'react';
import { primaryColor } from '../config/colors';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import { Breadcrumbs } from '@material-ui/core';
// import NavigateNextIcon from '@material-ui/icons/NavigateNext';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	color: {
		color: primaryColor
	},
	center: {
		top: '50%',
		position: 'absolute',
		left: '50%',
		marginLeft: '-50px' /* margin is -0.5 * dimension */,
		marginTop: '-25px '
	},
	right: {
		borderRight: '1px solid #be2126',
		paddingRight: '5px'
	},
	left: {
		borderLeft: '1px solid #be2126',
		paddingLeft: '5px'
	}
});

class Page404 extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.center}>
				<Typography className={classes.color} variant="h6" gutterBottom>
					<b className={classes.right}>404</b>
					<span className={classes.left}>Not Found</span>
				</Typography>
			</div>
		);
	}
}

export default withStyles(styles)(Page404);
