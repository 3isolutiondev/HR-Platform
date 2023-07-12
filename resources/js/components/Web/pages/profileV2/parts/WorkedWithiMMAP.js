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
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';

/** import configuration value and validation helper */
import { primaryColor, lightText, borderColor } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import {
	getPeviouslySubmittedForUn,
	getPeviouslySubmittedForUnWithOutShow
} from '../../../redux/actions/profile/previouslySubmittedAplicationUNActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

/** import other components needed for this component */
import PreviouslySubmittedApplicationForUnForm from '../../p11/previouslySubmittedApplicationForUN/PreviouslySubmittedApplicationForUnForm';
import Alert from '../../../common/Alert';

/**
 * WorkedWithiMMAP is a component to show previously worked with iMMAP data in profile page.
 *
 * @name WorkedWithiMMAP
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class WorkedWithiMMAP extends Component {
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
		this.handleAlert = this.handleAlert.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getPeviouslySubmittedForUn(this.props.profileID);
	}
	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getPeviouslySubmittedForUn(this.props.profileID);
		}
	}
  /**
   * dialogOpen is a function to open previously worked with iMMAP Form Modal in create mode
   */
	dialogOpen() {
		this.setState({ openDialog: true });
	}

  /**
   * dialogEdit is a function to open previously worked with iMMAP Form Modal in edit mode
   */
	dialogEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

  /**
   * dialogClose is a function to close previously worked with iMMAP Form Modal
   */
	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getPeviouslySubmittedForUnWithOutShow(this.props.profileID)
		);
	}

  /**
   * handleAlert is a function to show delete confirmation before deleting previously worked with iMMAP data
   */
	handleAlert() {
		this.setState({ alertOpen: true });
	}

  /**
   * handleRemove is a function to delete previously worked with iMMAP data
   */
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
					this.props.profileLastUpdate();
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
		const {
			previously_submitted_for_un,
			previously_submitted_for_un_counts,
			show
		} = this.props.submittedAplicationUn;
		const { classes, editable } = this.props;
		const { openDialog, remove, dataId, alertOpen, name } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Previously Worked with iMMAP
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
							{previously_submitted_for_un_counts == 0 || previously_submitted_for_un_counts < 1 ? (
								<Typography variant="body1">Sorry, no records found</Typography>
							) : (
								previously_submitted_for_un.map((workWithiMMAP) => {
									let from = moment(workWithiMMAP.starting_date);
									let to = moment(workWithiMMAP.ending_date);

									let years = to.diff(from, 'years');
									from.add(years, 'years');

									let months = to.diff(from, 'months');

									const monthText =
										months < 1 ? '' : months < 2 ? months + ' month' : months + ' months';
									const yearText =
										years == 1 ? years + ' year ' : years == 0 ? '' : years + ' years ';
									return (
										<div
											className={editable ? classes.record : classes.recordUneditable}
											key={'workWithiMMAP-' + workWithiMMAP.id}
										>
											{editable ? (
												<IconButton
													onClick={() =>
														this.dialogEdit(workWithiMMAP.id, workWithiMMAP.project)}
													className={classes.button}
													aria-label="Edit"
												>
													<Edit fontSize="small" className={classes.iconEdit} />
												</IconButton>
											) : null}
											<Typography variant="subtitle1" className={classes.jobTitle}>
												{!isEmpty(workWithiMMAP.position) ? (
													workWithiMMAP.position
												) : (
													workWithiMMAP.project
												)}{' '}
												<Tooltip title={workWithiMMAP.country.name}>
													<div className={classes.countryAvatar}>
                            {!isEmpty(workWithiMMAP.country) ? !isEmpty(workWithiMMAP.country.country_code) && (
                              <ReactCountryFlag
                                code={workWithiMMAP.country.country_code}
                                svg
                                styleProps={flag}
                                className={classes.countryAvatar}
                              />
                            ) : null}
													</div>
												</Tooltip>
											</Typography>
											{(!isEmpty(workWithiMMAP.position) && !isEmpty(workWithiMMAP.project)) ? (
												<Typography variant="subtitle2" className={classes.employer}>
													{workWithiMMAP.project}
												</Typography>
											) : null}
											{!isEmpty(workWithiMMAP.immap_office) ? (
												<Typography className={classes.employer} variant="subtitle2">
													{(!isEmpty(workWithiMMAP.position) && !isEmpty(workWithiMMAP.project)) ? ', ' : ""}
													{workWithiMMAP.immap_office.city + ' - ' + workWithiMMAP.immap_office.country.name}
												</Typography>
											) : null}
											<Typography variant="body2" className={classes.duration}>
												{moment(workWithiMMAP.starting_date).format('MMMM YYYY') +
													' - ' +
													moment(workWithiMMAP.ending_date).format('MMMM YYYY')}
												{' (' + yearText + monthText + ')'}
											</Typography>
										</div>
									);
								})
							)}
							{editable ? (
								<div>
									<PreviouslySubmittedApplicationForUnForm
										isOpen={openDialog}
										un_organizations={previously_submitted_for_un}
										recordId={dataId}
										title={remove ? 'Edit Experience' : 'Add Experience'}
										onClose={this.dialogClose}
										updateList={this.dialogClose}
										getP11={this.dialogClose}
										remove={remove}
										handleRemove={() => this.handleAlert()}
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
										text={'Are you sure to delete your previous experience working with iMMAP ?'}
										closeText="Cancel"
										AgreeText="Yes"
									/>
								</div>
							) : null }
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

WorkedWithiMMAP.propTypes = {
  /**
   * getPeviouslySubmittedForUn is a prop to call redux action to get all previously worked with iMMAP data related to it's profile.
   * This function will detect if the profile has previously worked with iMMAP or not, if not this component will be hide in Profile page.
   */
  getPeviouslySubmittedForUn: PropTypes.func.isRequired,
  /**
   * getPeviouslySubmittedForUnWithOutShow is a prop to call redux action to get all previously worked with iMMAP data related to it's profile.
   */
  getPeviouslySubmittedForUnWithOutShow: PropTypes.func.isRequired,
  /**
   * deleteAPI is a prop to call redux action to delete data based on url parameter.
   */
	deleteAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
	addFlashMessage: PropTypes.func.isRequired,
  /**
   * profileLastUpdate is a prop to call redux action to update last update timestamp.
   */
	profileLastUpdate: PropTypes.func.isRequired,
  /**
   * submittedAplicationUn is a prop containing all previously worked with iMMAP data related to it's profile.
   */
  submittedAplicationUn: PropTypes.object.isRequired,
  /**
   * p11Countries is a prop containing list of countries.
   */
  p11Countries: PropTypes.array.isRequired,
  /**
   * profileID is a prop containing profile id, if it's a number will show other people profile, otherwise it will show the logged in user profile.
   */
  profileID: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string // empty string
  ]),
  /**
   * classes is an prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getPeviouslySubmittedForUn,
	getPeviouslySubmittedForUnWithOutShow,
	deleteAPI,
	addFlashMessage,
	profileLastUpdate
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	submittedAplicationUn: state.submittedAplicationUn,
	p11Countries: state.options.p11Countries
});

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
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
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
	recordUneditable: {
		paddingBottom: theme.spacing.unit * 2,
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
			backgroundColor: '#be2126'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	jobTitle: {
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
		display: 'inline-block'
	},
	employer: {
		color: primaryColor,
		display: 'inline-block'
	}
});

const flag = {
	width: '32px',
	height: '32px',
	backgroundSize: '44px 44px'
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(WorkedWithiMMAP));
