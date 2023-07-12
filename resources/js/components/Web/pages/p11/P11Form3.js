import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import LanguageLists from './languages/LanguageLists';
import isEmpty from '../../validations/common/isEmpty';
import {
	onChangeForm3,
	checkError,
	setP11FormData,
	setP11Status,
	updateP11Status
} from '../../redux/actions/p11Actions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { validateP11Form3 } from '../../validations/p11';
import { getAPI } from '../../redux/actions/apiActions';

class P11Form3 extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
		this.getP11 = this.getP11.bind(this);
		this.isValid = this.isValid.bind(this);
	}

	componentDidMount() {
		this.getP11();
	}

	getP11() {
		this.props
			.getAPI('/api/p11-profile-form-3')
			.then((res) => {
				let { form3 } = this.props;
				Object.keys(res.data.data)
					.filter((key) => key in form3)
					.forEach((key) => (form3[key] = res.data.data[key]));
				if (!isEmpty(res.data.data.p11Status)) {
					this.props.setP11Status(JSON.parse(res.data.data.p11Status));
				}
				this.props.setP11FormData('form3', form3).then(() => this.isValid());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving your data'
				});
			});
	}
	isValid() {
		let { errors, isValid } = validateP11Form3(this.props.form3);
		this.props.updateP11Status(3, isValid, this.props.p11Status);
		this.props.checkError(errors, isValid);
		return isValid;
	}
	onChange(e) {
		this.props.onChangeForm3(e.target.name, e.target.value);
		this.isValid();
	}

	switchOnChange(e) {
		if (this.props.form3[e.target.name]) {
			this.props.onChangeForm3(e.target.name, 0);
		} else {
			this.props.onChangeForm3(e.target.name, 1);
		}
		this.isValid();
	}

	render() {
		let { knowledge_of_language_counts } = this.props.form3;
		let { languages, errors } = this.props;
		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<FormControl
						margin="none"
						fullWidth
						error={!isEmpty(errors.knowledge_of_language_counts) || knowledge_of_language_counts < 1}
					>

						<br />
						<LanguageLists languages={languages} checkValidation={this.isValid} getP11={this.getP11} />
						{(!isEmpty(errors.knowledge_of_language_counts) || knowledge_of_language_counts < 1) ? (
							<FormHelperText>{errors.knowledge_of_language_counts}</FormHelperText>
						) : null}
						<br />
						<br />
					</FormControl>
				</Grid>
			</Grid>
		);
	}
}

P11Form3.propTypes = {
	getAPI: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired,
	onChangeForm3: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	form3: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	languages: PropTypes.array.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	checkError,
	onChangeForm3,
	addFlashMessage,
	setP11FormData,
	setP11Status,
	updateP11Status
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	form3: state.p11.form3,
	errors: state.p11.errors,
	languages: state.options.languages,
	p11Status: state.p11.p11Status
});

export default connect(mapStateToProps, mapDispatchToProps)(P11Form3);
