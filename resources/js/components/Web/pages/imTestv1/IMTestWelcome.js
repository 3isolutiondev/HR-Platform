import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { primaryColor } from '../../config/colors';
import WysiwygField from '../../common/formFields/WysiwygField';
import isEmpty from '../../validations/common/isEmpty';
import { onChangeStep, isValid } from '../../redux/actions/imtest/imtestActions';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	title: {
		color: primaryColor
	},
	editContainer: {
		position: 'absolute',
		right: 50
	}
});
class IMTest1 extends Component {
	componentDidMount() {
		this.props.isValid(1);
	}
	componentDidUpdate(prevProps) {
		const currentDashboardIMTest = JSON.stringify(this.props.imtest.step1);
		const prevDashboardIMTest = JSON.stringify(prevProps.imtest.step1);

		if (currentDashboardIMTest !== prevDashboardIMTest) {
			this.props.isValid(1);
		}
	}
	render() {
		let { text1, title } = this.props.imtest.step1;
		let { errors } = this.props.imtest;
		const { classes, onChangeStep, isEdit, isAdd } = this.props;
		return (
			<Grid container spacing={24}>
				{isEdit || isAdd ? (
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<TextField
								required
								id="Title"
								name="title"
								label="Title"
								fullWidth
								value={title}
								autoComplete="title"
								onChange={(e) => onChangeStep('step1', e.target.name, e.target.value)}
								error={!isEmpty(errors.title)}
								helperText={errors.title}
								autoFocus
							/>
						</Grid>

						<Grid item xs={12}>
							<WysiwygField
								withColor={true}
								label="Body"
								margin="dense"
								name="text1"
								value={text1}
								onChange={(e) => onChangeStep('step1', e.target.name, e.target.value)}
								error={errors.text1}
							/>
						</Grid>
					</Grid>
				) : (
					<Grid container spacing={24}>
						<Grid item xs={12} sm={11}>
							<Typography variant="h4" component="h4" className={classes.title} gutterBottom>
								{title}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={11}>
							<div dangerouslySetInnerHTML={{ __html: text1 }} />
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
}

IMTest1.propTypes = {
	classes: PropTypes.object,
	onChangeStep: PropTypes.func.isRequired,
	isValid: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChangeStep,
	isValid
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	imtest: state.imtest
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTest1));
// export default withStyles(styles)(IMTest1);
