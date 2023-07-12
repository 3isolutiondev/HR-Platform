import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import PermanentCivilServantForm from '../p11/permanentCivilServants/PermanentCivilServantForm';
import {
	getPermanentCivilServants,
	getPermanentCivilServantsWithOutShow
} from '../../redux/actions/profile/permanentCivilServantsActions';
import Alert from '../../common/Alert';
import { addFlashMessage } from '../../redux/actions/webActions';
import { deleteAPI } from '../../redux/actions/apiActions';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addMarginBottom: {
		'margin-bottom': '.75em',
		'&:hover $iconEdit': {
			color: '#be2126'
		}
	},
	addMarginTop: {
		'margin-top': '.75em'
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#be2126'
		},
		'&:hover $iconAdd': {
			color: 'white'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#be2126'
	},
	iconEdit: {
		color: 'transparent'
	},
	break: {
		marginBottom: '20px'
	}
});

class PermanentCivilServants extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: '',
			alertOpen: false,
			name: ''
		};
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogEdit = this.dialogEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.handleAllert = this.handleAllert.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getPermanentCivilServants(this.props.profileID);
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', remove: false }, () =>
			this.props.getPermanentCivilServantsWithOutShow(this.props.profileID)
		);
	}
	handleAllert() {
		this.setState({ alertOpen: true });
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-permanent-civil-servants/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.dialogClose();
					// this.props.getPermanentCivilServants(this.props.profileID);
					// this.child.clearState();
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	render() {
		const { classes, editable } = this.props;
		const { permanent_civil_servants, permanent_civil_servants_counts, show } = this.props.permanentCivilServants;
		const { openDialog, remove, alertOpen, name, dataId } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Are you now, or have to ever been, a permanent civil servant in your
										government's employ?
									</Typography>
								</Grid>
								{editable ? (
									<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
										<IconButton
											onClick={this.dialogOpen}
											className={classes.button}
											aria-label="Delete"
										>
											<Add fontSize="small" className={classes.iconAdd} />
										</IconButton>
									</Grid>
								) : null}
								<Grid item xs={12}>
									{permanent_civil_servants_counts == 0 || permanent_civil_servants_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										permanent_civil_servants.map((permanentCivilServant) => {
											return (
												<Grid
													container
													spacing={8}
													key={permanentCivilServant.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">
															{permanentCivilServant.institution}
														</Typography>
													</Grid>
													{editable ? (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogEdit(
																		permanentCivilServant.id,
																		permanentCivilServant.institution
																	)}
																className={classes.button}
																aria-label="Delete"
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</Grid>
													) : null}

													{/* <Grid container item xs={12}> */}
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Time</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{moment(permanentCivilServant.from).format('DD MMMM YYYY') +
																' - ' +
																moment(permanentCivilServant.to).format('DD MMMM YYYY')}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">
															Still in this institution
														</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{permanentCivilServant.is_now === 1 ? 'Yes' : 'No'}
														</Typography>
													</Grid>
												</Grid>
											);
										})
									)}
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				) : null}
				{editable ? (
					<div>
						<PermanentCivilServantForm
							isOpen={openDialog}
							recordId={dataId}
							onClose={this.dialogClose}
							remove={remove}
							title={
								remove ? 'Edit Permanent Civil Servant History' : 'Add Permanent Civil Servant History'
							}
							updateList={this.dialogClose}
							handleRemove={() => this.handleAllert()}
							getP11={this.dialogClose}
							onRef={(ref) => (this.child = ref)}
						/>
						<Alert
							isOpen={alertOpen}
							onClose={() => {
								this.setState({ alertOpen: false });
							}}
							onAgree={() => {
								this.handleRemove();
							}}
							title="Delete Warning"
							text={
								'Are you sure to delete your permanent civil servant record with institution: ' +
								name +
								' ?'
							}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				) : null}
			</div>
		);
	}
}

PermanentCivilServants.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getPermanentCivilServants: PropTypes.func.isRequired,
	getPermanentCivilServantsWithOutShow: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	permanentCivilServants: state.permanentCivilServants
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getPermanentCivilServants,
	getPermanentCivilServantsWithOutShow,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PermanentCivilServants));
