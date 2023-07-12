import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import moment from 'moment';
import ReactCountryFlag from 'react-country-flag';
import IconButton from '@material-ui/core/IconButton';
import ProfessionalSocietyForm from '../p11/professionalSocieties/ProfessionalSocietyForm';
import {
	getProfesionalSocieties,
	getProfesionalSocietiesWithOutShow
} from '../../redux/actions/profile/profesionalSocietiesActions';
import Alert from '../../common/Alert';
import { deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';

const flag = {
	width: '32px',
	height: '32px',
	backgroundSize: '44px 44px'
};

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addMarginTop: {
		'margin-top': '.75em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	addMarginBottom: {
		'margin-bottom': '.75em',
		'&:hover $iconEdit': {
			color: '#be2126'
		}
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50%'
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

class ProfessionalSocieties extends Component {
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
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.handleAllert = this.handleAllert.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getProfesionalSocieties(this.props.profileID);
	}
	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getProfesionalSocietiesWithOutShow(this.props.profileID)
		);
	}
	handleAllert() {
		this.setState({ alertOpen: true });
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-professional-societies/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.dialogClose();
					// this.props.getProfesionalSocieties(this.props.profileID);
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
		const { professional_societies, professional_societies_counts, show } = this.props.profesionalSocieties;
		const { openDialog, remove, dataId, alertOpen, name } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Professional Societies
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
									{professional_societies_counts == 0 || professional_societies_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										professional_societies.map((professionalSociety) => {
											const FlagContainer = (props) => (
												<div className={classes.countryAvatar}>{props.children}</div>
											);
											return (
												<Grid
													container
													spacing={8}
													key={professionalSociety.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">{professionalSociety.name}</Typography>
													</Grid>
													{editable ? (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogOpenEdit(
																		professionalSociety.id,
																		professionalSociety.name
																	)}
																className={classes.button}
																aria-label="Delete"
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</Grid>
													) : null}

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Description</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{professionalSociety.description}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Country</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{professionalSociety.country.name}
														</Typography>
														<Chip
															key={professionalSociety.country.id}
															avatar={
																<FlagContainer>
																	<ReactCountryFlag
																		code={professionalSociety.country.country_code}
																		svg
																		styleProps={flag}
																	/>
																</FlagContainer>
															}
															label={professionalSociety.country.name}
															// onDelete={handleDelete}
															color="primary"
															className={classname(
																classes.addSmallMarginRight,
																classes.capitalize
															)}
														/>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">From/To</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{moment(professionalSociety.attended_from).format(
																'DD MMMM YYYY'
															) +
																' - ' +
																moment(professionalSociety.attended_to).format(
																	'DD MMMM YYYY'
																)}
														</Typography>
													</Grid>

													{(professionalSociety.sectors &&
													professionalSociety.sectors.length > 0) ? (
														<Grid item xs={12} sm={3}>
															<Typography variant="subtitle2">Sector</Typography>
														</Grid>
													) : null}
													{professionalSociety.sectors ? (
														<Grid item xs={12} sm={9}>
															{professionalSociety.sectors.map((sector) => {
																return (
																	<Chip
																		key={sector.id}
																		label={sector.name}
																		color="primary"
																		className={classname(
																			classes.addSmallMarginRight,
																			classes.capitalize
																		)}
																	/>
																);
															})}
														</Grid>
													) : null}
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
						<ProfessionalSocietyForm
							isOpen={openDialog}
							recordId={dataId}
							countries={this.props.countries}
							onClose={this.dialogClose}
							updateList={this.dialogClose}
							getP11={this.dialogClose}
							title={
								remove ? (
									'Edit Professional Societies and Activities in Civic, Public or International Affairs'
								) : (
									'Add Professional Societies and Activities in Civic, Public or International Affairs'
								)
							}
							handleRemove={() => this.handleAllert()}
							remove={remove}
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
							text={'Are you sure to delete your international affair in  ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				) : null}
			</div>
		);
	}
}

ProfessionalSocieties.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getProfesionalSocieties: PropTypes.func.isRequired,
	getProfesionalSocietiesWithOutShow: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	profesionalSocieties: state.profesionalSocieties,
	countries: state.options.countries
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getProfesionalSocieties,
	getProfesionalSocietiesWithOutShow,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProfessionalSocieties));
