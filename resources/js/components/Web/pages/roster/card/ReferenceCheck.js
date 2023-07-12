import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
// import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Send from '@material-ui/icons/Send';
import SelectField from '../../../common/formFields/SelectField';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getReferenceCheck } from '../../../redux/actions/optionActions';
import { openReferenceCheck } from '../../../redux/actions/roster/rosterActions';
import { getPDF, getWORD } from '../../../redux/actions/common/PDFViewerActions';
import {
	red,
	redHover,
	blue,
	blueIMMAP,
	blueIMMAPHover,
	purple,
	purpleHover,
	white,
	secondaryColor,
	recommendationColor,
	recommendationHoverColor,
	primaryColor,
	primaryColorHover,
	green,
	greenHover,
	lightGrey
} from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';
import { pluck } from '../../../utils/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons/faAward';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import Success from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import Retry from '@material-ui/icons/Replay';
import { Dialog, DialogActions, DialogContent, DialogTitle, Fab, Tooltip, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import CircleBtn from '../../../common/CircleBtn';
import PDFViewer from '../../../common/pdf-viewer/PDFViewer';
import { faCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { can } from '../../../permissions/can';
import PastReferenceCheck from '../../jobs/applicants/PastReferenceCheck';

class ReferenceCheck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reference_check: '',
			alreadySent: false,
			isLoading: false,
			p11ReferenceId: null,
			showReferenceHistroy: false,
		};

		this.selectOnChange = this.selectOnChange.bind(this);
		this.referenceCheckInvitation = this.referenceCheckInvitation.bind(this);
		this.toogleReferenceHistory = this.toogleReferenceHistory.bind(this);
	}

	componentDidMount() {
		this.props.getReferenceCheck();

		if (!isEmpty(this.props.reference_checks)) {
			let { profile } = this.props;
			let { roster_processes } = profile;
			let roster_process = roster_processes[0];

			if (!isEmpty(roster_process.pivot.reference_check_id)) {
				let label = pluck(this.props.reference_checks, 'value');
				label = label.indexOf(roster_process.pivot.reference_check_id);

				this.setState({
					reference_check: {
						value: roster_process.pivot.reference_check_id,
						label: this.props.reference_checks[label]['label']
					},
					alreadySent: true
				});
			}
		}
	}

	componentDidUpdate(prevProps) {
		const currentReferenceChecks = JSON.stringify(this.props.reference_checks);
		const prevReferenceChecks = JSON.stringify(prevProps.reference_checks);

		if (currentReferenceChecks != prevReferenceChecks) {
			let { profile } = this.props;
			let { roster_processes } = profile;
			let roster_process = roster_processes[0];

			if (!isEmpty(roster_process.pivot.reference_check_id)) {
				let label = pluck(this.props.reference_checks, 'value');
				label = label.indexOf(roster_process.pivot.reference_check_id);

				this.setState({
					reference_check: {
						value: roster_process.pivot.reference_check_id,
						label: this.props.reference_checks[label]['label']
					},
					alreadySent: true
				});
			}
		}
	}

	selectOnChange(value, e) {
		this.setState({ [e.name]: value });
	}

	referenceCheckInvitation() {
		const { p11ReferenceId } = this.state;
		const reference_check = this.props.reference_checks[0];
		if (!isEmpty(reference_check) && this.props.selected_step.has_reference_check == 1) {
			let { selected_step, roster_process, profile } = this.props;
			let { has_reference_check, id, order } = selected_step;
			this.setState({ isLoading: true }, () => {
				const data = {
					roster_process,
					roster_step_id: id,
					has_reference_check: has_reference_check,
					current_step: order,
					profile_id: profile.id,
					reference_check_id: reference_check.value,
					profile_roster_process_id: this.props.roster_profile_id
				};
				if (p11ReferenceId) data.p11_reference_id = this.state.p11ReferenceId;
				axios
					.post('api/roster/reference-check-invitation', data)
					.then((res) => {
						this.setState({ isLoading: false, alreadySent: true, p11ReferenceId: null }, () => {
							this.props.addFlashMessage({
								type: 'success',
								text: 'Invitation Sent!'
							});
						});
					})
					.catch((err) => {
						this.setState({ isLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'There is an error while sending invitation'
							});
						});
					});
			});
		}
	}

	toogleReferenceHistory() {
		this.setState({showReferenceHistroy: !this.state.showReferenceHistroy})
	}


	render() {
		const { classes, reference_checks, openReferenceCheck, profile, isReference } = this.props;
		const { reference_check, alreadySent, isLoading } = this.state;
		const isAdmin = can('Set as Admin');
		const canSendReferenceCheck = can('Send Reference Check');
		const gridWith = canSendReferenceCheck ? 6 : 12;
		const oldJob = profile.references.filter((reference) => reference.reference_file).length === 0 && !isReference;
		return oldJob ? null : (
			<>
				{this.props.divider}
				<Grid container spacing={16} alignItems="center" className={classes.inviteContainer}>
				{canSendReferenceCheck && (
					<Grid item xs={12} md={6} lg={6} xl={6}>
						<Button
						size="small"
						color="primary"
						fullWidth
						variant="contained"
						className={classes.red}
						onClick={this.toogleReferenceHistory}
						>
						View Past reference check
						</Button>
					</Grid>
				)}
				
				<Grid item xs={12} md={gridWith} lg={gridWith} xl={gridWith}>
					{(canSendReferenceCheck || alreadySent) && (
					<Button
					size="small"
					color="primary"
					fullWidth
					variant="contained"
					className={classes.interviewBtn}
					onClick={this.referenceCheckInvitation}
					disabled={!isReference || (alreadySent || isLoading)}
					>
					{alreadySent ? 'Reference Check has been sent to All References!' : 'Send Reference Check to All References'}
					{!alreadySent ? <Send fontSize="small" className={classes.addSmallMarginLeft} /> : null}
					{isLoading ? <CircularProgress thickness={5} size={22} className={classes.loading} /> : null}
					</Button>)}
				</Grid>
				
				</Grid>
				{(profile.references.length > 0 && canSendReferenceCheck && !oldJob) && <>
				<Grid item xs={12} style={{ paddingBottom: 0 }}>
						<Typography variant="subtitle1" color="primary" style={{ maxWidth: 120, paddingTop: 8, borderTop: `2px solid ${primaryColor}` }}>Reference List</Typography>
				</Grid>

				 <Grid container spacing={16} alignItems="center" className={classes.inviteContainer}>
					<Grid item xs={12} md={12} lg={12} xl={12}>
						{
							profile.references.map(reference => {
								const file = reference.reference_file;
								return (
									<div className={classes.details}>
										<div>
											<Typography variant="body1" className={classes.referenceTitle}>
												{reference.full_name}
											</Typography>
											<Typography variant="body1" color="primary" className={classes.addSmallMarginTop}>
												{reference.email}
											</Typography>
										</div>
										<div className={classes.iconContainer}>
										{(file && file.url) &&
											<Tooltip title="Download File">
												<Fab
													size="medium"
													variant="extended"
													color="primary"
													href={file.url}
													target="_blank"
													className={classes.download}
												>
													{file.mime_type === 'application/pdf' ? (
														<FontAwesomeIcon icon={faFilePdf} size="lg" className={classes.fontAwesome} />
													) : <FontAwesomeIcon icon={faFileWord} size="lg" className={classes.fontAwesome} />}
												</Fab>
											</Tooltip> }
											{(file && file.url) && (
												<Tooltip title="File Submitted!">
													<Fab
														size="medium"
														variant="extended"
														color="default"
														className={classes.successBtn}
													>
														<FontAwesomeIcon icon={faCheckCircle} size="lg" className={classes.fontAwesome} />
													</Fab>
												</Tooltip> 
											)}
											{(!file || !file.url) && <Tooltip title="“Waiting for the file…“">
													<Fab
														size="medium"
														variant="extended"
														color="default"
														className={classes.errorBtn}
													>
														<Error />
													</Fab>
												</Tooltip> }

												<Tooltip title="Resend reference check">
													<Fab
														size="medium"
														variant="extended"
														color="default"
														className={isReference ? classes.resendBtn : classes.disabledBtn}
														onClick={() => {
														 	if(isReference) this.setState({p11ReferenceId: reference.id})
														}}
													>
														<Retry />
													</Fab>
												</Tooltip>

										</div>
									</div>
								)
							})
						}
					</Grid>
				</Grid>
				<PDFViewer />
				</>}
				<Dialog
					open={this.state.p11ReferenceId !== null}
					onClose={() => this.setState({ p11ReferenceId: null })}
					aria-labelledby="form-dialog-title"
					maxWidth="md"
					fullWidth
				>
					<DialogTitle id="form-dialog-title" style={{ paddingBottom: '8px' }}>
						Reference Check Invite
					</DialogTitle>
					<DialogContent id="dialogContent" style={{ paddingBottom: '8px' }}>
						<Typography variant="body1">
							Are you sure you want to resend this reference check invite ?
						</Typography>
					</DialogContent>
					<DialogActions styles={{ paddingTop: 0 }}>
						<Button onClick={() => this.setState({ p11ReferenceId: null })} color="secondary" variant="contained">
							Close
						</Button>
						<Button onClick={() => {this.referenceCheckInvitation(this.state.p11ReferenceId)}} color="primary" variant="contained">
							Save{' '}
							{this.state.isLoading && (
								<CircularProgress thickness={5} size={22} className={classes.loading} />
							)}
						</Button>
					</DialogActions>
				</Dialog>
				{this.state.showReferenceHistroy && <Dialog
					open={true}
					onClose={() => this.setState({ showReferenceHistroy: false })}
					aria-labelledby="form-dialog-title"
					maxWidth="md"
					fullWidth
				>
					<DialogTitle id="form-dialog-title" style={{ paddingBottom: '8px', fontWeight: 'bold' }}>
						<Typography variant="h1" style={{fontSize: 20, marginBottom: 20, fontWeight: 'bold'}}>Past reference Check</Typography>
					</DialogTitle>
					<DialogContent id="dialogContent" style={{ paddingBottom: '8px' }}>
						<PastReferenceCheck profile_id={profile.id} />
					</DialogContent>
					<DialogActions styles={{ paddingTop: 0 }}>
						<Button onClick={() => this.setState({ showReferenceHistroy: false })} color="secondary" variant="contained">
							Close
						</Button>
					</DialogActions>
				</Dialog>}
			</>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getReferenceCheck,
	openReferenceCheck,
	addFlashMessage,
	getPDF,
	getWORD,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	reference_checks: state.options.reference_checks,
	selected_step: state.roster.selected_step,
	roster_process: state.roster.roster_process
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	inviteContainer: {
		'margin-bottom': '0px'
	},
	interviewBtn: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	resultBtn: {
		'background-color': recommendationColor,
		color: white,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	}, 
	details: {
		marginBottom: 10,
		borderRadius: 3,
		marginTop: 10,
		paddingLeft: 8,
		paddingTop: 5,
		paddingBottom: 5,
		display: 'flex',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#eeeeee'
	},
	detailsText: {
		fontSize: '16px !important',
		fontWeight: 500,
	},
	iconContainer: {
		display: 'flex',
		gap: 10,
		flexDirection: 'row',
	},
	referenceTitle: {
		fontSize: '18px !important',
		fontWeight: 'bold',
	},
	red: {
		'background-color': red,
		color: white,
		'&:hover': {
			'background-color': redHover
		}
	},
	blue: {
		'background-color': blue,
		color: white,
		'&:hover': {
			color: secondaryColor
		}
	},
	green: {
		'background-color': green,
		color: white,
		'&:hover': {
			color: greenHover
		}
	},
	grey: {
		'background-color': lightGrey,
		color: white,
		'&:hover': {
			color: grey
		}
	},
	purple: {
		'background-color': purple,
		color: white,
		'&:hover': {
			'background-color': purpleHover
		}
	},
	pdf: {
		'background-color': primaryColor,
		color: white,
		'&:hover': {
			'background-color': primaryColorHover
		}
	},
	word: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	download:{
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
	},
	successBtn: {
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
		backgroundColor: green,
		color: white,
		'&:hover': {
			'background-color': green
		}
	},
	errorBtn: {
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
		backgroundColor: red,
		color: white,
		'&:hover': {
			'background-color': red
		}
	},
	resendBtn: {
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
		backgroundColor: blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	disabledBtn: {
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
		backgroundColor: grey,
		color: white,
		'&:hover': {
			'background-color': grey
		}
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReferenceCheck));
