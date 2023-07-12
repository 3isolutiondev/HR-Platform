import React, { Component } from 'react';
import connect from 'react-redux';
import Grid from '@material-ui/core/Grid';
import YesNoField from '../../../common/formFields/YesNoField';
import { getLanguageLevels } from '../../../redux/actions/optionActions';
import SelectField from '../../../common/formFields/SelectField';

class LanguageForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			language_level: '',
			is_mother_tongue: 1,
			parameters: {
				language_level: '',
				is_mother_tongue: 1
			},
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.sendParameters = this.sendParameters.bind(this);
	}

	componentDidMount() {
		this.props.getLanguageLevels();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.languageId !== this.props.languageId) {
			this.sendParameters();
		}

		const currentLanguageLevels = JSON.stringify(this.props.language_levels);
		const prevLanguageLevels = JSON.stringify(prevProps.language_levels);

		if (currentLanguageLevels !== prevLanguageLevels) {
			this.props.getLanguageLevels();
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	sendParameters() {
		this.props.setParameters({
			id: this.props.languageId,
			language_level: this.state.language_level,
			is_mother_tongue: this.state.is_mother_tongue
		});
	}

	render() {
		const { language_level, is_mother_tongue, errors } = this.state;
		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<SelectField
						label="Language Ability"
						options={this.props.language_levels}
						value={language_level}
						onChange={this.selectOnChange}
						placeholder="Select language ability"
						isMulti={false}
						name="language_level"
						error={errors.language_level}
						required
						fullWidth={true}
					/>
				</Grid>
				<Grid item xs={12}>
					<YesNoField
						ariaLabel="Is this language is your mother tongue?"
						label="Is this language is your mother tongue?"
						value={is_mother_tongue.toString()}
						onChange={this.onChange}
						name="is_mother_tongue"
						error={errors.is_mother_tongue}
						margin="none"
					/>
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
	getLanguageLevels
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state = {
	language_levels: state.options.language_levels
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageForm);
