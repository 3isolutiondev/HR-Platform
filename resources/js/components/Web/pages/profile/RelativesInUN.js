import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';
import ReactCountryFlag from 'react-country-flag';
import IconButton from '@material-ui/core/IconButton';
import { getRelativeEmployed, getRelativeEmployedWithOutShow } from '../../redux/actions/profile/relativeInUnActions';
import RelativesEmployedByPublicInternationalOrgForm from '../p11/relativesEmployedByPublicInternationalOrg/RelativesEmployedByPublicInternationalOrgForm';
import Alert from '../../common/Alert';
import { addFlashMessage } from '../../redux/actions/webActions';
import { deleteAPI } from '../../redux/actions/apiActions';

// const flag = {
// 	width: '32px',
// 	height: '32px',
// 	backgroundSize: '44px 44px'
// };

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
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50%'
	},
	capitalize: {
		textTransform: 'capitalize'
	}
});

class RelativesInUN extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: 0,
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
		this.props.getRelativeEmployed(this.props.profileID);
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}

	dialogEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getRelativeEmployedWithOutShow(this.props.profileID)
		);
	}
	handleAllert() {
		this.setState({ alertOpen: true });
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-relatives-employed/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.dialogClose();
					// this.props.getRelativeEmployed(this.props.profileID);
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
		let { classes, editable } = this.props;
		let { relatives_employed, relatives_employed_counts, show } = this.props.relativeEmployed;
		let { openDialog, dataId, remove, alertOpen, name } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Your relatives employed by a 3iSolution
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
									{relatives_employed_counts == 0 || relatives_employed_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										relatives_employed.map((relative) => {
											const FlagContainer = (props) => (
												<div className={classes.countryAvatar}>{props.children}</div>
											);
											return (
												<Grid
													container
													spacing={8}
													key={relative.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">{relative.full_name}</Typography>
													</Grid>
													{editable && (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogEdit(relative.id, relative.full_name)}
																className={classes.button}
																aria-label="Delete"
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</Grid>
													)}

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Job Title</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography className={classes.capitalize} variant="body2">
															{relative.job_title}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Country</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Chip
															key={relative.country.id}
															avatar={
																<FlagContainer>
																	<ReactCountryFlag
																		code={relative.country.country_code}
																		svg
																		styleProps={{
																			width: '32px',
																			height: '32px',
																			backgroundSize: '44px 44px'
																		}}
																	/>
																</FlagContainer>
															}
															label={relative.country.name}
															// onDelete={handleDelete}
															color="primary"
															className={classname(
																classes.addSmallMarginRight,
																classes.capitalize
															)}
														/>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Relationship</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography className={classes.capitalize} variant="body2">
															{relative.relationship}
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
						<RelativesEmployedByPublicInternationalOrgForm
							isOpen={openDialog}
							recordId={dataId}
							title={remove ? 'Edit Relative' : 'Add Relative'}
							onClose={this.dialogClose}
							updateList={this.dialogClose}
							getP11={this.dialogClose}
							remove={remove}
							handleRemove={() => this.handleAllert()}
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
							text={'Are you sure to delete your relative with name: ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				) : null}
			</div>
		);
	}
}

RelativesInUN.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getRelativeEmployed: PropTypes.func.isRequired,
	getRelativeEmployedWithOutShow: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	countries: state.options.countries,
	relativeEmployed: state.relativeEmployed
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getRelativeEmployed,
	getRelativeEmployedWithOutShow,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RelativesInUN));
