import React, { Component } from 'react';
import classname from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Add from '@material-ui/icons/Add';
import SelectField from '../../../../common/formFields/SelectField';
// import Requirement from './requirement';
import { getAPI } from '../../../../redux/actions/apiActions';
import { validateSelectedRequirement } from '../../../../validations/HR/HRJobCategory';
import { getRequirementOptions } from '../../../../redux/actions/optionActions';
import { addFlashMessage } from '../../../../redux/actions/webActions';
import isEmpty from '../../../../validations/common/isEmpty';

import ParameterSkill from '../../../../common/formFields/jobRequirements/ParameterSkill';
import ParameterSector from '../../../../common/formFields/jobRequirements/ParameterSector';
import ParameterDegreeLevel from '../../../../common/formFields/jobRequirements/ParameterDegreeLevel';
import ParameterLanguage from '../../../../common/formFields/jobRequirements/ParameterLanguage';

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
		width: '135px'
	},
	outlinedContainer: {
		width: '100%',
		margin: 0,
		padding: '4px'
	},
	helperText: {
		color: '#d50000',
		'margin-top': '-4px'
	}
});

class requirements extends Component {
	constructor(props) {
		super(props);
		this.state = {
			requirementData: {
				requirements: [],
				selectedRequirement: ''
			},

			apiURL: '/api/hr-requirements',
			errors: {}
		};

		// this.getRequirement = this.getRequirement.bind(this);
		this.addRequirement = this.addRequirement.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.isValid = this.isValid.bind(this);
		this.requirementsOnChange = this.requirementsOnChange.bind(this);
		this.deleteRequirement = this.deleteRequirement.bind(this);
	}

	componentDidMount() {
		let requirementData = { ...this.state.requirementData };
		requirementData.requirements = [...this.props.requirements];
		this.setState({ requirementData });
		if (isEmpty(this.props.requirementOptions)) {
			this.props.getRequirementOptions();
		}
	}

	componentDidUpdate(prevProps) {
		const currentReq = JSON.stringify(this.props.requirements);
		const prevReq = JSON.stringify(prevProps.requirements);

		if (currentReq !== prevReq) {
			let requirementData = {...this.state.requirementData};
			requirementData.requirements = [...this.props.requirements];
			this.setState({ requirementData });
		}
	}

	isValid() {
		const { errors, isValid } = validateSelectedRequirement(this.state.requirementData);
		this.setState({ errors });
		return isValid;
	}

	addRequirement() {
		if (this.isValid()) {
			let requirementData = { ...this.state.requirementData };
			const { apiURL } = this.state;
			this.props
				.getAPI(apiURL + '/get-component/' + requirementData.selectedRequirement.value)
				.then((res) => {
					requirementData.requirements.push({
						requirement: requirementData.selectedRequirement.value,
						requirement_value: {},
						component: res.data.data
					});
					requirementData.selectedRequirement = '';

					this.setState({ requirementData, errors: {} });
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while retrieving requirement data'
					});
				});
		}
	}

	selectOnChange(value, e) {
		let requirementData = { ...this.state.requirementData };
		requirementData[e.name] = value;
		this.setState({ requirementData }, () => this.props.onChange(this.state.requirementData.requirements));
		//, () => this.props.onChange(this.state.requirements));
	}

	requirementsOnChange(value, index) {
		let requirementData  = {...this.state.requirementData};
		requirementData['requirements'][index]['requirement_value'] = value;
		this.setState({ requirementData }, () => this.props.onChange(this.state.requirementData.requirements)); //, () => this.props.onChange(this.state.requirements));
	}

	deleteRequirement(index) {
		let requirementData = { ...this.state.requirementData };
		requirementData.requirements.splice(index, 1);
		this.setState({ requirementData }, () => this.props.onChange(this.state.requirementData.requirements));
	}

	render() {
		const { label, margin, fullWidth, error, helperText, classes, requirementOptions } = this.props;
		const { errors } = this.state;
		const { requirements, selectedRequirement } = this.state.requirementData;

		return (
			<div>
				<FormControl margin={margin} fullWidth={fullWidth} error={error} variant="outlined">
					<fieldset className={classname(classes.outlinedBox, error ? classes.outlinedBoxError : '')}>
						<legend className={classes.outlinedLegend} />
					</fieldset>
					<FormLabel className={classes.outlinedLabel}>{label}</FormLabel>
					<Grid container spacing={24} alignItems="center" className={classes.outlinedContainer}>
						<Grid item xs={12} sm={4}>
							<SelectField
								label="Choose Requirement"
								margin="dense"
								options={requirementOptions}
								value={selectedRequirement}
								placeholder="Choose Requirement"
								isMulti={false}
								name="selectedRequirement"
								fullWidth
								onChange={this.selectOnChange}
								error={errors.selectedRequirement}
								required
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<Button variant="contained" color="primary" onClick={this.addRequirement}>
								<Add /> Add Requirement
							</Button>
						</Grid>
					</Grid>
					{!isEmpty(requirements) &&
						requirements.map((requirement, index) => {
							switch (requirement.component) {
								case 'ParameterSkill':
									return (
										<ParameterSkill
											key={'param-skill-' + index}
											requirement={requirement}
											onChange={(value) => this.requirementsOnChange(value, index)}
											deleteRequirement={() => this.deleteRequirement(index)}
										/>
									);
								case 'ParameterSector':
									return (
										<ParameterSector
											key={'param-sector-' + index}
											requirement={requirement}
											onChange={(value) => this.requirementsOnChange(value, index)}
											deleteRequirement={() => this.deleteRequirement(index)}
										/>
									);
								case 'ParameterLanguage':
									return (
										<ParameterLanguage
											key={'param-language-' + index}
											requirement={requirement}
											onChange={(value) => this.requirementsOnChange(value, index)}
											deleteRequirement={() => this.deleteRequirement(index)}
										/>
									);
								case 'ParameterDegreeLevel':
									return (
										<ParameterDegreeLevel
											key={'param-degree-level-' + index}
											requirement={requirement}
											onChange={(value) => this.requirementsOnChange(value, index)}
											deleteRequirement={() => this.deleteRequirement(index)}
										/>
									);
								default:
									break;
							}
						})}
					{/* <Requirement
						index={index}
						key={'param' + index}
						requirement={requirement}
						onChange={(value) => this.requirementsOnChange(value, index)}
						deleteRequirement={this.deleteRequirement}
					/>
					))} */}
				</FormControl>
				{error && <FormHelperText className={classes.helperText}>{helperText}</FormHelperText>}
			</div>
		);
	}
}

requirements.defaultProps = {
	margin: 'normal',
	fullWidth: true
};

requirements.propTypes = {
	getAPI: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	margin: PropTypes.string.isRequired,
	fullWidth: PropTypes.bool.isRequired,
	error: PropTypes.bool,
	helperText: PropTypes.string
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	getRequirementOptions,
	addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	requirementOptions: state.options.requirementOptions
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(requirements));
