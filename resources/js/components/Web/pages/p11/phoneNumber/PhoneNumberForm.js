import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from '../../../common/Modal';
import PhoneNumberField from '../../../common/formFields/PhoneNumberField';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { validatePhoneNumbers } from '../../../validations/p11';
import isEmpty from '../../../validations/common/isEmpty';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { setLoading } from '../../../redux/actions/p11Actions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

class PhoneNumberForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			apiURL: '/api/p11-phones/',
			phones: [],
			phone: '',
			errors: {},
			is_primary: false,
			isEdit: false,
			recordId: 0
		};
		this.onChange = this.onChange.bind(this);
		this.isValid = this.isValid.bind(this);
		this.handleChangeChecked = this.handleChangeChecked.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.getData = this.getData.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount() {
		this.props
			.getAPI(this.state.apiURL)
			.then((res) => {
				this.setState({ phones: res.data.data.phones });
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while requesting phone data'
				});
			});
		//reference event method from parent
		this.props.onRef(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEmpty(this.props.recordId)) {
			if (this.props.recordId !== '' && this.props.recordId !== prevProps.recordId) {
				this.getData(this.props.recordId);
			}
		}
	}

	getData(id) {
		if (!isEmpty(id)) {
			this.props
				.getAPI(this.state.apiURL + id)
				.then((res) => {
					let primary = false;

					let { id, phone, is_primary } = res.data.data;
					if (is_primary == 1) {
						primary = true;
					}
					this.setState({
						id,
						phone,
						is_primary: primary,
						isEdit: true,
						recordId: id
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

	handleChangeChecked(e) {
		this.setState({ [e.target.name]: !this.state.is_primary }, () => this.isValid());
	}
	onChange(phone, name) {
		this.setState({ [name]: phone }, () => this.isValid());
	}
	isValid() {
		let { errors, isValid } = validatePhoneNumbers(this.state);
		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}
		return isValid;
	}
	handleSave() {
		if (this.isValid()) {
			this.props.setLoading(true);
			let primary = 0;
			if (this.state.is_primary) {
				primary = 1;
			}
			let recId = '';
			let data = Object.assign({ phone: this.state.phone, is_primary: primary });
			if (this.state.isEdit) {
				recId = this.state.recordId;
				data['_method'] = 'PUT';
			}

			this.props
				.postAPI(this.state.apiURL + recId, data)
				.then((res) => {
					this.props.setLoading(false);
					this.props.updateList();
					this.props.addFlashMessage({
						type: 'success',
						text: 'Your phone number has been saved'
					});
					this.props.updatePhoneCount();
					if (this.props.getProfileLastUpdate) {
						this.props.profileLastUpdate();
					}
					this.handleClose();
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'Error'
					});
					this.props.setLoading(false);
				});
		} else {
		}
	}
	handleClose() {
		this.setState(
			{
				apiURL: '/api/p11-phones/',
				phones: [],
				phone: '',
				errors: {},
				is_primary: false,
				isMounted: false,
				isEdit: false,
				recordId: 0
			},
			() => {
				this.props.onClose();
			}
		);
	}

	clearState() {
		this.setState({
			apiURL: '/api/p11-phones/',
			phones: [],
			phone: '',
			errors: {},
			is_primary: false,
			isMounted: false,
			isEdit: false,
			recordId: 0
		});
	}

	render() {
		let { isOpen, title, remove, handleRemove } = this.props;
		let { phone, is_primary, errors, id } = this.state;
		return (
			<Modal
				open={isOpen}
				title={title}
				handleClose={this.handleClose}
				maxWidth="sm"
				scroll="body"
				handleSave={this.handleSave}
				handleRemove={() => handleRemove(this.state)}
				remove={remove}
			>
				<FormGroup row>
					<Grid container>
						<Grid item xs={12}>
							<PhoneNumberField
								id="phone"
								name="phone"
								label="Phone Number *"
								placeholder="Please enter telephone number"
								fullWidth
								value={phone}
								onChange={this.onChange}
								margin="none"
								error={errors.phone}
								isRequired={false}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={
									<Checkbox
										checked={is_primary}
										onChange={this.handleChangeChecked}
										value="checked"
										color="primary"
										name="is_primary"
									/>
								}
								label="Primary"
								// className
							/>
						</Grid>
					</Grid>
				</FormGroup>
			</Modal>
		);
	}
}
PhoneNumberForm.defaultProps = {
	getProfileLastUpdate: false
};

PhoneNumberForm.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	setLoading: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage,
	setLoading,
	profileLastUpdate
};

export default connect('', mapDispatchToProps)(PhoneNumberForm);
