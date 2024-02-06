import React, { Component } from 'react';
import classname from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Loadable from 'react-loadable';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import PhoneIphone from '@material-ui/icons/PhoneIphone';
import { getAPI, postAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
// import LoadingSpinner from '../../../common/LoadingSpinner';
import Alert from '../../../common/Alert';
import { getPhoneNumber } from '../../../redux/actions/profile/phoneNumberActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { borderColor, primaryColor } from '../../../config/colors';
import PhoneNumberForm from '../../p11/phoneNumber/PhoneNumberForm';
// const PhoneNumberForm = Loadable({
// 	loader: () => import('../../p11/phoneNumber/PhoneNumberForm'),
// 	loading: LoadingSpinner,
// 	timeout: 20000, // 20 seconds
// 	delay: 500 // 0.5 seconds
// });

class PhoneNumber extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataId: '',
			openDialog: false,
			alertOpen: false,
			name: '',
			deleteId: 0,
			apiURL: '/api/p11-phones/',
			phones: [],
			phoneCount: 0,
			isPrimary: 0
		};

		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getPhoneNumber(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getPhoneNumber(this.props.profileID);
		}
	}

	deleteData() {
		this.props
			.deleteAPI(this.state.apiURL + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.dialogClose();
				// this.props.getPhoneNumber();
				this.setState({ deleteId: 0, alertOpen: false, name: '' }, () => {
					this.props.getPhoneNumber(this.props.profileID);
					this.props.profileLastUpdate();
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}
	dialogOpen() {
		this.setState({ openDialog: true }, () => this.child.clearState());
	}
	dialogClose() {
		this.setState({ openDialog: false, dataId: '' }, () => this.props.getPhoneNumber(this.props.profileID));
	}
	dialogUpdate(id) {
		this.setState({ dataId: id }, () => this.dialogOpen());
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}
	handleRemove(data) {
		if (data.is_primary) {
			this.props.addFlashMessage({
				type: 'error',
				text: `Primary number can't remove`
			});
		} else {
			if (this.props.phoneNumber.phone_counts > 1) {
				this.setState({
					deleteId: data.id,
					name: data.phone,
					alertOpen: true
				});
				// this.child.clearState();
			}
		}
	}

	render() {
		let { classes, editable } = this.props;
		let { phones, phone_counts, show } = this.props.phoneNumber;
		let { alertOpen, name, dataId, openDialog } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Mobile Phone Number
							</Typography>
							<div className={classes.divider} />
							{editable ? (
								<IconButton
									onClick={this.dialogOpen}
									className={classes.addButton}
									aria-label="Add"
									color="primary"
								>
									<Add fontSize="small" />
								</IconButton>
							) : null}
							{phone_counts == 0 || phone_counts < 1 ? (
								<Typography variant="body1">Sorry, no records found</Typography>
							) : (
								phones.map((phone) => {
									return (
										<div
											className={editable ? classes.record : classes.recordUneditable}
											key={'phone-' + phone.id}
										>
											<Typography
												variant="subtitle1"
												className={
													phone.is_primary == 1 ? (
														classname(classes.phone, classes.primary)
													) : (
														classes.phone
													)
												}
											>
												<PhoneIphone fontSize="small" className={classes.icon} /> {phone.phone}
												{phone.is_primary == 1 ? ' (primary) ' : ""}
												{editable ? (
													<Edit
														fontSize="small"
														color="primary"
														className={
															phone.is_primary == 1 ? (
																classname(classes.editPhone, classes.primary)
															) : (
																classes.editPhone
															)
														}
														onClick={() => this.dialogOpenEdit(phone.id, phone.phone)}
													/>
												) : null}
											</Typography>
										</div>
									);
								})
							)}
							{editable ? (
								<div>
									<PhoneNumberForm
										isOpen={openDialog}
										recordId={dataId}
										title={dataId ? 'Edit Phone Number' : 'Add Phone Number'}
										onClose={this.dialogClose}
										updateList={this.dialogClose}
										updatePhoneCount={this.dialogClose}
										remove={dataId ? true : false}
										handleRemove={this.handleRemove}
										onRef={(ref) => (this.child = ref)}
										getProfileLastUpdate={true}
									/>
									<Alert
										isOpen={alertOpen}
										onClose={() => {
											this.setState({ alertOpen: false });
										}}
										onAgree={() => {
											this.deleteData();
										}}
										title="Delete Warning"
										text={'Are you sure to delete your phone ' + name + ' ?'}
										closeText="Cancel"
										AgreeText="Yes"
									/>
								</div>
							) : null}
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

PhoneNumber.propTypes = {
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	getPhoneNumber: PropTypes.func.isRequired,
	profileLastUpdate: PropTypes.func.isRequired
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
	addFlashMessage,
	getPhoneNumber,
	profileLastUpdate
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	phoneNumber: state.phoneNumber
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	box: {
		marginBottom: theme.spacing.unit * 2
	},
	card: {
		position: 'relative'
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
	},
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	record: {
		// paddingBottom: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
		position: 'relative',
		'&:hover $editPhone': {
			display: 'inline-block'
		},
		// '&:hover $iconEdit': {
		// 	color: primaryColor
		// },
		'&:nth-last-child(2)': {
			marginBottom: 0,
			paddingBottom: 0
		}
	},
	recordUneditable: {
		// paddingBottom: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
		position: 'relative',
		'&:hover $editPhone': {
			display: 'inline-block'
		},
		// '&:hover $iconEdit': {
		// 	color: primaryColor
		// },
		'&:nth-last-child(1)': {
			marginBottom: 0,
			paddingBottom: 0
		}
	},
	button: {
		position: 'absolute',
		right: theme.spacing.unit * -1,
		top: theme.spacing.unit * -1,
		'&:hover': {
			backgroundColor: '#043C6E'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	phone: {
		color: 'inherit'
	},
	primary: {
		color: primaryColor
	},
	icon: {
		marginRight: theme.spacing.unit / 2,
		display: 'inline-block',
		verticalAlign: 'text-top'
	},
	editPhone: {
		verticalAlign: 'middle',
		marginLeft: theme.spacing.unit,
		display: 'none',
		cursor: 'pointer',
		color: 'inherit',
		'&:hover': {
			borderBottom: '1px solid',
			borderColor: 'inherit'
		}
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PhoneNumber));
