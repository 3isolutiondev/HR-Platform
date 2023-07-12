import React, { Component } from 'react';
// import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import isEmpty from '../../../validations/common/isEmpty';
import { validate } from '../../../validations/HR/contracts/contractTemplate';
import { addFlashMessage } from '../../../redux/actions/webActions';
import ContractTemplate from './ContractTemplate';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';
import { white } from '../../../config/colors';
// import DropzoneFileField from '../../../common/formFields/DropzoneFileField';

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
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

class HRContractTemplateForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			title: '',
			position: '',
			name_of_ceo: '',
			position_of_ceo: '',
			template: '',
			signature: '',
			isValid: true,
			errors: {},
			isEdit: false,
			apiURL: '/api/contract-template',
			redirectURL: '/dashboard/hr-contract-templates/'
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onUpload = this.onUpload.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/contract-template/' + this.props.match.params.id
			});
		}
	}

	componentDidMount() {
		if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiURL)
				.then((res) => {
					const { id, title, position, name_of_ceo, position_of_ceo, template, signature } = res.data.data;
					this.setState(
						{
							id,
							title,
							position,
							name_of_ceo,
							position_of_ceo,
							template,
							signature
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

	isValid() {
		const { errors, isValid } = validate(this.state);
		this.setState({ errors, isValid });
		return isValid;
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => {
			this.isValid();
		});
	}

	onSubmit(e) {
		e.preventDefault();
		let {
			isEdit,
			title,
			position,
			template,
			apiURL,
			redirectURL,
			errors,
			name_of_ceo,
			position_of_ceo
		} = this.state;

		let recordData = {
			title,
			position,
			template,
			name_of_ceo,
			position_of_ceo
		};

		if (isEdit) {
			recordData._method = 'PUT';
		}

		if (this.isValid()) {
			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(apiURL, recordData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							const { status, message } = res.data;
							this.props.history.push(redirectURL);
							this.props.addFlashMessage({
								type: status,
								text: message
							});
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'There is an error while processing the request'
							});
						});
					});
			});
		}
	}

	onUpload(name, files) {
		if (!isEmpty(files)) {
			this.setState({ [name]: { file_id: files[0].file_id, file_url: files[0].file_url } }, () => this.isValid());
		} else {
			this.setState({ [name]: {} }, () => this.isValid());
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => {
			this.isValid();
		});
	}

	render() {
		const { classes } = this.props;
		const { isEdit, title, showLoading } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Contract Template : ' + title
						) : (
							APP_NAME + ' - Dashboard > Add Contract Template'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Contract Template : ' + title
							) : (
								APP_NAME + ' Dashboard > Add Contract Template'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Contract Template : ' + title}
								{!isEdit && 'Add Contract Template'}
							</Typography>
						</Grid>

						<ContractTemplate data={this.state} onChange={this.onChange} />
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<Save /> Save{' '}
								{showLoading && (
									<CircularProgress thickness={5} size={22} className={classes.loading} />
								)}
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

HRContractTemplateForm.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
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
	addFlashMessage
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(HRContractTemplateForm));
