import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import ReferencesList from './references/ReferenceLists';
import isEmpty from '../../validations/common/isEmpty';

import {
	onChangeForm6,
	checkError,
	setP11FormData,
	setP11Status,
	updateP11Status
} from '../../redux/actions/p11Actions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { validateP11Form6 } from '../../validations/p11';
import { getAPI } from '../../redux/actions/apiActions';
import PortfolioLists from './portfolios/PortfolioLists';
import ReferenceNoticeModal from '../../common/ReferenceNoticeModal';

class P11Form6 extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.getP11 = this.getP11.bind(this);
		this.isValid = this.isValid.bind(this);
		this.setShowReferenceNoticeModal = this.setShowReferenceNoticeModal.bind(this);
		this.state = {
			reference_notice_read: false,
			showReferenceNoticeModal: false
		}
	}
	componentDidMount() {
		this.getP11();
	}
	componentDidUpdate(prevProps) {
		const strForm6 = JSON.stringify(this.props.form6);
		const strPrevForm6 = JSON.stringify(prevProps.form6);
		if (strForm6 !== strPrevForm6) {
			this.isValid();
		}
	}
	setShowReferenceNoticeModal() {
		this.setState({showReferenceNoticeModal: true})
	}

	getP11() {
		this.props
			.getAPI('/api/p11-profile-form-6')
			.then((res) => {
				if(res.data.data.reference_notice_read === 1) {
					this.setState({reference_notice_read: true})
				}
				if (res.data.data.relevant_facts === null) {
					res.data.data.relevant_facts = '';
				}
				let { form6 } = this.props;
				Object.keys(res.data.data)
					.filter((key) => key in form6)
					.forEach((key) => (form6[key] = res.data.data[key]));
				if (!isEmpty(res.data.data.p11Status)) {
					this.props.setP11Status(JSON.parse(res.data.data.p11Status));
				}
				this.props.setP11FormData('form6', form6).then(() => this.isValid());
				// this.props.onChangeForm6('references_counts', res.data.data.references_counts);

				// this.isValid();
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving your data'
				});
			});
	}

	isValid() {
		let { errors, isValid } = validateP11Form6(this.props.form6);
		this.props.updateP11Status(6, isValid, this.props.p11Status);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	onChange(e) {
		this.props.onChangeForm6(e.target.name, e.target.value);
		// this.isValid();
	}

	render() {
		let { references_counts, relevant_facts } = this.props.form6;
		let { errors, countries } = this.props;
		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<FormControl margin="none" fullWidth error={!isEmpty(errors.references_counts)}>
						<FormLabel>
							<b>References</b>: List your previous three line managers.
							<br />
							{/* <b>Do not repeat names of supervisors listed in employment record</b> */}
							If you are selected for a vacancy or accepted as a member of our roster we will perform a mandatory reference check based on the information provided here. By adding your references you consent to 3iSolution contacting them.
						</FormLabel>
						<br />
						<ReferencesList
							countries={countries}
							checkValidation={this.isValid}
							getP11={this.getP11}
							references_counts={references_counts}
							// countries={countries}
							noticeRead={this.state.reference_notice_read}
							setShowReferenceNoticeModal={this.setShowReferenceNoticeModal}
							checkNoticeRead={true}
						/>
						{(!isEmpty(errors.references_counts) || references_counts < 1) ? (
							<FormHelperText>{errors.references_counts}</FormHelperText>
						) : null}
					</FormControl>
				</Grid>
				{/* <Grid item xs={12}>
					<TextField
						id="relevant_facts"
						name="relevant_facts"
						// label="State Any Other Relevant Facts, Including Information Regarding Any Residence Outside The Country of Your Nationality"
						fullWidth
						value={relevant_facts}
						autoComplete="relevant_facts"
						onChange={this.onChange}
						error={!isEmpty(errors.relevant_facts)}
						helperText={errors.relevant_facts}
						multiline
						rows={7}
					/>
					<br />
					<br />
				</Grid> */}
				<Grid item xs={12}>
					<FormControl
						margin="normal"
						fullWidth
						error={!isEmpty(errors.portfolios_counts)}
					>
						<PortfolioLists
						checkValidation={this.isValid}
						getP11={this.getP11}
						/>
						{!isEmpty(errors.portfolios_counts) ? (
						<FormHelperText>{errors.portfolios_counts}</FormHelperText>
						) : null}
					</FormControl>
				</Grid>
			</Grid>
		);
	}
}

P11Form6.propTypes = {
	getAPI: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired,
	onChangeForm6: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	form6: PropTypes.object.isRequired,
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
	onChangeForm6,
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
const mapStateToProps = (state) => {
	return {
		form6: state.p11.form6,
		countries: state.options.countries,
		errors: state.p11.errors,
		p11Status: state.p11.p11Status
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(P11Form6);
