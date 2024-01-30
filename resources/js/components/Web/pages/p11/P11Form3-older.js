import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import isEmpty from '../../validations/common/isEmpty';
import YesNoField from '../../common/formFields/YesNoField';
import RelativesEmployedByInternationalOrgLists from './relativesEmployedByPublicInternationalOrg/RelativesEmployedByPublicInternationalOrgLists';
import SelectField from '../../common/formFields/SelectField';
import {
	onChangeForm3,
	checkError,
	setP11FormData,
	setP11Status,
	updateP11Status
} from '../../redux/actions/p11Actions';
import { validateP11Form3 } from '../../validations/p11';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { YesNoURL } from '../../config/general';

class P11Form3Old extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.multiSelect = this.multiSelect.bind(this);
		this.getP11 = this.getP11.bind(this);
		this.isValid = this.isValid.bind(this);
		this.yesNoOnChange = this.yesNoOnChange.bind(this);
	}
	componentDidMount() {
		this.getP11();
	}

	componentDidUpdate(prevProps) {
		const strForm3 = JSON.stringify(this.props.form3);
		const strPrevForm3 = JSON.stringify(prevProps.form3);
		if (strForm3 !== strPrevForm3) {
			this.isValid();
		}
	}
	getP11(isRelativeChange = false) {
		this.props
			.getAPI('/api/p11-profile-form-3')
			.then((res) => {
				if (isRelativeChange) {
					this.props.onChangeForm3(
						'relatives_employed_by_public_international_organization_counts',
						res.data.data.relatives_employed_by_public_international_organization_counts
					);
					this.isValid();
				} else {
					let { form3 } = this.props;
					Object.keys(res.data.data)
						.filter((key) => key in form3)
						.forEach((key) => (form3[key] = res.data.data[key]));
					if (!isEmpty(res.data.data.p11Status)) {
						this.props.setP11Status(JSON.parse(res.data.data.p11Status));
					}
					this.props.setP11FormData('form3', form3).then(() => this.isValid());
				}
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
		// this.isValid();
	}

	multiSelect(values, e) {
		if (e.name === 'p11_legal_permanent_residence_status') {
			if (isEmpty(values)) {
				this.props.onChangeForm3('legal_permanent_residence_status_counts', 0);
			}
		}
		this.props.onChangeForm3(e.name, values);
		// this.isValid();
	}

	yesNoOnChange(e) {
		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;
		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChangeForm3(yesNoName, yesNoValue);
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				// this.getP11();
				if (yesNoValue == 0) {
					if (yesNoName === 'legal_step_changing_present_nationality') {
						this.props.onChangeForm3('legal_step_changing_present_nationality_explanation', '');
					} else if (yesNoName === 'legal_permanent_residence_status') {
						this.props.onChangeForm3('legal_permanent_residence_status_counts', 0);
						this.props.onChangeForm3('p11_legal_permanent_residence_status', []);
					} else if (yesNoName === 'relatives_employed_by_public_international_organization') {
						this.props.onChangeForm3('relatives_employed_by_public_international_organization_counts', 0);
					}
				}
				this.isValid();
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
			legal_permanent_residence_status,
			p11_legal_permanent_residence_status,
			legal_step_changing_present_nationality,
			legal_step_changing_present_nationality_explanation,
			relatives_employed_by_public_international_organization
		} = this.props.form3;

		let { p11Countries, errors } = this.props;
		return (
			<React.Fragment>
				<Grid container spacing={24}>
					<Grid item xs={12}>
						<YesNoField
							ariaLabel="Legal Permanent Residence Status"
							label="Do you have legal permanent residency in any country other than that of your nationality? If “yes”, which country?"
							value={legal_permanent_residence_status.toString()}
							onChange={this.yesNoOnChange}
							name="legal_permanent_residence_status"
							error={errors.legal_permanent_residence_status}
							margin="dense"
						/>
						{(legal_permanent_residence_status.toString() === '1' ||
							legal_permanent_residence_status === 1) ? (
							<SelectField
								label="Legal Permanent Residence Status Country List "
								options={p11Countries}
								value={p11_legal_permanent_residence_status}
								onChange={this.multiSelect}
								placeholder="Select countries"
								isMulti={true}
								name="p11_legal_permanent_residence_status"
								error={errors.p11_legal_permanent_residence_status}
                fullWidth
							/>
						) : null}
					</Grid>
					<Grid item xs={12}>
						<YesNoField
							ariaLabel="Legal Permanent Residence Status"
							label="Have you taken any legal steps towards changing your present nationality? If “yes”, please explain below:"
							value={legal_step_changing_present_nationality.toString()}
							onChange={this.yesNoOnChange}
							name="legal_step_changing_present_nationality"
							error={errors.legal_step_changing_present_nationality}
							margin="dense"
						/>
						{(legal_step_changing_present_nationality.toString() === '1' ||
							legal_step_changing_present_nationality === 1) ? (
							<TextField
								required
								id="legal_step_changing_present_nationality_explanation"
								name="legal_step_changing_present_nationality_explanation"
								label="Please complete the explanation field provided"
								fullWidth
								autoComplete="explain"
								value={legal_step_changing_present_nationality_explanation}
								onChange={this.onChange}
								error={!isEmpty(errors.legal_step_changing_present_nationality_explanation)}
								helperText={errors.legal_step_changing_present_nationality_explanation}
								multiline
								rows={2}
							/>
						) : null}
					</Grid>
					{/* <Grid item xs={12}>
						<YesNoField
							ariaLabel="Has Dependents"
							label="Have you any dependents?"
							value={has_dependents.toString()}
							onChange={this.onChange}
							name="has_dependents"
							error={errors.has_dependents}
							margin="none"
						/>
						{(has_dependents === '1' || has_dependents === 1) && (
							<div>
								<br />
								<FormControl margin="normal" fullWidth error={!isEmpty(errors.dependents)}>
									<DependentLists
										has_dependents={has_dependents}
										checkValidation={this.props.isValid}
										getP11={this.props.getP11}
									/>
									{!isEmpty(errors.dependents) && (
										<FormHelperText>{errors.dependents}</FormHelperText>
									)}
								</FormControl>
								<br />
							</div>
						)}
					</Grid> */}
					<Grid item xs={12}>
						<YesNoField
							ariaLabel="Relatives Employed by Public International Organization"
							label="Are any of your relatives currently employed by 3iSolution? If “yes”, please provide the following information:"
							value={relatives_employed_by_public_international_organization.toString()}
							onChange={this.yesNoOnChange}
							name="relatives_employed_by_public_international_organization"
							error={errors.relatives_employed_by_public_international_organization}
							margin="dense"
							// bold="iMMAP"
						/>
						{(relatives_employed_by_public_international_organization.toString() === '1' ||
							relatives_employed_by_public_international_organization === 1) ? (
							<FormControl
								margin="normal"
								fullWidth
								error={!isEmpty(errors.relatives_employed_by_public_international_organization_counts)}
							>
								<RelativesEmployedByInternationalOrgLists
									relatives_employed_by_public_international_organization={
										relatives_employed_by_public_international_organization
									}
									checkValidation={this.isValid}
									getP11={this.getP11}
								/>
								{!isEmpty(errors.relatives_employed_by_public_international_organization_counts) ? (
									<FormHelperText>
										{errors.relatives_employed_by_public_international_organization_counts}
									</FormHelperText>
								) : null}
							</FormControl>
						) : null}
						<br />
						<br />
					</Grid>
				</Grid>
			</React.Fragment>
		);
	}
}

P11Form3Old.propTypes = {
	checkError: PropTypes.func.isRequired,
	onChangeForm3: PropTypes.func.isRequired,
	setP11FormData: PropTypes.func.isRequired,
	getAPI: PropTypes.func.isRequired,
	nationalities: PropTypes.array.isRequired,
	p11Countries: PropTypes.array.isRequired,
	form3: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	checkError,
	onChangeForm3,
	setP11FormData,
	getAPI,
	postAPI,
	addFlashMessage,
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
	nationalities: state.options.nationalities,
	p11Countries: state.options.p11Countries,
	form3: state.p11.form3,
	errors: state.p11.errors,
	p11Status: state.p11.p11Status
});

export default connect(mapStateToProps, mapDispatchToProps)(P11Form3Old);
