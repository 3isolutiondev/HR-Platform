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
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import {
	getPeviouslySubmittedForUn,
	getPeviouslySubmittedForUnWithOutShow
} from '../../redux/actions/profile/previouslySubmittedAplicationUNActions';
import PreviouslySubmittedApplicationForUnForm from '../p11/previouslySubmittedApplicationForUN/PreviouslySubmittedApplicationForUnForm';
import Alert from '../../common/Alert';
import { deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import isEmpty from '../../validations/common/isEmpty';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addMarginBottom: {
		'margin-bottom': '.75em',
		'&:hover $iconEdit': {
			color: '#043C6E'
		}
	},
	addMarginTop: {
		'margin-top': '.75em'
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
	break: {
		marginBottom: '20px'
	}
});

class PreviouslySubmittedInUN extends Component {
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
		this.props.getPeviouslySubmittedForUn(this.props.profileID);
	}
	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getPeviouslySubmittedForUnWithOutShow(this.props.profileID)
		);
	}
	handleAllert() {
		this.setState({ alertOpen: true });
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-submitted-application-in-un/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false }, () => {
					this.dialogClose();
					// this.props.getPeviouslySubmittedForUn(this.props.profileID);
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
		let {
			previously_submitted_for_un,
			previously_submitted_for_un_counts,
			show
		} = this.props.submittedAplicationUn;
		let { classes, editable } = this.props;
		let { openDialog, remove, dataId, alertOpen, name } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										{/* Previously submitted an application for employment with U.N. */}
										Previously worked with 3iSolution
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
									{previously_submitted_for_un_counts == 0 ||
									previously_submitted_for_un_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										previously_submitted_for_un.map((application) => {
											return (
												<Grid
													container
													spacing={8}
													key={application.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">
															{!isEmpty(application.project) ? application.project : ''}
														</Typography>
													</Grid>
													{editable ? (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogEdit(
																		application.id,
																		application.project
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
														<Typography variant="subtitle2">Starting Date</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{moment(application.starting_date).format('DD MMMM YYYY')}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Ending Date</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{moment(application.ending_date).format('DD MMMM YYYY')}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Country</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{!isEmpty(application.country) ? !isEmpty(
																application.country.name
															) ? (
																application.country.name
															) : (
																''
															) : (
																''
															)}
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
						<PreviouslySubmittedApplicationForUnForm
							isOpen={openDialog}
							un_organizations={previously_submitted_for_un}
							recordId={dataId}
							title={remove ? 'Edit Time and Organization' : 'Add Time and Organization'}
							onClose={this.dialogClose}
							updateList={this.dialogClose}
							getP11={this.dialogClose}
							remove={remove}
							handleRemove={() => this.handleAllert()}
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
								'Are you sure to delete your previously submitted an application with organization: ' +
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

PreviouslySubmittedInUN.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getPeviouslySubmittedForUn: PropTypes.func.isRequired,
	getPeviouslySubmittedForUnWithOutShow: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	submittedAplicationUn: state.submittedAplicationUn
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getPeviouslySubmittedForUn,
	getPeviouslySubmittedForUnWithOutShow,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PreviouslySubmittedInUN));
