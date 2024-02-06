import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import { getAPI, postAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import LoadingSpinner from '../../common/LoadingSpinner';
import Alert from '../../common/Alert';
import { getPhoneNumber } from '../../redux/actions/profile/phoneNumberActions';

const PhoneNumberForm = Loadable({
	loader: () => import('../p11/phoneNumber/PhoneNumberForm'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	container: {
		'&:hover $iconEdit': {
			color: '#043C6E'
		}
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#043C6E'
		},
		'&:hover $iconAdd': {
			color: 'white'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#043C6E'
	},
	iconEdit: {
		color: 'transparent'
	},
	displayInline: {
		display: 'inline-block'
	},
	break: {
		marginBottom: '20px'
	}
});

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
		this.dialogClose = this.dialogClose.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}
	componentDidMount() {
		this.props.getPhoneNumber(this.props.profileID);
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
		this.setState({ openDialog: true });
	}
	dialogClose() {
		this.setState({ openDialog: false, dataId: '' }, () => this.props.getPhoneNumber(this.props.profileID));
	}
	dialogUpdate(id) {
		this.setState({ dataId: id }, () => this.dialogOpen());
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
		let { phones, show } = this.props.phoneNumber;
		let { alertOpen, name, dataId, openDialog } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container spacing={24}>
								<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Mobile Phone Number
									</Typography>
								</Grid>
								{editable ? (
									<Grid item xs={2} sm={4} md={3} lg={1} xl={1}>
										<IconButton
											onClick={this.dialogOpen}
											className={classes.button}
											aria-label="Delete"
										>
											<Add fontSize="small" className={classes.iconAdd} />
										</IconButton>
									</Grid>
								) : null}
								{phones.map((phone, index) => {
									let IsPrimary = '';
									if (phone.is_primary === 1) {
										IsPrimary = 'Primary';
									}
									return (
										<Grid className={classes.container} key={index} item xs={12}>
											<Grid container spacing={24}>
												<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
													<Typography variant="subtitle2">Phone : </Typography>
													<Grid container spacing={24}>
														<Grid item xs={8}>
															<Typography
																variant="body2"
																className={classes.displayInline}
															>
																{phone.phone}
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<Typography
																variant="body2"
																className={classes.displayInline}
															>
																{IsPrimary}
															</Typography>
														</Grid>
													</Grid>
												</Grid>
												{editable ? (
													<Grid item lg={2} sm={4} md={3} lg={1} xl={1}>
														<IconButton
															onClick={() => this.dialogUpdate(phone.id)}
															className={classes.button}
															aria-label="Delete"
														>
															<Edit fontSize="small" className={classes.iconEdit} />
														</IconButton>
													</Grid>
												) : null}
											</Grid>
										</Grid>
									);
								})}
							</Grid>
						</CardContent>
					</Card>
				) : null}
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
					text={'Are you sure to delete your portfolio with phone ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

PhoneNumber.propTypes = {
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	getPhoneNumber: PropTypes.func.isRequired
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
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	deleteAPI,
	addFlashMessage,
	getPhoneNumber
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PhoneNumber));
