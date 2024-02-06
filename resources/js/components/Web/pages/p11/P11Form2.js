import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { addFlashMessage } from '../../redux/actions/webActions';
import isEmpty from '../../validations/common/isEmpty';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FieldOfWorkPicker from '../../common/formFields/FieldOfWorkPicker';
import YesNoField from '../../common/formFields/YesNoField';
import PreviouslySubmittedApplicationForUnLists from './previouslySubmittedApplicationForUN/PreviouslySubmittedApplicationForUnLists';
import {
	onChangeForm2,
	checkError,
	setP11FormData,
	updateP11Status,
	setP11Status
} from '../../redux/actions/p11Actions';
import { validateP11Form2 } from '../../validations/p11';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { YesNoURL } from '../../config/general';

class P11Form2 extends React.Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.isValid = this.isValid.bind(this);
		this.getP11 = this.getP11.bind(this);
		this.yesNoOnChange = this.yesNoOnChange.bind(this);
	}

	componentDidMount() {
		this.getP11();
	}

	componentDidUpdate(prevProps) {
		const prevFormData = JSON.stringify(prevProps.form2);
		const currentFormData = JSON.stringify(this.props.form2);
		if (prevFormData !== currentFormData) {
			this.isValid();
		}
	}

	getP11() {
		this.props
			.getAPI('/api/p11-profile-form-2')
			.then((res) => {
				let { form2 } = this.props;
				Object.keys(res.data.data)
					.filter((key) => key in form2)
					.forEach((key) => (form2[key] = res.data.data[key]));
				if (!isEmpty(res.data.data.p11Status)) {
					this.props.setP11Status(JSON.parse(res.data.data.p11Status));
				}
				this.props.setP11FormData('form2', form2).then(() => this.isValid());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving your data'
				});
			});
	}
	isValid() {
		let { errors, isValid } = validateP11Form2(this.props.form2);
		this.props.updateP11Status(2, isValid, this.props.p11Status);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	onChange(e) {
		if (e.target.name == 'preferred_field_of_work') {
			this.props
				.postAPI('/api/p11-update-preferred-field-of-works', {
					[e.target.name]: e.target.value,
					_method: 'PUT'
				})
				.then((res) => {
					this.props.onChangeForm2(e.target.name, isEmpty(e.target.value) ? [] : e.target.value);
					this.props.addFlashMessage({
						type: 'success',
						text: 'Preferred field of works successfully updated'
					});
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while updating your preferred field of works'
					});
				});
		} else {
			this.props.onChangeForm2(e.target.name, e.target.value);
		}
	}

	yesNoOnChange(e) {
		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;
		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChangeForm2(yesNoName, yesNoValue);
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				// this.getP11();
				this.props.getAPI('/api/p11-profile-form-2').then((res) => {
					// let { form2 } = this.props;
					if (!isEmpty(res.data.data.p11Status)) {
						this.props.setP11Status(JSON.parse(res.data.data.p11Status));
					}
					// this.props.onChangeForm2(yesNoName, yesNoValue);
					// this.props.setP11FormData('form2', form2).then(() => this.isValid());
				}).catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the request'
					});
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response ? err.response.data.status : 'success',
					text: err.response ? err.response.data.message : 'Update Success'
				});
			});
	}

	render() {
		let {
			preferred_field_of_work,
			accept_employment_less_than_six_month,
			previously_submitted_application_for_UN
		} = this.props.form2;
		let { un_organizations } = this.props;
		let { errors } = this.props;
		return (
			<React.Fragment>
				<Grid container spacing={22}>
					<Grid item xs={12}>
						<FieldOfWorkPicker
							name="preferred_field_of_work"
							field_of_works={preferred_field_of_work}
							onChange={(value, e) => this.onChange({ target: { name: e.name, value: value } })}
							errors={errors.preferred_field_of_work}
						/>
					</Grid>
					<Grid item xs={12}>
						<YesNoField
							ariaLabel="accept_employment_less_than_six_month"
							label="Would you accept employment for less than six months ?"
							value={accept_employment_less_than_six_month.toString()}
							onChange={this.onChange}
							name="accept_employment_less_than_six_month"
							error={errors.accept_employment_less_than_six_month}
							margin="dense"
						/>
					</Grid>
					<Grid item xs={12}>
						<YesNoField
							ariaLabel="previously_submitted_application_for_UN"
							label="Have you previously worked for 3iSolution?"
							value={previously_submitted_application_for_UN.toString()}
							onChange={this.yesNoOnChange}
							name="previously_submitted_application_for_UN"
							error={errors.previously_submitted_application_for_UN}
							margin="none"
						/>
						{(previously_submitted_application_for_UN === 1 ||
							previously_submitted_application_for_UN.toString() === '1') ? (
								<FormControl
									margin="normal"
									fullWidth
									error={!isEmpty(errors.previously_submitted_application_for_UN_counts)}
								>
									<PreviouslySubmittedApplicationForUnLists
										previously_submitted_application_for_UN={previously_submitted_application_for_UN}
										un_organizations={un_organizations}
										checkValidation={this.isValid}
										getP11={this.getP11} // harus ganti supaya ga ke reload lagi
									/>
									{!isEmpty(errors.previously_submitted_application_for_UN_counts) ? (
										<FormHelperText>
											{errors.previously_submitted_application_for_UN_counts}
										</FormHelperText>
									) : null}
								</FormControl>
							) : null}
					</Grid>
				</Grid>
			</React.Fragment>
		);
	}
}

P11Form2.propTypes = {
	addFlashMessage: PropTypes.func.isRequired,
	onChangeForm2: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired,
	getAPI: PropTypes.func.isRequired,
	setP11FormData: PropTypes.func.isRequired,
	form2: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	addFlashMessage,
	onChangeForm2,
	checkError,
	getAPI,
	postAPI,
	setP11FormData,
	updateP11Status,
	setP11Status
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	form2: state.p11.form2,
	errors: state.p11.errors,
	un_organizations: state.options.un_organizations,
	p11Status: state.p11.p11Status
});

export default connect(mapStateToProps, mapDispatchToProps)(P11Form2);
