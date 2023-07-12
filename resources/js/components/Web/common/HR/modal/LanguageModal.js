import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
// import LanguageForm from './modalForms/LanguageForm'

import Grid from '@material-ui/core/Grid';
import YesNoField from '../../formFields/YesNoField';
import SelectField from '../../formFields/SelectField';
import { getLanguageLevels } from '../../../redux/actions/optionActions';

class LanguageModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			language_level: '',
			is_mother_tongue: 0,
			// parameters: {
			// },
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.sendParameters = this.sendParameters.bind(this);
	}

	componentDidMount() {
		this.props.getLanguageLevels();
	}

	componentDidUpdate(prevProps) {
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
			id: this.props.parameters.id,
			language_level: this.state.language_level,
			is_mother_tongue: this.state.is_mother_tongue
		});
		this.setState({
			id: '',
			language_level: '',
			is_mother_tongue: 1
		});
	}

	render() {
		const { isOpen, language_levels } = this.props;
		const { language_level, is_mother_tongue, errors } = this.state;

		return (
			<Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.props.onClose}>
				<DialogTitle>Language Parameters</DialogTitle>
				<DialogContent>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<SelectField
								label="Language Ability"
								options={language_levels}
								value={language_level}
								onChange={(value, e) => this.onChange({ target: { name: e.name, value: value } })}
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
				</DialogContent>
				<DialogActions>
					<Button onClick={() => this.props.onClose()} color="secondary" variant="contained">
						Close
					</Button>
					<Button onClick={this.sendParameters} color="primary" variant="contained">
						Set Parameters
					</Button>
				</DialogActions>
			</Dialog>
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
const mapStateToProps = (state) => ({
	language_levels: state.options.language_levels
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageModal);
