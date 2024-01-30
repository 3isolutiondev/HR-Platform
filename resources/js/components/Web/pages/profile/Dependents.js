import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { getDependents, getDependentsWithoutShow } from '../../redux/actions/profile/dependentsAction';
import { addFlashMessage } from '../../redux/actions/webActions';
import { deleteAPI } from '../../redux/actions/apiActions';
import DependentForm from '../p11/dependents/DependentForm';
import Alert from '../../common/Alert';

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
	iconEdit: {
		color: 'transparent'
	},
	iconAdd: {
		color: '#043C6E'
	},
	break: {
		marginBottom: '20px'
	}
});

class Dependents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: '',
			alertOpen: false,
			name: '',
			withShow: true
		};

		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.handleAllert = this.handleAllert.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}
	componentDidMount() {
		this.props.getDependents(this.props.profileID);
	}
	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getDependentsWithoutShow(this.props.profileID)
		);
	}

	handleAllert() {
		this.setState({ alertOpen: true });
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-dependents/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.dialogClose();
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
		const { dependents, dependents_counts, show } = this.props.dependent;
		const { openDialog, remove, dataId, alertOpen, name } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Dependents
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
									{dependents_counts == 0 || dependents_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										dependents.map((dependent) => {
											return (
												<Grid
													container
													spacing={8}
													key={dependent.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">{dependent.full_name}</Typography>
													</Grid>
													{editable ? (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogOpenEdit(
																		dependent.id,
																		dependent.full_name
																	)}
																className={classes.button}
																aria-label="Delete"
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</Grid>
													) :  null}

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Date of birth</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{moment(dependent.date_of_birth).format('DD MMMM YYYY')}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Relationship</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{dependent.relationship}
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
						<DependentForm
							isOpen={openDialog}
							recordId={dataId}
							title="Dependent"
							onClose={this.dialogClose}
							updateList={this.dialogClose}
							getP11={this.dialogClose}
							updateP11={this.dialogClose}
							remove={remove}
							handleRemove={() => this.handleAllert()}
							title={remove ? 'Edit Dependent' : 'Add Dependent'}
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
							text={'Are you sure to delete your dependent with name : ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				) : null}
			</div>
		);
	}
}
Dependents.propTypes = {
	getDependents: PropTypes.func.isRequired,
	getDependentsWithoutShow: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	dependent: state.dependent
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getDependents,
	getDependentsWithoutShow,
	addFlashMessage,
	deleteAPI
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Dependents));
