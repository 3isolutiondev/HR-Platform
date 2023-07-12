import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import AccessTime from '@material-ui/icons/AccessTime';
import PermanentCivilServantForm from '../../p11/permanentCivilServants/PermanentCivilServantForm';
import {
	borderColor,
	primaryColor,
	lightText,
	white,
	primaryColorRed,
	primaryColorBlue,
	primaryColorGreen
} from '../../../config/colors';
import {
	getPermanentCivilServants,
	getPermanentCivilServantsWithOutShow
} from '../../../redux/actions/profile/permanentCivilServantsActions';
import Alert from '../../../common/Alert';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import moment from 'moment';

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

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getPermanentCivilServants(this.props.profileID);
		}
	}

	dialogOpen() {
		this.setState({ openDialog: true }, () => this.child.clearState());
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
					this.props.profileLastUpdate();
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
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Are you or have you ever been a permanent civil servant in your government's employ?
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
							{permanent_civil_servants_counts == 0 || permanent_civil_servants_counts < 1 ? (
								<Typography variant="body1">Sorry, no records found</Typography>
							) : (
								permanent_civil_servants.map((experience) => {
									let from = moment(experience.from);
									let to = moment(experience.to);

									let years = to.diff(from, 'years');
									from.add(years, 'years');

									let months = to.diff(from, 'months');

									const monthText =
										months < 1 ? '' : months < 2 ? months + ' month' : months + ' months';
									const yearText =
										years == 1 && months > 0
											? years + ' year '
											: years >= 1 && months == 0
												? years + ' year'
												: years == 0 ? '' : years + ' years ';

									return (
										<div
											className={editable ? classes.record : classes.recordUneditable}
											key={'experience-government-' + experience.id}
										>
											{editable ? (
												<IconButton
													onClick={() =>
														this.dialogEdit(experience.id, experience.institution)}
													className={classes.button}
													aria-label="Edit"
												>
													<Edit fontSize="small" className={classes.iconEdit} />
												</IconButton>
											) : null}
											<Typography variant="subtitle1" className={classes.jobTitle}>
												{experience.institution}
												{experience.is_now === 1 && (
													<Chip
														icon={<AccessTime className={classes.star} />}
														label="Still in this Institution"
														color="primary"
														className={classes.stillInstitution}
													/>
												)}
											</Typography>
											<Typography variant="subtitle2" className={classes.time}>
												{moment(experience.from).format('MMMM YYYY') +
													' - ' +
													moment(experience.to).format('MMMM YYYY')}
												{' (' + yearText + monthText + ')'}
											</Typography>
										</div>
									);
								})
							)}
							{editable ? (
								<div>
									<PermanentCivilServantForm
										isOpen={openDialog}
										recordId={dataId}
										onClose={this.dialogClose}
										remove={remove}
										title={
											remove ? (
												'Edit Permanent Civil Servant History'
											) : (
												'Add Permanent Civil Servant History'
											)
										}
										updateList={this.dialogClose}
										handleRemove={() => this.handleAllert()}
										getP11={this.dialogClose}
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
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getPermanentCivilServants,
	getPermanentCivilServantsWithOutShow,
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
	permanentCivilServants: state.permanentCivilServants
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
	divider: {
		height: theme.spacing.unit * 2
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
	},
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	record: {
		// paddingBottom: theme.spacing.unit * 2,
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
		// paddingBottom: theme.spacing.unit * 2,
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
			color: white
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	jobTitle: {
		fontWeight: 700
	},
	stillInstitution: {
		marginLeft: theme.spacing.unit,
		fontWeight: '400 !important',
		color: primaryColor,
		background: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)'
	},
	star: {
		marginLeft: theme.spacing.unit
	},
	time: {
		fontStyle: 'italic',
		color: lightText
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PermanentCivilServants));
