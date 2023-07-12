import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { primaryColor } from '../../../config/colors';
import Part1 from './Part1';
import Part2 from './Part2';
import Part3 from './Part3';
import Part4 from './Part4';
import { getAllImStep } from '../../../redux/actions/imtest/imTestUserActions';
import isEmpty from '../../../validations/common/isEmpty';

class Recap extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		const { preview, profileID, im_test_template } = this.props;
		if (preview) {
			this.props.getAllImStep(profileID, im_test_template.value);
		}
	}
	render() {
		const { classes, imTestUser, preview, title } = this.props;
		return (
			<Paper className={classes.paper}>
				<Grid container spacing={24}>
					<Grid item xs={12} sm={12} md={12}>
						<Typography
							variant="h4"
							component="h4"
							className={classnames(classes.subTitle, classes.capitalize)}
							gutterBottom
						>
							{preview ? title : 'Final Recap'}
						</Typography>
					</Grid>
				</Grid>
				{!isEmpty(imTestUser.step2) && (
					<Grid container spacing={24}>
						<Paper className={classes.subPaper}>
							<Part1 preview={preview} classes={classes} />
						</Paper>
					</Grid>
				)}

				{!isEmpty(imTestUser.step3) && (
					<Grid container spacing={24}>
						<Paper className={classes.subPaper}>
							<Part2 preview={preview} classes={classes} />
						</Paper>
					</Grid>
				)}

				{!isEmpty(imTestUser.step4) && (
					<Grid container spacing={24}>
						<Paper className={classes.subPaper}>
							<Part3 preview={preview} classes={classes} />
						</Paper>
					</Grid>
				)}

				{!isEmpty(imTestUser.step5) && (
					<Grid container spacing={24}>
						<Paper className={classes.subPaper}>
							<Part4 preview={preview} classes={classes} />
						</Paper>
					</Grid>
				)}
			</Paper>
		);
	}
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		padding: theme.spacing.unit * 2
	},
	correctFont: {
		fontFamily: "'Barlow', sans-serif !important;",
		'& *': {
			fontFamily: "'Barlow', sans-serif !important;"
		}
	},
	subPaper: {
		padding: theme.spacing.unit * 2,
		margin: theme.spacing.unit * 2,
		width: '100%'
	},
	subTitle: {
		color: primaryColor
	},
	capitalize: {
		textTransform: 'capitalize'
	},
	break: {
		marginBottom: '20px'
	}
});

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	imTestUser: state.imTestUser
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAllImStep
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Recap));
