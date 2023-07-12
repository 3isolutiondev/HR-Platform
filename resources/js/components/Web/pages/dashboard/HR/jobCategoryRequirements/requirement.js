import React, { Component } from 'react';
import classname from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Fab from '@material-ui/core/Fab';
import Delete from '@material-ui/icons/Delete';
import { isJSON } from '../../../../utils/helper';
import isEmpty from '../../../../validations/common/isEmpty';
import SelectField from '../../../../common/formFields/SelectField';
import { getAPI } from '../../../../redux/actions/apiActions';
import { validateRequirement } from '../../../../validations/HR/HRJobCategory';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	outlinedBox: {
		position: 'absolute',
		top: '2px',
		left: 0,
		right: 0,
		bottom: 0,
		margin: 0,
		padding: 0,
		transition:
			'padding-left 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,border-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,border-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
		'border-radius': '4px',
		'border-width': '1px',
		'border-style': 'solid',
		'pointer-events': 'none',
		'padding-left': '8px'
	},
	outlinedBoxError: {
		'border-color': '#d50000'
	},
	outlinedLabel: {
		transform: 'translate(14px, -6px)',
		'z-index': 1,
		position: 'absolute'
	},
	outlinedLegend: {
		padding: 0,
		'text-align': 'left',
		transition: 'width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
		'line-height': '10px',
		width: '70px'
	},
	outlinedContainer: {
		width: '100%',
		margin: 0,
		padding: '4px'
	},
	requirementBox: {
		margin: '12px',
		width: 'calc(100% - 24px)'
	}
});

class requirement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			requirement: '',
			requirement_component: '',
			requirement_value: '',
			model_data: '',
			model_slug: '',
			type: '',
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.isValid = this.isValid.bind(this);
		this.setData = this.setData.bind(this);
	}

	componentDidMount() {
		this.setData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.requirement !== prevProps.requirement) {
			this.setData();
		}
	}

	setData() {
		if (this.props.requirement) {
			if (isJSON(this.props.requirement)) {
				const reqValue = this.props.requirement.hasOwnProperty('requirement')
					? this.props.requirement
					: JSON.parse(this.props.requirement);

				switch (reqValue.type) {
					case 'model':
						this.props
							.getAPI('/api/' + reqValue.model_slug + '/all-options')
							.then((res) => {
								const model_data = res.data.data;
								if (!isEmpty(reqValue.requirement_value)) {
									if (reqValue.requirement_value.hasOwnProperty('value')) {
										this.setState({
											requirement_value: model_data.find((modelData) => {
												return modelData.value === reqValue.requirement_value.value;
											})
										});
									}
								}
								this.setState({ model_data, model_slug: reqValue.model_slug }, () => {
									this.isValid();
								});
							})
							.catch((err) => {});
						break;
					default:
						this.setState({ requirement_value: reqValue.requirement_value }, () => {
							this.isValid();
						});
				}
				this.setState({ requirement: reqValue.requirement, type: reqValue.type }, () => {
					this.isValid();
				});
			}
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => {
			this.props.onChange({
				requirement: this.state.requirement,
				requirement_value: this.state.requirement_value,
				type: this.state.type,
				model_slug: this.state.model_slug
			});
			this.isValid();
		});
	}

	isValid() {
		const { errors, isValid } = validateRequirement(this.state);

		this.setState({ errors });
		// if (!isEmpty(errors)) {
		// } else {
		//   this.setState({ errors: {} })
		// }

		return isValid;
	}

	selectOnChange(value, e) {
		this.setState({ [e.name]: value }, () => {
			this.props.onChange({
				requirement: this.state.requirement,
				requirement_value: this.state.requirement_value,
				type: this.state.type,
				model_slug: this.state.model_slug
			});

			// if(e.name === "requirement") {
			//   this.props.getAPI('/api/'+this.state.model_slug+'/all-options')
			//     .then(res => {
			//       this.setState({ model_data: res.data.data, requirement_value: '' })
			//     })
			//     .catch(err => {
			//     })
			// }

			this.isValid();
		});
	}

	render() {
		const { classes, allJobSkills, index } = this.props;
		const { requirement, model_data, type, requirement_value, errors } = this.state;

		return (
			<FormControl
				margin="dense"
				fullWidth={true}
				error={!isEmpty(errors)}
				variant="outlined"
				className={classes.requirementBox}
			>
				{/* <fieldset className={classes.outlinedBox}> */}
				<fieldset className={classname(classes.outlinedBox, !isEmpty(errors) ? classes.outlinedBoxError : '')}>
					<legend className={classes.outlinedLegend} />
				</fieldset>
				<FormLabel className={classes.outlinedLabel}>Job Skill</FormLabel>
				<Grid container spacing={24} alignItems="center" className={classes.outlinedContainer}>
					<Grid item xs={12} sm={4}>
						<SelectField
							label="Job Skill"
							margin="dense"
							options={allJobSkills}
							value={requirement}
							placeholder="Choose Job Skill"
							isMulti={false}
							name="requirement"
							fullWidth
							onChange={this.selectOnChange}
							error={errors.selectedRequirement}
							required
							isDisabled={true}
						/>
					</Grid>
					{type === 'model' &&
					!isEmpty(model_data) && (
						<Grid item xs={12} sm={4}>
							<SelectField
								label="Model Data"
								margin="dense"
								options={model_data}
								value={requirement_value}
								placeholder="Choose Model Data"
								isMulti={false}
								name="requirement_value"
								fullWidth
								onChange={this.selectOnChange}
								error={errors.requirement_value}
								required
							/>
						</Grid>
					)}
					{type !== 'model' && (
						<Grid item xs={12} sm={4}>
							<TextField
								id="requirement_value"
								label="Skill Value"
								autoFocus
								margin="dense"
								required
								fullWidth
								name="requirement_value"
								value={requirement_value}
								onChange={this.onChange}
								error={!isEmpty(errors.requirement_value)}
								helperText={errors.requirement_value}
							/>
						</Grid>
					)}
					<Grid item xs={12} sm={4}>
						<Fab color="primary" size="small" onClick={() => this.props.deleteRequirement(index)}>
							<Delete />
						</Fab>
					</Grid>
				</Grid>
				{/* { !isEmpty(errors) &&
          <FormHelperText>{helperText}</FormHelperText>
        } */}
			</FormControl>
		);
	}
}

requirement.propTypes = {
	getAPI: PropTypes.func.isRequired,
	allJobSkills: PropTypes.array.isRequired,
	index: PropTypes.number.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(requirement));
