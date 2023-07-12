import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Save from '@material-ui/icons/Save';
// import { getRoles } from '../../redux/actions/optionActions';
import { getAPI, postAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
// import { onSubmit, onChange, setFormIsEdit, switchPassword } from '../../redux/actions/dashboard/userActions';

import WysiwygField from '../../common/formFields/WysiwygField';
import moment from 'moment';
import DropzoneFileField from './DropzoneFileField';
import { onChangeStep, isValid, onUpload, onDelete } from '../../redux/actions/imtest/imtestActions';
import {

	imTestFile_DatasetDeleteFileURL
} from '../../config/general';

import Loadable from 'react-loadable';
import LoadingSpinner from '../../common/LoadingSpinner';

const DatePickerField = Loadable({
	loader: () => import('../../common/formFields/DatePickerField'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

class OnboardingForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			first_name: '',
			last_name: '',
            middle_initial: '',
            mailing_address:'',
            phone:'',
            mobile:'',
            other:'',
            fax:'',
            passport:'',
            passport_expiration_date:moment(new Date()).add(6, 'M'),
            issuing_location:'',
            email:'',
            emergency_name:'',
            emergency_phone:'',
            emergency_relationship:'',
            beneficiary_name:'',
            beneficiary_phone:'',
            beneficiary_relationship:'',
            acc_us_account_holder_name:'',
            acc_us_bank:'',
            acc_us_account:'',
            acc_us_aba:'',

            acc_over_account_holder_name:'',
            acc_over_bank:'',
            acc_over_account:'',
            acc_over_swift:'',
            acc_over_bank_address:'',
            acc_over_intermediary_bank:'',
            acc_over_aba:'',

            for_curr_over_account_holder_name:'',
            for_curr_over_bank:'',
            for_curr_over_account:'',
            for_curr_over_swift:'',
            for_curr_over_bank_address:'',
            for_curr_over_currency:'',
            for_curr_over_iban:'',

            contract:{},
            personal_data:{},
            conflict_of_interest:{},
            acceptedFiles:[ 'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.text'
            ],
            uploadURL: '/api/onboarding/upload',
            apiURL: '/api/onboarding',
            removeFileURL: '/api/onboarding/remove-file'
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
        this.switchOnChange = this.switchOnChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getFile = this.getFile.bind(this);
        this.dateOnChange = this.dateOnChange.bind(this);
        this.removeFile = this.removeFile.bind(this);
	}

    getFile(e) {

        if(e.collection_name==='contract') {
            this.setState({
                contract:e
            });
        } else if (e.collection_name==='personal_data') {
            this.setState({
                personal_data:e
            });
        } else if (e.collection_name==='conflict_of_interest') {
            this.setState({
                conflict_of_interest:e
            });
        }

    }
	switchOnChange(e) {
		let { value } = e.target;
		let boleanData = value === 'false' ? false : true;
		this.setState({
			[e.target.name]: !boleanData
		});

	}
    dateOnChange(e) {
		this.setState({ [e.target.name]: moment(e.target.value) });
	}
    onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
        });

    }

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
        });

    }

    removeFile () {

        this.props
				.deleteAPI(this.state.removeFileURL + '/' + this.state.contract['model_id'])
				.then((res) => {
					const { status, message } = res.data;
					this.props.addFlashMessage({
						type: status,
						text: message
					});

				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the delete request'
					});
				});
    }
	onSubmit(e) {
		e.preventDefault();

        const {contract, personal_data, conflict_of_interest, first_name, last_name,
            mailing_address, middle_initial,
            phone,
            mobile, other, fax, passport, passport_expiration_date, issuing_location, email,
            emergency_name, emergency_phone, emergency_relationship, beneficiary_name,
            beneficiary_phone, beneficiary_relationship, acc_us_account_holder_name, acc_us_bank,
            acc_us_account, acc_us_aba, acc_over_account_holder_name, acc_over_bank, acc_over_account,
            acc_over_swift, acc_over_bank_address, acc_over_intermediary_bank, acc_over_aba,
            for_curr_over_account_holder_name, for_curr_over_bank,for_curr_over_account,
            for_curr_over_swift, for_curr_over_bank_address, for_curr_over_currency, for_curr_over_iban} = this.state;

		let recordData = {
			first_name: first_name,
			last_name: last_name,
            mailing_address: mailing_address,
            middle_initial: middle_initial,
            phone: phone,
            mobile: mobile,
            other: other,
            fax : fax, passport: passport,
            passport_expiration_date: passport_expiration_date,
            issuing_location : issuing_location, email : email,
            emergency_name : emergency_name, emergency_phone: emergency_phone, emergency_relationship:emergency_relationship,
            beneficiary_name : beneficiary_name, beneficiary_phone : beneficiary_phone,
            beneficiary_relationship:beneficiary_relationship, acc_us_account_holder_name: acc_us_account_holder_name,
            acc_us_bank : acc_us_bank, acc_us_account:acc_us_account, acc_us_aba:acc_us_aba,
            acc_over_account_holder_name:acc_over_account_holder_name, acc_over_bank:acc_over_bank,
            acc_over_account : acc_over_account, acc_over_swift:acc_over_swift,
            acc_over_bank_address:acc_over_bank_address, acc_over_intermediary_bank:acc_over_intermediary_bank,
            acc_over_aba:acc_over_aba, for_curr_over_account_holder_name:for_curr_over_account_holder_name,
            for_curr_over_bank:for_curr_over_bank, for_curr_over_account:for_curr_over_account,
            for_curr_over_swift:for_curr_over_swift, for_curr_over_bank_address:for_curr_over_bank_address,
            for_curr_over_currency:for_curr_over_currency, for_curr_over_iban:for_curr_over_iban,
            contract:contract, personal_data:personal_data, conflict_of_interest:conflict_of_interest,

        };

        let counter_error_bank=1;
        if(acc_us_account_holder_name && acc_us_bank && acc_us_account && !acc_us_aba) {
            counter_error_bank=0;
        }

        if(acc_over_account_holder_name && acc_over_bank &&
            acc_over_account && acc_over_swift &&
            acc_over_bank_address && acc_over_intermediary_bank &&
            acc_over_aba) {
                counter_error_bank=0;
        }

        if(for_curr_over_account_holder_name &&
            for_curr_over_bank && for_curr_over_account &&
            for_curr_over_swift && for_curr_over_bank_address &&
            for_curr_over_currency && for_curr_over_iban) {
                counter_error_bank=0;
        }

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(email)) {
            this.props.addFlashMessage({
                type: 'error',
                text: 'Please input valid email'
            });
            return;
        }

        if(counter_error_bank>0) {
            this.props.addFlashMessage({
                type: 'error',
                text: 'Please complete bank information'
            });
            return;
        }


        if (!contract['id'] || !personal_data['id'] || !conflict_of_interest['id']) {
            this.props.addFlashMessage({
                type: 'error',
                text: 'Please choose file'
            });
            return;
        }

		let url = this.state.apiURL;
		this.props
			.postAPI(url, recordData)
			.then((res) => {

				this.props.addFlashMessage({
					type: 'success',
					text: 'Data has been added'
				});
			})
			.catch((err) => {});
	}

	render() {
        const { classes, errors, onChange, history } = this.props;

        const {uploadURL, removeFileURL, acceptedFiles, first_name, last_name, mailing_address, middle_initial, phone,
            mobile, other, fax, passport, passport_expiration_date, issuing_location, email,
            emergency_name, emergency_phone, emergency_relationship, beneficiary_name,
            beneficiary_phone, beneficiary_relationship, acc_us_account_holder_name, acc_us_bank,
            acc_us_account, acc_us_aba, acc_over_account_holder_name, acc_over_bank, acc_over_account,
            acc_over_swift, acc_over_bank_address, acc_over_intermediary_bank, acc_over_aba,
            for_curr_over_account_holder_name, for_curr_over_bank,for_curr_over_account,
            for_curr_over_swift, for_curr_over_bank_address, for_curr_over_currency, for_curr_over_iban,
            contract, personal_data, conflict_of_interest } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
                <div>
                <Card className={classes.break}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
                                <Typography variant="h6" color="primary">
                                    CONTACT FORM
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} >
							    <Grid container spacing={24}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            id="first_name"
                                            name="first_name"
                                            label="First name"
                                            fullWidth
                                            value={first_name}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            id="last_name"
                                            name="last_name"
                                            label="Last/Family"
                                            fullWidth
                                            autoComplete="name"
                                            value={last_name}
                                            onChange={this.onChange}
                                            margin="dense"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="middle_initial"
                                            name="middle_initial"
                                            label="Middle initial"
                                            fullWidth
                                            autoComplete="name"
                                            value={middle_initial}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <WysiwygField
                                            required
                                            label="Mailing Address"
                                            name="mailing_address"
                                            name='mailing_address'
                                            value={mailing_address? mailing_address:''}
                                            onChange={this.onChange}
                                        />

                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="phone"
                                            name="phone"
                                            label="Phone"
                                            fullWidth
                                            autoComplete="name"
                                            value={phone}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            required
                                            id="mobile"
                                            name="mobile"
                                            label="Mobile"
                                            fullWidth
                                            autoComplete="name"
                                            value={mobile}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="other"
                                            name="other"
                                            label="Other"
                                            fullWidth
                                            autoComplete="name"
                                            value={other}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="fax"
                                            name="fax"
                                            label="Fax"
                                            fullWidth
                                            autoComplete="name"
                                            value={fax}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="passport"
                                            name="passport"
                                            label="Passport"
                                            fullWidth
                                            autoComplete="name"
                                            value={passport}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <DatePickerField
                                            id="passport_expiration_date"
                                            name="passport_expiration_date"
                                            label="Expiration Date"
                                            fullWidth
                                            autoComplete="name"
                                            value={passport_expiration_date}
                                            margin="dense"
                                            onChange={this.dateOnChange}
                                        />

                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="issuing_location"
                                            name="issuing_location"
                                            label="Issuing Location"
                                            fullWidth
                                            autoComplete="name"
                                            value={issuing_location}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            required
                                            id="email"
                                            name="email"
                                            label="Email"
                                            fullWidth
                                            autoComplete="name"
                                            value={email}
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </CardContent>
				</Card>
                <Card className={classes.break}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
                                <Typography variant="h6" color="primary">
                                    EMERGENCY CONTACT INFORMATION
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} >
							    <Grid container spacing={24}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            id="emergency_name"
                                            name="emergency_name"
                                            label="Name"
                                            fullWidth
                                            value={emergency_name}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            id="emergency_phone"
                                            name="emergency_phone"
                                            label="Phone"
                                            fullWidth
                                            value={emergency_phone}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            id="emergency_relationship"
                                            name="emergency_relationship"
                                            label="Relationship"
                                            fullWidth
                                            value={emergency_relationship}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>

                                </Grid>
                            </Grid>

                        </Grid>
                    </CardContent>
				</Card>
                <Card className={classes.break}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
                                <Typography variant="h6" color="primary">
                                    BENEFICIARY CONTACT INFORMATION
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} >
							    <Grid container spacing={24}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            id="beneficiary_name"
                                            name="beneficiary_name"
                                            label="Name"
                                            fullWidth
                                            value={beneficiary_name}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            id="beneficiary_phone"
                                            name="beneficiary_phone"
                                            label="Phone"
                                            fullWidth
                                            value={beneficiary_phone}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            id="beneficiary_relationship"
                                            name="beneficiary_relationship"
                                            label="Relationship"
                                            fullWidth
                                            value={beneficiary_relationship}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>

                                </Grid>
                            </Grid>

                        </Grid>
                    </CardContent>
				</Card>
                <Card className={classes.break}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={12} lg={12} xl={12}>
                                <Typography variant="h6" color="primary">
                                    BANK INFORMATION
                                </Typography>
                            </Grid>
                            <Grid item xs={12} lg={12} xl={12}>
                                <Typography color="primary" className={classes.subheader}>
                                    If USD Account in United States
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} >
							    <Grid container spacing={24}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_us_account_holder_name"
                                            name="acc_us_account_holder_name"
                                            label="Account Holder Name"
                                            fullWidth
                                            value={acc_us_account_holder_name}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_us_bank"
                                            name="acc_us_bank"
                                            label="Bank"
                                            fullWidth
                                            value={acc_us_bank}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_us_account"
                                            name="acc_us_account"
                                            label="Account"
                                            fullWidth
                                            value={acc_us_account}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_us_aba"
                                            name="acc_us_aba"
                                            label="ABA"
                                            fullWidth
                                            value={acc_us_aba}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Grid item xs={12} lg={12} xl={12}>
                                <Typography color="primary" className={classes.subheader}>
                                    If USD Account Overseas
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} >
							    <Grid container spacing={24}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_over_account_holder_name"
                                            name="acc_over_account_holder_name"
                                            label="Account Holder Name"
                                            fullWidth
                                            value={acc_over_account_holder_name}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_over_bank"
                                            name="acc_over_bank"
                                            label="Bank"
                                            fullWidth
                                            value={acc_over_bank}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_over_account"
                                            name="acc_over_account"
                                            label="Account"
                                            fullWidth
                                            value={acc_over_account}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_over_swift"
                                            name="acc_over_swift"
                                            label="SWIFT"
                                            fullWidth
                                            value={acc_over_swift}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <WysiwygField
                                            label="Bank Address"
                                            name="acc_over_bank_address"
                                            name='acc_over_bank_address'
                                            value={acc_over_bank_address ? acc_over_bank_address:''}
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_over_intermediary_bank"
                                            name="acc_over_intermediary_bank"
                                            label="Intermediary Bank"
                                            fullWidth
                                            value={acc_over_intermediary_bank}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="acc_over_aba"
                                            name="acc_over_aba"
                                            label="ABA # (Bank in US)"
                                            fullWidth
                                            value={acc_over_aba}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Grid item xs={12} lg={12} xl={12}>
                                <Typography color="primary" className={classes.subheader}>
                                    If Foreign Currency Overseas
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} >
							    <Grid container spacing={24}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="for_curr_over_account_holder_name"
                                            name="for_curr_over_account_holder_name"
                                            label="Account Holder Name"
                                            fullWidth
                                            value={for_curr_over_account_holder_name}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="for_curr_over_bank"
                                            name="for_curr_over_bank"
                                            label="Bank"
                                            fullWidth
                                            value={for_curr_over_bank}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="for_curr_over_account"
                                            name="for_curr_over_account"
                                            label="Account"
                                            fullWidth
                                            value={for_curr_over_account}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="for_curr_over_swift"
                                            name="for_curr_over_swift"
                                            label="SWIFT"
                                            fullWidth
                                            value={for_curr_over_swift}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <WysiwygField
                                            label="Bank Address"
                                            name="for_curr_over_bank_address"
                                            name='for_curr_over_bank_address'
                                            value={for_curr_over_bank_address ? for_curr_over_bank_address:''}
                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="for_curr_over_currency"
                                            name="for_curr_over_currency"
                                            label="Currency"
                                            fullWidth
                                            value={for_curr_over_currency}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            id="for_curr_over_iban"
                                            name="for_curr_over_iban"
                                            label="IBAN "
                                            fullWidth
                                            value={for_curr_over_iban}
                                            autoComplete="name"
                                            margin="dense"
                                            onChange={this.onChange}

                                        />
                                    </Grid>

                                </Grid>
                            </Grid>

                        </Grid>
                    </CardContent>
				</Card>

                <Card className={classes.break}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
                                <Typography variant="h6" color="primary">
                                    ONBOARDING
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} >
							    <Grid container spacing={24}>
                                    <Grid item xs={12} sm={4}>
                                        <DropzoneFileField
                                            name="contract"
                                            label="Contract"
                                            onUpload={(name, data) => onUpload(name, data, 'contract')}
                                            onDelete={(name, removeFileURL, data, deleteId, contract) =>
                                                this.removeFile()
                                            }
                                            collectionName='contract'
                                            apiURL={uploadURL}
                                            deleteAPIURL={removeFileURL}
                                            isUpdate={false}
                                            filesLimit={1}
                                            acceptedFiles={acceptedFiles}

                                            getFile={this.getFile}
                                            fullWidth={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <DropzoneFileField
                                            name="personal_data"
                                            label="Personal Data"
                                            onUpload={(name, data) => onUpload(name, data, 'personal_data')}
                                            onDelete={(name, apiUrl, data, deleteId) =>
                                                this.removeFile()
                                            }
                                            collectionName='personal_data'
                                            apiURL={uploadURL}
                                            deleteAPIURL={imTestFile_DatasetDeleteFileURL}
                                            isUpdate={false}
                                            filesLimit={1}
                                            acceptedFiles={acceptedFiles}
                                            getFile={this.getFile}
                                            fullWidth={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <DropzoneFileField
                                            name="conflict_of_interest"
                                            label="Conflict of Interest"
                                            onUpload={(name, data) => onUpload(name, data, 'conflict_of_interest')}
                                            onDelete={(name, apiUrl, data, deleteId) =>
                                                this.removeFile()
                                            }
                                            collectionName='conflict_of_interest'
                                            apiURL={uploadURL}
                                            deleteAPIURL={imTestFile_DatasetDeleteFileURL}
                                            isUpdate={false}
                                            filesLimit={1}
                                            acceptedFiles={acceptedFiles}
                                            getFile={this.getFile}
                                            fullWidth={false}
                                        />
                                    </Grid>

                                </Grid>
                            </Grid>

                        </Grid>
                    </CardContent>
				</Card>

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
			    </div>
			</form>
		);
	}
}

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
    card: {
		display: 'flex',
		[theme.breakpoints.down('sm')]: {
			display: 'block'
		}
    },
    break: {
		marginBottom: '20px'
    },
    subheader: {
        backgroundColor:'#cac3c3',
        textAlign:'center', marginTop:'30px'
    }
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI, deleteAPI,
	addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	errors: state.dashboardUser.errors,
	isEdit: state.dashboardUser.isEdit,
	apiURL: state.dashboardUser.apiURL,
	redirectURL: state.dashboardUser.redirectURL
});

OnboardingForm.propTypes = {
	errors: PropTypes.object,
	isEdit: PropTypes.bool.isRequired,
	apiURL: PropTypes.string.isRequired,
	redirectURL: PropTypes.string.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(OnboardingForm));
