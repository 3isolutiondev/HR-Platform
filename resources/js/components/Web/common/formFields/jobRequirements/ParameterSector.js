import React, { Component } from 'react';
import { capitalize } from 'lodash/string';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Delete from '@material-ui/icons/Delete';
import { validate } from '../../../validations/HR/jobRequirements/ParameterSector';
import isEmpty from '../../../validations/common/isEmpty';
import SelectField from '../SelectField';
import { getAPI } from '../../../redux/actions/apiActions';
import { getSectors } from '../../../redux/actions/optionActions';
import { TextField } from '@material-ui/core';

class ParameterSector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				sector: '',
				experience: 0
			},
			errors: {}
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.checkKey = this.checkKey.bind(this);
	}

	componentDidMount() {
		this.props.getSectors();
		this.setState({ formData: this.props.requirement.requirement_value }, () => this.isValid());
	}

	componentDidUpdate(prevProps) {
		const currentReq = JSON.stringify(this.props.requirement.requirement_value);
		const prevReq = JSON.stringify(prevProps.requirement.requirement_value);
		const currentSectors = JSON.stringify(this.props.sectors);
		const prevSectors = JSON.stringify(prevProps.sectors);

		if (currentReq !== prevReq) {
			this.setState({ formData: this.props.requirement.requirement_value }, () => this.isValid());
		}

		if (currentSectors !== prevSectors) {
			this.props.getSectors();
		}
	}

	isValid() {
		const { errors, isValid } = validate(this.state.formData);

		this.setState({ errors });

		return isValid;
	}

	onChange(value, e) {
		let { formData } = this.state;
		formData[e.name] = value;
		this.setState({ formData }, () => {
			this.isValid();
			this.props.onChange(this.state.formData);
		});
	}

	checkKey(e) {
		const keyCode = e.which || e.keyCode;
		if (keyCode < 47 || keyCode > 58) {
			e.preventDefault();
		}
	}

	render() {
		const { classes, sectors } = this.props;
		const { errors } = this.state;
		const { sector, experience } = this.state.formData;
		const { requirement, component, requirement_value } = this.props.requirement;

		return (
			<FormControl
				margin="dense"
				fullWidth={true}
				error={!isEmpty(errors)}
				variant="outlined"
				className={classes.requirementBox}
			>
				<fieldset className={classname(classes.outlinedBox, !isEmpty(errors) ? classes.outlinedBoxError : '')}>
					<legend className={classes.outlinedLegend} />
				</fieldset>
				<FormLabel className={classes.outlinedLabel}>
					{!isEmpty(requirement) ? capitalize(requirement) : 'Sector'}
				</FormLabel>
				<Grid container spacing={24} alignItems="center" className={classes.outlinedContainer}>
					<Grid item xs={12} sm={6} md={4}>
						<SelectField
							label="Choose Sector For Matching"
							margin="dense"
							options={sectors}
							value={sector}
							placeholder="Choose Sector For Matching"
							isMulti={false}
							name="sector"
							fullWidth
							onChange={this.onChange}
							error={errors.sector}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							id="experience-years"
							label="Experience (Years)"
							autoComplete="experience"
							margin="dense"
							required
							fullWidth
							name="experience"
							value={experience}
							onChange={(e) => this.onChange(e.target.value, { name: e.target.name })}
							error={!isEmpty(errors.experience)}
							helperText={errors.experience}
							onKeyPress={this.checkKey}
						/>
					</Grid>
				</Grid>
				<Fab
					color="primary"
					size="small"
					className={classes.deleteBtn}
					onClick={() => this.props.deleteRequirement()}
				>
					<Delete />
				</Fab>
			</FormControl>
		);
	}
}

ParameterSector.propTypes = {
	classes: PropTypes.object.isRequired,
	requirement: PropTypes.object.isRequired,
	getSectors: PropTypes.func.isRequired,
	getAPI: PropTypes.func.isRequired,
	sectors: PropTypes.array
};

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	requirementBox: {
		margin: '12px -12px 12px 12px',
		width: 'calc(100% - 40px)'
	},
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
		width: '54px'
	},
	outlinedContainer: {
		width: '100%',
		margin: 0,
		padding: '4px'
	},
	deleteBtn: {
		position: 'absolute',
		top: '-18px',
		right: '-18px'
	},
	rating: {
		'&:hover': {
			'background-color': 'transparent'
		},
		'&:first-child': {
			'padding-left': 0
		}
	}
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	getSectors
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	sectors: state.options.approvedSectors
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ParameterSector));
