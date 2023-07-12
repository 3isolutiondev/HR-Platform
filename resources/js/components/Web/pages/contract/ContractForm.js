import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Save from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
import DatePickerField from '../../common/formFields/DatePickerField';
import SelectField from '../../common/formFields/SelectField';
import SearchAndSelect from '../../common/formFields/SearchAndSelect';
import { getAPI, deleteAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { contractValidation } from '../../validations/HR/contracts/contract';
import isEmpty from '../../validations/common/isEmpty';
import ContractTemplate from '../../pages/dashboard/HR/ContractTemplate';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	}
});

class ContractForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEdit: false,
			email: '',
			user: {},
			isValid: false,
			errors: {},
			contract_start: moment(new Date()),
			contract_end: moment(new Date()).add(6, 'M'),
			date_contract_accepted: moment(new Date()).add(6, 'M'),
			contract_template: [],
			valTemplate: '',
			getTemplate: false,
			suggestionURL: '/api/searchuserbyemail',
			apiURL: '/api/contract-template/',
			apiContract: '/api/contract/',
			redirectURL: '/contract',
			id: '',
			title: '',
			position: '',
			name_of_ceo: '',
			position_of_ceo: '',
			template: ''
		};
		this.dateOnChange = this.dateOnChange.bind(this);
		this.insertData = this.insertData.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.selectContractTemplate = this.selectContractTemplate.bind(this);
		this.validationTemplate = this.validationTemplate.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.getContract = this.getContract.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiContract: '/api/contract/' + this.props.match.params.id
			});
		}
	}

	componentDidMount() {
		if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiContract)
				.then((res) => {
					const {
						id,
						title,
						position,
						name_of_ceo,
						position_of_ceo,
						contract,
						date_end,
						date_start,
						date_ttd,
						user
					} = res.data.data;
					this.setState(
						{
							id,
							title,
							position,
							name_of_ceo,
							position_of_ceo,
							template: contract,
							contract_start: moment(date_start),
							contract_end: moment(date_end),
							date_contract_accepted: moment(date_ttd),
							user,
							email: user.email,
							getTemplate: true
						},
						() => this.isValid()
					);
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while requesting tor data'
					});
				});
		} else {
			this.isValid();
			this.getContract();
		}
	}

	getContract() {
		this.props.getAPI('/api/contract-template').then((res) => {
			let response = res.data.data.map((data) => {
				return { value: data.id, label: data.title };
			});

			this.setState({ contract_template: response });
		}).catch((err) => {
			this.props.addFlashMessage({
				type: 'error',
				text: 'There is an error while getting a contract template'
			});
		});
	}

	isValid() {
		const { errors, isValid } = contractValidation(this.state);
		this.setState({ errors, isValid });
		return isValid;
	}

	insertData(data) {
		this.setState({ user: data }, () => this.isValid());
	}
	dateOnChange(e) {
		this.setState({ [e.target.name]: moment(e.target.value) }, () => this.isValid());
	}
	handleClose() {
		this.setState({ anchorEl: null });
	}
	selectContractTemplate(value, e) {
		this.setState({ [e.name]: value }, () => this.validationTemplate());
	}
	validationTemplate() {
		let { valTemplate } = this.state;
		if (valTemplate) {
			this.props
				.getAPI(this.state.apiURL + valTemplate.value)
				.then((res) => {
					const { id, title, position, name_of_ceo, position_of_ceo, template } = res.data.data;
					this.setState(
						{
							id,
							title,
							position,
							name_of_ceo,
							position_of_ceo,
							template
						},
						() => this.isValid()
					);
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while requesting tor data'
					});
				});
		} else {
			this.isValid();
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => {
			this.isValid();
		});
	}
	onSubmit(e) {
		e.preventDefault();
		let dateFormat = 'YYYY-MM-DD';

		let {
			user,
			contract_start,
			contract_end,
			date_contract_accepted,
			template,
			name_of_ceo,
			position_of_ceo,
			position,
			title,
			isEdit,
			apiContract,
			redirectURL
		} = this.state;

		let recordData = {
			id_name: user.id,
			date_start: moment(contract_start).format(dateFormat),
			date_end: moment(contract_end).format(dateFormat),
			date_ttd: moment(date_contract_accepted).format(dateFormat),
			contract: template,
			name_of_ceo,
			position_of_ceo,
			position,
			title
		};

		if (isEdit) {
			recordData._method = 'PUT';
		}

		if (this.isValid()) {
			this.props
				.postAPI(apiContract, recordData)
				.then((res) => {
					const { status, message } = res.data;
					this.props.history.push(redirectURL);
					this.props.addFlashMessage({
						type: status,
						text: message
					});
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the request'
					});
				});
		}
	}

	render() {
		const { classes } = this.props;
		const {
			isEdit,
			email,
			user,
			isValid,
			errors,
			contract_start,
			contract_end,
			valTemplate,
			contract_template,
			date_contract_accepted,
			suggestionURL,
			getTemplate
		} = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Contract : ' + user.full_name
						) : (
							APP_NAME + ' - Dashboard > Add Contract'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Contract : ' + user.full_name
							) : (
								APP_NAME + ' Dashboard > Add Contract'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Contract : '}
								{!isEdit && 'Add Contract'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<SearchAndSelect
								id="search_email"
								option={user}
								placeholder="Search User"
								suggestionURL={suggestionURL}
								insertData={this.insertData}
								error={errors.email}
							/>
						</Grid>
						{!isEmpty(user) && (
							<Grid item xs={12}>
								<Typography variant="h6" gutterBottom>
									Full Name : {user.full_name}
								</Typography>
							</Grid>
						)}
						<Grid item xs={6}>
							<DatePickerField
								label="Contract Start *"
								name="contract_start"
								value={contract_start}
								onChange={this.dateOnChange}
								error={errors.contract_start}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={6}>
							<DatePickerField
								label="Contract End *"
								name="contract_end"
								value={contract_end}
								onChange={this.dateOnChange}
								error={errors.contract_end}
								margin="dense"
							/>
						</Grid>
						{!isEdit && (
							<Grid item xs={12}>
								<SelectField
									label="Select Contract Template *"
									margin="dense"
									options={contract_template}
									value={valTemplate}
									placeholder="Choose Contract Template"
									isMulti={false}
									name="valTemplate"
									fullWidth
									onChange={this.selectContractTemplate}
									error={errors.valTemplate}
									required
									autoFocus
								/>
							</Grid>
						)}
						{(valTemplate || getTemplate) && (
							<Grid item xs={12}>
								<ContractTemplate data={this.state} onChange={this.onChange} />
							</Grid>
						)}

						<Grid item xs={6}>
							<DatePickerField
								label="Date Contract Accepted *"
								name="date_contract_accepted"
								value={date_contract_accepted}
								onChange={this.dateOnChange}
								error={errors.date_contract_accepted}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<Save /> Save
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

ContractForm.propTypes = {
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect('', mapDispatchToProps)(ContractForm));
