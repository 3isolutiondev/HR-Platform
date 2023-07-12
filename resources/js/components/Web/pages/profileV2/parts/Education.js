/** import React and Prop Types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import third party library */
import moment from 'moment';
import ReactCountryFlag from 'react-country-flag';

/** import Material UI styles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';

/** import React redux and it's actions */
import { connect } from 'react-redux';
import { getUniversity } from '../../../redux/actions/profile/educationUniversityActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';

/** import configuration value and validation helper */
import { lightText, borderColor, primaryColor } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

/** import other components needed for this component */
import UniversityForm from '../../p11/universities/UniversityForm';
import Alert from '../../../common/Alert';

/**
 * Education is a component to show Education (University) data in profile page.
 *
 * @name Education
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class Education extends Component {
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
		this.dialogClose = this.dialogClose.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getUniversity(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getUniversity(this.props.profileID);
		}
	}

  /**
   * dialogOpen is a function to open Education Form modal in create mode
   */
  dialogOpen() {
    this.setState({ openDialog: true });
	}

  /**
   * dialogOpenEdit is a function to open Education Form modal in editing mode
   */
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

  /**
   * dialogClose is a function to close Education Form Modal
   */
	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getUniversity(this.props.profileID)
		);
	}

  /**
   * checkBeforeRemove is a function to show delete confirmation before deleting education data
   */
	checkBeforeRemove() {
		if (this.props.educationUniversity.education_universities_counts > 1) {
			this.setState({ alertOpen: true });
		}
	}

  /**
   * handleRemove is a function to delete education data
   */
	handleRemove() {
		this.props
			.deleteAPI('/api/p11-education-universities/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.props.profileLastUpdate();
				this.setState({ deleteId: 0, alertOpen: false, name: '', dataId: '' }, () => {
					this.child.clearState();
					this.dialogClose();
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
		const { classes, editable, educationUniversity, p11Countries } = this.props;
		const { education_universities, education_universities_counts, show } = educationUniversity;
		const { openDialog, remove, dataId, alertOpen, name } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Education (University or Equivalent)
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
							{education_universities_counts == 0 || education_universities_counts < 1 ? (
								<Typography variant="body1">Sorry, no matching records found</Typography>
							) : (
								education_universities.map((education) => {
									let from = moment(education.attended_from);
									let to = moment(education.attended_to);

									if (education.untilNow === 1) {
										to = moment();
									}

									let years = to.diff(from, 'years');
									from.add(years, 'years');

									let months = to.diff(from, 'months');

									const monthText =
										months < 1
											? ''
											: months < 2 ? ' ' + months + ' month' : ' ' + months + ' months';
									const yearText = years <= 1 ? years + ' year' : years + ' years';

									return (
										<div className={classes.record} key={'education-' + education.id}>
											{editable ? (
												<IconButton
													onClick={() => this.dialogOpenEdit(education.id, education.name)}
													className={classes.button}
													aria-label="Edit"
												>
													<Edit fontSize="small" className={classes.iconEdit} />
												</IconButton>
											) : null}
											<Typography variant="subtitle1" className={classes.jobTitle}>
												{education.name + ' '}
												<Tooltip title={education.country.name}>
													<div className={classes.countryAvatar}>
                            {!isEmpty(education.country) ? !isEmpty(education.country.country_code) && (
                              <ReactCountryFlag
                                code={education.country.country_code}
                                svg
                                styleProps={flag}
                                className={classes.countryAvatar}
                              />
                            ) : null}
													</div>
												</Tooltip>
												{education.diploma_certificate ? (
													<Tooltip title="Download Certificate">
														<Fab
															size="small"
															variant="extended"
															color="primary"
															href={education.diploma_certificate.url}
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
												{education.degree_level.name + ', ' + education.degree}
											</Typography>
											<Typography variant="body2" className={classes.duration}>
												{education.place +
													', ' +
													moment(education.attended_from).format('MMMM YYYY') +
													' - '}
												{education.untilNow === 1 ? (
													'Present'
												) : (
													moment(education.attended_to).format('MMMM YYYY')
												)}
												{' (' + yearText + monthText + ')'}
											</Typography>
										</div>
									);
								})
							)}
							{editable ? (
								<div>
									<UniversityForm
										isOpen={openDialog}
										recordId={dataId}
										title={
											remove ? (
												'Edit Education (University or Equivalent)'
											) : (
												'Add Education (University or Equivalent)'
											)
										}
										countries={p11Countries}
										onClose={() => this.dialogClose()}
										updateList={() => this.dialogClose()}
										getP11={() => this.dialogClose()}
										handleRemove={() => this.checkBeforeRemove()}
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
										text={'Are you sure to delete your education in  ' + name + ' ?'}
										closeText="Cancel"
										AgreeText="Yes"
									/>
								</div>
							) : (
								<div />
							)}
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

Education.propTypes = {
  /**
   * deleteAPI is a prop to call redux action to delete data based on url parameter.
   */
	deleteAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired,
  /**
   * getUniversity is a prop to call redux action to get all education data related to it's profile.
   */
	getUniversity: PropTypes.func.isRequired,
  /**
   * p11Countries is a prop containing list of countries.
   */
  p11Countries: PropTypes.array.isRequired,
  /**
   * educationUniversity is a prop containing all education data related to it's profile.
   */
  educationUniversity: PropTypes.object.isRequired,
  /**
   * profileID is a prop containing profile id, if it's a number will show other people profile, otherwise it will show the logged in user profile.
   */
  profileID: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string // empty string
  ]),
  /**
   * profileLastUpdate is a prop to call redux action to update last update timestamp.
   */
  profileLastUpdate: PropTypes.func.isRequired,
  /**
   * classes is an prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	educationUniversity: state.educationUniversity,
	p11Countries: state.options.p11Countries
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getUniversity,
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Education));
