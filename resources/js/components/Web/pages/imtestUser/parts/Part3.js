import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import WysiwygField from '../../../common/formFields/WysiwygField';
import { onChange } from '../../../redux/actions/imtest/imTestUserActions';
import { primaryColor } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

class Part3 extends Component {
	render() {
		const { imTestUser, classes, onChange, preview } = this.props;
		return (
			<Grid container spacing={12}>
				<Grid item xs={12} sm={12} md={12}>
					<Typography
						variant="h4"
						component="h4"
						className={classnames(classes.subTitle, classes.capitalize)}
						gutterBottom
					>
						{imTestUser.step4[0].title}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={12} md={12}>
					<div
						className={classes.correctFont}
						dangerouslySetInnerHTML={{ __html: imTestUser.step4[0].text1 }}
					/>
				</Grid>
				<Grid item xs={12} sm={12} md={12}>
					{preview ? (
						<div
							className={classes.correctFont}
							dangerouslySetInnerHTML={{
								__html: !isEmpty(imTestUser.step4[0]['follow-imtes'])
									? imTestUser.step4[0]['follow-imtes'][0].text1
									: ''
							}}
						/>
					) : (
						<WysiwygField
							fullWidth={true}
							label="Body"
							margin="dense"
							name="userTextInput1"
							value={imTestUser.userTextInput1}
							onChange={(e) => onChange(e.target.name, e.target.value)}
							error={imTestUser.errors.userTextInput1}
						/>
					)}
				</Grid>
			</Grid>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChange
};

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
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	subTitle: {
		color: primaryColor
	},

	capitalize: {
		textTransform: 'capitalize'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Part3));
