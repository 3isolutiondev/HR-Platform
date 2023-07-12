import React, { Component } from 'react';
import { connect } from 'react-redux';
import classname from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import CloudDownload from '@material-ui/icons/CloudDownload';
import IconButton from '@material-ui/core/IconButton';
import PortfolioForm from '../p11/portfolios/PortfolioForm';
import { getPortofolio } from '../../redux/actions/profile/portofolioActions';
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
	addSmallMarginRight: {
		'margin-right': '.25em'
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
	},
	label: {
		maxWidth: 300,
		'& > span': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inline !important'
		}
	}
});

class Portfolios extends Component {
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
		this.props.getPortofolio(this.props.profileID);
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
					this.dialogClose();
					// this.props.getPortofolio(this.props.profileID);
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
		const { portfolios, portfolios_counts, show } = this.props.portofolio;
		const { openDialog, remove, dataId, name, alertOpen } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Portfolio
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
									{portfolios_counts == 0 || portfolios_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										portfolios.map((portfolio) => {
											return (
												<Grid
													container
													spacing={8}
													key={portfolio.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">{portfolio.title}</Typography>
													</Grid>
													{editable ? (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogOpenEdit(portfolio.id, portfolio.title)}
																className={classes.button}
																aria-label="Delete"
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</Grid>
													) : null}

													{/* <Grid container item xs={12}> */}
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Title</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">{portfolio.title}</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Description</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">{portfolio.description}</Typography>
													</Grid>

													{portfolio.url ? (
														<Grid item xs={12} sm={3}>
															<Typography variant="subtitle2">Website URL</Typography>
														</Grid>
													) : null}
													{portfolio.url ? (
														<Grid item xs={12} sm={9}>
															<Typography variant="body2">{portfolio.url}</Typography>
														</Grid>
													) : null}

													{portfolio.portfolio_skills ? (
														<Grid item xs={12} sm={3}>
															<Typography variant="subtitle2">Skills</Typography>
														</Grid>
													) : null}
													{portfolio.portfolio_skills ? (
														<Grid item xs={12} sm={9}>
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

													{portfolio.sectors ? (
														<Grid item xs={12} sm={3}>
															<Typography variant="subtitle2">Sector</Typography>
														</Grid>
													) : null}
													{portfolio.sectors ? (
														<Grid item xs={12} sm={9}>
															{portfolio.sectors.map((sector) => {
																return (
																	<Tooltip key={sector.id} title={sector.name}>
																		<Chip
																			key={sector.id}
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

													{portfolio.portfolio_file ? (
														<Grid item xs={12} sm={3}>
															<Typography variant="subtitle2">File</Typography>
														</Grid>
													) : null}
													{portfolio.portfolio_file ? (
														<Grid item xs={12} sm={9}>
															<Typography variant="body2">
																<Button
																	size="small"
																	variant="contained"
																	color="primary"
																	href={portfolio.portfolio_file.url}
																>
																	<CloudDownload className={classes.addSmallMarginRight} />{' '}
																	Download
																</Button>{' '}
																{portfolio.portfolio_file.file_name}
															</Typography>
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
							text={'Are you sure to delete your portfolio with title ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				) : null}
			</div>
		);
	}
}
Portfolios.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getPortofolio: PropTypes.func.isRequired
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
	deleteAPI
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Portfolios));
