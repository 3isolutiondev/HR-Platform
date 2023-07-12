import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import CloudDownload from '@material-ui/icons/CloudDownload';
import IconButton from '@material-ui/core/IconButton';
import PortfolioForm from '../../p11/portfolios/PortfolioForm';
import { getPortofolio } from '../../../redux/actions/profile/portofolioActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import Alert from '../../../common/Alert';
import { lightText, primaryColor, borderColor } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

class Portfolio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detailOpen: false,
			detailID: '',
			openDialog: false,
			remove: false,
			dataId: '',
			alertOpen: false,
			name: ''
		};

		this.openDetails = this.openDetails.bind(this);
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.handleAllert = this.handleAllert.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getPortofolio(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getPortofolio(this.props.profileID);
		}
	}

	openDetails(detailID) {
		if (this.state.detailOpen && this.state.detailID == detailID) {
			this.setState({ detailOpen: false, detailID: '' });
		} else if (this.state.detailOpen && this.state.detailID !== detailID) {
			this.setState({ detailID });
		} else {
			this.setState({ detailOpen: true, detailID });
		}
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		//refresh skill
		this.props.refreshSkill();

		this.setState({ openDialog: false, dataId: '', remove: false }, () =>
			this.props.getPortofolio(this.props.profileID)
		);
	}

	handleAllert() {
		this.setState({ alertOpen: true });
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-portfolios/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.props.profileLastUpdate();
					this.child.clearState();
					this.dialogClose();
					// this.props.getPortofolio(this.props.profileID);
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
		const { portfolios, portfolios_counts, show } = this.props.portofolio;
		const { openDialog, remove, dataId, name, alertOpen, detailOpen, detailID } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Portfolio
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
							{portfolios_counts == 0 || portfolios_counts < 1 ? (
								<Typography variant="body1">Sorry, no records found</Typography>
							) : (
								portfolios.map((portfolio) => (
									<div
										className={editable ? classes.record : classes.recordUneditable}
										key={'portfolio-' + portfolio.id}
									>
										{editable ? (
											<IconButton
												onClick={() => this.dialogOpenEdit(portfolio.id, portfolio.title)}
												className={classes.button}
												aria-label="Edit"
											>
												<Edit fontSize="small" className={classes.iconEdit} />
											</IconButton>
										) : null}
										<Typography variant="subtitle1" className={classes.jobTitle}>
											{portfolio.title + ' '}
											{!isEmpty(portfolio.portfolio_file) ? (
												<Tooltip title="Download Portfolio File">
													<Fab
														size="small"
														variant="extended"
														color="primary"
														href={portfolio.portfolio_file.url}
														target="_blank"
														className={classes.download}
													>
														<CloudDownload className={classes.downloadIcon} />
														Portfolio
													</Fab>
												</Tooltip>
											) : null}
										</Typography>
										{!isEmpty(portfolio.url) ? (
											<Link href={portfolio.url} target="_blank" color="primary" variant="subtitle2">
												{portfolio.url}
											</Link>
										) : null}
										<Typography
											variant="body2"
											className={classname(
												classes.lightText,
												classes.addMediumMarginBottom,
												classes.addMediumMarginTop
											)}
										>
											{portfolio.description}
										</Typography>
										{(detailOpen && detailID === portfolio.id) ? (
											<Grid container spacing={0}>
												{!isEmpty(portfolio.portfolio_skills) ? (
													<Grid item xs={12}>
														<Typography variant="body2" className={classes.lightText}>
															Skills:
														</Typography>
													</Grid>
												) : null}
												{!isEmpty(portfolio.portfolio_skills) ? (
													<Grid item xs={12}>
														{portfolio.portfolio_skills.map((skill) => {
															return (
																<Tooltip key={skill.id} title={skill.skill}>
																	<Chip
																		label={skill.skill}
																		color="primary"
																		className={classname(
																			classes.addSmallMarginRight,
																			classes.capitalize,
																			classes.label
																		)}
																	/>
																</Tooltip>
															);
														})}
													</Grid>
												) : null}

												{!isEmpty(portfolio.sectors) ? (
													<Grid item xs={12}>
														<Typography variant="body2" className={classes.lightText}>
															Sectors:
														</Typography>
													</Grid>
												) : null}
												{!isEmpty(portfolio.sectors) ? (
													<Grid item xs={12}>
														{portfolio.sectors.map((sector) => {
															return (
																<Tooltip key={sector.id} title={sector.name}>
																	<Chip
																		label={sector.name}
																		color="primary"
																		className={classname(
																			classes.addSmallMarginRight,
																			classes.capitalize,
																			classes.label
																		)}
																	/>
																</Tooltip>
															);
														})}
													</Grid>
												) : null}
											</Grid>
										) : null}
										<Typography
											variant="body2"
											className={classes.more}
											onClick={() => this.openDetails(portfolio.id)}
										>
											{detailOpen && detailID === portfolio.id ? 'Less ' : 'More '} Details
										</Typography>
									</div>
								))
							)}
							{editable ? (
								<div>
									<PortfolioForm
										isOpen={openDialog}
										recordId={dataId}
										onClose={this.dialogClose}
										updateList={this.dialogClose}
										getP11={this.dialogClose}
										remove={remove}
										handleRemove={() => this.handleAllert()}
										title={remove ? 'Edit Portfolio' : 'Add Portfolio'}
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
										text={'Are you sure to delete your portfolio : ' + name + ' ?'}
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

Portfolio.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getPortofolio: PropTypes.func.isRequired,
	profileLastUpdate: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	portofolio: state.portofolio
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getPortofolio,
	addFlashMessage,
	deleteAPI,
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
		// marginBottom: theme.spacing.unit * 2 - theme.spacing.unit / 2
		// text
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
		// float: 'right',
		position: 'absolute',
		right: theme.spacing.unit * -1,
		top: theme.spacing.unit * -1,
		'&:hover': {
			backgroundColor: '#be2126'
		},
		// '&:hover $iconAdd': {
		// 	color: 'white'
		// },
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	lightText: {
		color: lightText
	},
	jobTitle: {
		fontWeight: 700
	},
	download: {
		width: theme.spacing.unit * 4 + 2,
		height: theme.spacing.unit * 4 + 2,
		minHeight: theme.spacing.unit * 4 + 2,
		border: '1px solid ' + primaryColor,
		marginLeft: theme.spacing.unit
	},
	downloadIcon: {
		fontSize: theme.spacing.unit * 3 - 2,
		marginRight: theme.spacing.unit
	},
	addMediumMarginBottom: {
		marginBottom: theme.spacing.unit * 2 - theme.spacing.unit / 2
	},
	addMediumMarginTop: {
		marginTop: theme.spacing.unit * 2 - theme.spacing.unit / 2
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
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
