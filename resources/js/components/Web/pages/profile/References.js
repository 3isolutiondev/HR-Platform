import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getReferences } from '../../redux/actions/profile/referencesActions';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ReferenceForm from '../p11/references/ReferenceForm';
import { addFlashMessage } from '../../redux/actions/webActions';
import { deleteAPI } from '../../redux/actions/apiActions';
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

class References extends Component {
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
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
	}

	componentDidMount() {
		this.props.getReferences(this.props.profileID);
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', remove: false }, () =>
			this.props.getReferences(this.props.profileID)
		);
	}
	checkBeforeRemove() {
		if (this.props.references.references_counts > 1) {
			this.setState({ alertOpen: true });
		}
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-references/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false }, () => {
					this.dialogClose();
					// this.props.getReferences(this.props.profileID);
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
		const { openDialog, remove, dataId, name, alertOpen } = this.state;
		const { references, references_counts, show } = this.props.references;
		const { classes, countries, editable } = this.props;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Reference Lists
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
									{references_counts == 0 || references_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										references.map((reference) => {
											return (
												<Grid
													container
													spacing={8}
													key={reference.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">{reference.full_name}</Typography>
													</Grid>
													{editable && (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogEdit(reference.id, reference.full_name)}
																className={classes.button}
																aria-label="Delete"
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</Grid>
													)}

													{/* <Grid container item xs={12}> */}
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Organization</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{reference.organization}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Job Title</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{reference.job_position}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Email</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">{reference.email}</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Country</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{reference.country.name}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Phone</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">{reference.phone}</Typography>
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
						<ReferenceForm
							isOpen={openDialog}
							recordId={dataId}
							onClose={this.dialogClose}
							remove={remove}
							title={remove ? 'Edit Reference' : 'Add Reference'}
							handleRemove={() => this.checkBeforeRemove()}
							countries={countries}
							updateList={this.dialogClose}
							getP11={this.dialogClose}
							resetData={openDialog}
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
							text={'Are you sure to delete your reference with name ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				) : null}
			</div>
		);
	}
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	references: state.references,
	countries: state.options.countries
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getReferences,
	addFlashMessage,
	deleteAPI
};

References.propTypes = {
	getReferences: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(References));
