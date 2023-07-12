import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import ProfessionalSocietyLists from './professionalSocieties/ProfessionalSocietyLists';
import isEmpty from '../../validations/common/isEmpty';
import PublicationLists from './publications/PublicationLists';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';

import {
	onChangeForm7,
	checkError,
	setP11FormData,
	setP11Status,
	updateP11Status
} from '../../redux/actions/p11Actions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { validateP11Form7 } from '../../validations/p11';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { YesNoURL } from '../../config/general';

class P11Form7Old extends Component {
	constructor(props) {
		super(props);

		this.switchOnChange = this.switchOnChange.bind(this);
		this.getP11 = this.getP11.bind(this);
		this.isValid = this.isValid.bind(this);
	}

	componentDidMount() {
		this.getP11();
	}

	getP11() {
		this.props
			.getAPI('/api/p11-profile-form-7')
			.then((res) => {
				let { form7 } = this.props;
				Object.keys(res.data.data)
					.filter((key) => key in form7)
					.forEach((key) => (form7[key] = res.data.data[key]));
				if (!isEmpty(res.data.data.p11Status)) {
					this.props.setP11Status(JSON.parse(res.data.data.p11Status));
				}
				this.props.setP11FormData('form7', form7).then(() => this.isValid());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving your data'
				});
			});
	}

	isValid() {
		let { errors, isValid } = validateP11Form7(this.props.form7);
		this.props.updateP11Status(7, isValid, this.props.p11Status);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	switchOnChange(e) {
		const yesNoName = e.target.name;
		let yesNoValue = this.props.form7[e.target.name];
		if (yesNoValue) {
			yesNoValue = 0;
		} else {
			yesNoValue = 1;
		}

		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChangeForm7(yesNoName, yesNoValue);
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				this.getP11();
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
			// professional_societies_counts,
			publications_counts,
			// has_professional_societies,
			has_publications
		} = this.props.form7;
		let { errors, countries } = this.props;
		return (
			<Grid container spacing={24}>
				{/* <Grid item xs={12}>
					<FormControl margin="none" fullWidth>
						<FormControlLabel
							label={<p>Do you have any experience?</p>}
							control={
								<Switch
									checked={has_professional_societies === 1 ? true : false}
									onChange={this.switchOnChange}
									color="primary"
									name="has_professional_societies"
								/>
							}
						/>
					</FormControl>
					{has_professional_societies === 1 && (
						<FormControl margin="none" fullWidth error={!isEmpty(errors.professional_societies_counts)}>
							<FormLabel>
								List Professional Societies and Activities in Civic, Public or International Affairs
							</FormLabel>
							<br />
							<ProfessionalSocietyLists
								checkValidation={this.isValid}
								getP11={this.getP11}
								countries={countries}
							/>
							{(!isEmpty(errors.professional_societies_counts) || professional_societies_counts < 1) && (
								<FormHelperText>{errors.professional_societies_counts}</FormHelperText>
							)}
						</FormControl>
					)}
				</Grid> */}
				<Grid item xs={12}>
					<FormControl margin="none" fullWidth>
						<FormControlLabel
							label="Have you written/co-written any publication ?"
							control={
								<Switch
									checked={has_publications === 1 ? true : false}
									onChange={this.switchOnChange}
									color="primary"
									name="has_publications"
								/>
							}
						/>
					</FormControl>
					{has_publications === 1 ? (
						<FormControl margin="none" fullWidth error={!isEmpty(errors.publications_counts)}>
							<FormLabel>List any significant publications you have written/co-written</FormLabel>
							<br />
							<PublicationLists
								checkValidation={this.isValid}
								getP11={this.getP11}
								countries={countries}
							/>
							{(!isEmpty(errors.publications_counts) || publications_counts < 1) ? (
								<FormHelperText>{errors.publications_counts}</FormHelperText>
							) : null}
						</FormControl>
					) : null}
					<br />
					<br />
				</Grid>
			</Grid>
		);
	}
}

P11Form7Old.propTypes = {
	getAPI: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired,
	onChangeForm7: PropTypes.func.isRequired,
	setP11FormData: PropTypes.func.isRequired,
	form7: PropTypes.object.isRequired,
	countries: PropTypes.array.isRequired,
	errors: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	checkError,
	onChangeForm7,
	setP11FormData,
	postAPI,
	addFlashMessage,
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
	form7: state.p11.form7,
	countries: state.options.countries,
	errors: state.p11.errors,
	p11Status: state.p11.p11Status
});

export default connect(mapStateToProps, mapDispatchToProps)(P11Form7Old);
