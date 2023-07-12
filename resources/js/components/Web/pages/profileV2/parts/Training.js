import React, { Component } from 'react';
import classname from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import CloudDownload from '@material-ui/icons/CloudDownload';
import ReactCountryFlag from 'react-country-flag';
import { primaryColor, borderColor, lightText } from '../../../config/colors';
import { getSchool } from '../../../redux/actions/profile/educationSchoolActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import SchoolForm from '../../p11/schools/SchoolForm';
import Alert from '../../../common/Alert';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';

class Training extends Component {
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

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getSchool(this.props.profileID);
		}
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
					this.props.profileLastUpdate();
					this.child.clearState();
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
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Formal Trainings & Workshops
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
							{education_schools_counts == 0 || education_schools_counts < 1 ? (
								<Typography variant="body1">Sorry, no records found</Typography>
							) : (
								education_schools.map((training) => {
									let from = moment(training.attended_from);
									let to = moment(training.attended_to);

									let years = to.diff(from, 'years');
									from.add(years, 'years');

									let months = to.diff(from, 'months');

									const monthText =
										months < 1
											? ''
											: months < 2 ? ' ' + months + ' month' : ' ' + months + ' months';
									const yearText = years <= 1 ? years + ' year' : years + ' years';

									return (
										<div
											className={editable ? classes.record : classes.recordUneditable}
											key={'training-' + training.id}
										>
											{editable ? (
												<IconButton
													onClick={() => this.dialogOpenEdit(training.id, training.name)}
													className={classes.button}
													aria-label="Edit"
												>
													<Edit fontSize="small" className={classes.iconEdit} />
												</IconButton>
											) : null}
											<Typography variant="subtitle1" className={classes.jobTitle}>
												{training.name + ' '}
												<Tooltip title={training.country.name}>
													<div className={classes.countryAvatar}>
														<ReactCountryFlag
															code={training.country.country_code}
															svg
															styleProps={flag}
															className={classes.countryAvatar}
														/>
													</div>
												</Tooltip>
												{training.school_certificate ? (
													<Tooltip title="Download Certificate">
														<Fab
															size="small"
															variant="extended"
															color="primary"
															href={training.school_certificate.url}
															target="_blank"
															className={classes.download}
														>
															<CloudDownload className={classes.downloadIcon} />
															Certificate
														</Fab>
													</Tooltip>
												) : null}
											</Typography>
											<Typography variant="subtitle2" className={classes.employer}>
												{training.certificate}
											</Typography>
											<Typography variant="body2" className={classes.duration}>
												{training.place +
													', ' +
													moment(training.attended_from).format('MMMM YYYY') +
													' - ' +
													moment(training.attended_to).format('MMMM YYYY')}
												{' (' + yearText + monthText + ')'}
											</Typography>
										</div>
									);
								})
							)}
							{editable ? (
								<div>
									<SchoolForm
										isOpen={openDialog}
										recordId={dataId}
										title={
											remove ? (
												'Edit Formal Training / Workshop'
											) : (
												'Add Formal Training / Workshop'
											)
										}
										countries={this.props.p11Countries}
										onClose={() => this.dialogClose()}
										updateList={() => this.dialogClose()}
										getP11={() => this.dialogClose()}
										handleRemove={() => this.handleRemove()}
										remove={remove}
										onRef={(ref) => (this.child = ref)}
										getProfileLastUpdate={true}
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
							) : null}
						</CardContent>
					</Card>
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
	educationSchool: state.educationSchool,
	p11Countries: state.options.p11Countries
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getSchool,
	deleteAPI,
	addFlashMessage,
	profileLastUpdate
};

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
	duration: {
		color: lightText,
		fontStyle: 'italic'
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50% !important',
		border: '1px solid ' + lightText,
		verticalAlign: 'middle',
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		display: 'inline-block'
	},
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	jobTitle: {
		fontWeight: 700
	},
	record: {
		paddingBottom: theme.spacing.unit * 2,
		// borderBottom: '1px solid ' + borderColor,
		marginBottom: theme.spacing.unit * 2,
		position: 'relative',
		'&:hover $iconEdit': {
			color: primaryColor
		},
		'&:nth-last-child(2)': {
			marginBottom: 0,
			paddingBottom: 0
		}
	},
	recordUneditable: {
		paddingBottom: theme.spacing.unit * 2,
		// borderBottom: '1px solid ' + borderColor,
		marginBottom: theme.spacing.unit * 2,
		position: 'relative',
		'&:hover $iconEdit': {
			color: primaryColor
		},
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
			backgroundColor: primaryColor
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	employer: {
		marginTop: theme.spacing.unit / 2,
		color: primaryColor
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	capitalize: {
		'text-transform': 'capitalize'
	},
	label: {
		maxWidth: 300,
		'& > span': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inline !important'
		}
	},
	more: {
		cursor: 'pointer',
		marginTop: theme.spacing.unit * 2,
		color: primaryColor,
		'&:hover': {
			textDecoration: 'underline'
		}
	},
	addMediumMarginTop: {
		marginTop: theme.spacing.unit * 2 - theme.spacing.unit / 2
	},
	italic: {
		fontStyle: 'italic'
	},
	lightText: {
		color: lightText
	},
	download: {
		width: theme.spacing.unit * 4 + 2,
		height: theme.spacing.unit * 4 + 2,
		minHeight: theme.spacing.unit * 4 + 2,
		border: '1px solid ' + primaryColor
	},
	downloadIcon: {
		fontSize: theme.spacing.unit * 3 - 2,
		marginRight: theme.spacing.unit
	}
});

const flag = {
	width: '32px',
	height: '32px',
	backgroundSize: '44px 44px'
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Training));
