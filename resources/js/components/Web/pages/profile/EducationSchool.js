import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classname from 'classnames';
import CloudDownload from '@material-ui/icons/CloudDownload';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { getSchool } from '../../redux/actions/profile/educationSchoolActions';
import SchoolForm from '../p11/schools/SchoolForm';
import Alert from '../../common/Alert';
import { addFlashMessage } from '../../redux/actions/webActions';
import { deleteAPI } from '../../redux/actions/apiActions';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addMarginTop: {
		'margin-top': '.75em',
		'&:hover $iconEdit': {
			color: '#043C6E'
		}
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	addMarginBottom: {
		'margin-bottom': '.75em'
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#043C6E'
		},
		'&:hover $iconEdit': {
			color: 'white'
		},
		'&:hover $iconAdd': {
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
class EducationSchool extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: '',
			name: '',
			alertOpen: false
		};
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getSchool(this.props.profileID);
	}

	dialogOpen(e) {
		this.setState({ openDialog: true });
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, remove: false, dataId: '', name: '' }, () =>
			this.props.getSchool(this.props.profileID)
		);
	}
	checkBeforeRemove() {
		if (this.props.educationSchool.education_schools_counts > 1) {
			this.setState({ alertOpen: true });
		}
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-education-schools/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, name: '', dataId: '', openDialog: false }, () => {
					this.dialogClose();
					// this.props.getSchool(this.props.profileID);
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
		const { education_schools, education_schools_counts, show } = this.props.educationSchool;
		const { openDialog, remove, dataId, name, alertOpen } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Formal Trainings & Workshops
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
									{education_schools_counts == 0 || education_schools_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										education_schools.map((education) => {
											return (
												<Grid
													container
													spacing={8}
													key={education.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">{education.name}</Typography>
													</Grid>
													{editable ? (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogOpenEdit(education.id, education.name)}
																className={classes.button}
																aria-label="Delete"
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</Grid>
													) : null}
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Type</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">{education.type}</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Place</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{education.place + ', ' + education.country.name}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Attended From/To</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{moment(education.attended_from).format('DD MMMM YYYY') +
																' - ' +
																moment(education.attended_to).format('DD MMMM YYYY')}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">
															Ceritificates / Diplomas Obtained
														</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">{education.certificate}</Typography>
													</Grid>
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Certificate File</Typography>
													</Grid>
													<Grid container item xs={12} sm={9}>
														{education.school_certificate ? (
															<Typography variant="body2">
																<Button
																	size="small"
																	variant="contained"
																	color="primary"
																	href={education.school_certificate.url}
																>
																	<CloudDownload className={classes.addSmallMarginRight} />{' '}
																	Download
																</Button>{' '}
																{education.school_certificate.file_name}
															</Typography>
														) : null}
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
				{editable && (
					<div>
						<SchoolForm
							isOpen={openDialog}
							recordId={dataId}
							title={remove ? 'Edit Formal Training / Workshop' : 'Add Formal Training / Workshop'}
							countries={this.props.countries}
							onClose={() => this.dialogClose()}
							updateList={() => this.dialogClose()}
							getP11={() => this.dialogClose()}
							handleRemove={() => this.checkBeforeRemove()}
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
							text={'Are you sure to delete your training / workshop in  ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				)}
			</div>
		);
	}
}

EducationSchool.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getSchool: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	educationSchool: state.educationSchool
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getSchool,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EducationSchool));
