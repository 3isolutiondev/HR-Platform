import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import SelectField from '../../../common/formFields/SelectField';
import WysiwygField from '../../../common/formFields/WysiwygField';
import { getEmailAddress, getImmapEmailAddress } from '../../../redux/actions/optionActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { postAPI } from '../../../redux/actions/apiActions';
import { validateMail } from '../../../validations/mail';
import isEmpty from '../../../validations/common/isEmpty';

class Mail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			to: [],
			cc: [],
			bcc: [],
			subject: 'Finalization of your 3iSolution Careers profile',
			body:
				'<h1>Dear User,</h1><p><br/>Your profile on 3iSolution Careers is still marked as incomplete.<br/></p><p>Do not forget to complete your profile through the registration process to be able apply for our job vacancies or the iMMAP Talent Pool.<br/></p><p>Please provide your remaining details on the <b>profile section</b> of 3iSolution Careers:</p><p>[profile_btn]</p><p>We look forward to working with you soon. <br/><br/></p><p>Thank you and best regards,<br/>3iSolution Careers</p>',
			url: '/api/send-email',
			isValid: false,
			errors: {},
			loading: false
		};
		this.selectOnChange = this.selectOnChange.bind(this);
		this.onChange = this.onChange.bind(this);
		this.isValid = this.isValid.bind(this);
		this.handlePreview = this.handlePreview.bind(this);
	}
	componentDidMount() {
		this.props.getEmailAddress();
		this.props.getImmapEmailAddress();
		this.isValid();
	}

	selectOnChange(values, e) {
		if (values.length <= 15) {
			this.setState({ [e.name]: values }, () => this.isValid());
		} else {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Maximum Email Address'
			});
		}
	}
	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

	isValid() {
		let { errors, isValid } = validateMail(this.state);
		this.setState({ errors, isValid });
		return isValid;
	}

	handlePreview() {
		this.setState({ loading: true }, () => {
			const { to, cc, bcc, subject, body, url } = this.state;
			let formData = { subject, body };
			const toArray = to.map((dt) => dt.email);
			formData.to = toArray;
			if (!isEmpty(cc)) {
				const ccArray = cc.map((dt) => dt.email);
				formData.cc = ccArray;
			}
			if (!isEmpty(bcc)) {
				const bccArray = bcc.map((dt) => dt.email);
				formData.bcc = bccArray;
			}
			// const formData = { to: toArray, cc: ccArray, bcc: bccArray, subject, body };

			this.props
				.postAPI(url, formData)
				.then((res) => {
					this.setState({ loading: false });
					this.props.addFlashMessage({
						type: res.data.status,
						text: res.data.message
					});
				})
				.catch((err) => {
					this.setState({ loading: false });
					this.props.addFlashMessage({
						type: 'error',
						text: 'Error Send Mail'
					});
				});
		});
	}

	render() {
		const { classes, email, immap_emails } = this.props;
		const { to, cc, bcc, subject, body, errors, isValid, loading } = this.state;
		return (
			<Card className={classes.card}>
				<CardHeader title="P11 Not Complete Reminder" />
				<CardContent>
					<SelectField
						// label="To"
						options={email}
						value={to}
						onChange={this.selectOnChange}
						placeholder="To"
						isMulti={true}
						name="to"
						error={errors.to}
						margin="none"
						required
					/>

					<SelectField
						// label="cc"
						options={immap_emails}
						value={cc}
						onChange={this.selectOnChange}
						placeholder="cc"
						isMulti={true}
						name="cc"
						error={errors.cc}
						margin="none"
						required
					/>
					<SelectField
						// label="bcc"
						options={immap_emails}
						value={bcc}
						onChange={this.selectOnChange}
						placeholder="bcc"
						isMulti={true}
						name="bcc"
						error={errors.bcc}
						margin="none"
						required
					/>
					<TextField
						required
						id="subject"
						name="subject"
						// label="City"
						placeholder="Subject"
						fullWidth
						autoComplete="subject"
						value={subject}
						onChange={this.onChange}
						error={!isEmpty(errors.subject)}
						helperText={errors.subject}
						margin="dense"
					/>

					<WysiwygField
						withColor={true}
						label="Body"
						margin="dense"
						name="body"
						value={body}
						onChange={this.onChange}
						error={errors.body}
					/>
				</CardContent>

				<CardActions>
					<Button
						onClick={this.handlePreview}
						variant="contained"
						color="primary"
						className={classes.pullRight}
						disabled={!isValid}
					>
						{loading ? <CircularProgress className={classes.loading} size={20} /> : 'SEND'}
					</Button>
				</CardActions>
			</Card>
		);
	}
}

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	card: {
		minWidth: 275
	},
	pullRight: {
		marginLeft: 'auto'
	},
	loading: {
		color: 'white',
		animationDuration: '550ms',
		left: 0
	}
});

Mail.propTypes = {
	classes: PropTypes.object.isRequired,
	email: PropTypes.array.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getEmailAddress: PropTypes.func.isRequired,
	getImmapEmailAddress: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getEmailAddress,
	getImmapEmailAddress,
	addFlashMessage,
	postAPI
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	email: state.options.email,
	immap_emails: state.options.immap_emails
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Mail));
