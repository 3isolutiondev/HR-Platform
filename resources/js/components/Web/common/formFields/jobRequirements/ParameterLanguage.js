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
import { validate } from '../../../validations/HR/jobRequirements/ParameterLanguage';
import isEmpty from '../../../validations/common/isEmpty';
import SelectField from '../SelectField';
import { getAPI } from '../../../redux/actions/apiActions';
import { getLanguages, getLanguageLevels } from '../../../redux/actions/optionActions';
// import { TextField } from '@material-ui/core/TextField'
import YesNoField from '../../formFields/YesNoField';

class ParameterLanguage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				language: '',
				language_level: {
					value: '',
					label: ''
				},
				is_mother_tongue: 1
			},
			other_language: '',
			errors: {}
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.checkKey = this.checkKey.bind(this);
	}

	componentDidMount() {
		this.props.getLanguages();
		this.props.getLanguageLevels();
		if (!isEmpty(this.props.requirement.requirement_value)) {
			this.setState({ formData: this.modifyOldData(this.props.requirement.requirement_value) }, () =>
				this.isValid()
			);
		} else {
			this.isValid();
		}
	}

	componentDidUpdate(prevProps) {
		const currentReq = JSON.stringify(this.props.requirement.requirement_value);
		const prevReq = JSON.stringify(prevProps.requirement.requirement_value);
		const currentLanguages = JSON.stringify(this.props.languages);
		const prevLanguages = JSON.stringify(prevProps.languages);
		const currentLanguageLevels = JSON.stringify(this.props.language_levels);
		const prevLanguageLevels = JSON.stringify(prevProps.language_levels);

		if (currentReq !== prevReq) {
			let formDB = this.modifyOldData(this.props.requirement.requirement_value);
			this.setState({ formData: formDB }, () => this.isValid());
		}

		if (currentLanguages !== prevLanguages) {
			this.props.getLanguages();
		}

		if (currentLanguageLevels !== prevLanguageLevels) {
			this.props.getLanguageLevels();
		}
	}

	modifyOldData(fromDB) {
		if (isEmpty(fromDB.language_level)) {
			fromDB.language_level = {
				value: '',
				label: ''
			};
		}
		delete fromDB.read;
		delete fromDB.write;
		delete fromDB.speak;
		delete fromDB.understand;

		return fromDB;
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
		const { classes, languages, language_levels } = this.props;
		const { errors } = this.state;
		const { language, is_mother_tongue, language_level } = this.state.formData;
		const { requirement } = this.props.requirement;

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
					{!isEmpty(requirement) ? capitalize(requirement) : 'Language'}
				</FormLabel>
				<Grid container spacing={24} alignItems="center" className={classes.outlinedContainer}>
					<Grid item xs={12} sm={6} md={4} lg={3}>
						<SelectField
							label="Choose Language For Matching"
							margin="dense"
							options={languages}
							value={language}
							placeholder="Choose Language For Matching"
							isMulti={false}
							name="language"
							fullWidth
							onChange={this.onChange}
							error={errors.language}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={3}>
						<SelectField
							label="Language Ability"
							options={language_levels}
							value={language_level}
							onChange={(value, e) => this.onChange(value, { name: e.name })}
							placeholder="Select language ability"
							isMulti={false}
							name="language_level"
							error={errors.language_level}
							required
							fullWidth={true}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={3}>
						<YesNoField
							ariaLabel="Mother tongue?"
							label="Mother tongue?"
							value={is_mother_tongue.toString()}
							onChange={(e, value) => this.onChange(value, { name: e.target.name })}
							name="is_mother_tongue"
							error={errors.is_mother_tongue}
							margin="none"
						/>
					</Grid>
					{/* </Grid> */}
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

ParameterLanguage.propTypes = {
	classes: PropTypes.object.isRequired,
	requirement: PropTypes.object.isRequired,
	getLanguages: PropTypes.func.isRequired,
	getAPI: PropTypes.func.isRequired
	// languages: PropTypes.array.isRequired
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
		width: '77px'
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
	getLanguages,
	getLanguageLevels
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	languages: state.options.languages,
	language_levels: state.options.language_levels
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ParameterLanguage));
