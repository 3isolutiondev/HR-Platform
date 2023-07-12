import React, { Component } from 'react';
import classname from 'classnames';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Lens from '@material-ui/icons/Lens';
import StarBorder from '@material-ui/icons/StarBorder';
import {
	borderColor,
	primaryColor,
	primaryColorRed,
	primaryColorGreen,
	primaryColorBlue,
	lightText
} from '../../../config/colors';
import { getLanguage } from '../../../redux/actions/profile/languageActions';
import { getLanguageLevels } from '../../../redux/actions/optionActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import LanguageForm from '../../p11/languages/LanguageForm';
import Alert from '../../../common/Alert';
import isEmpty from '../../../validations/common/isEmpty';

class Language extends Component {
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
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getLanguage(this.props.profileID);
		this.props.getLanguageLevels();
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getLanguage(this.props.profileID);
		}
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}

	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getLanguage(this.props.profileID)
		);
	}

	checkBeforeRemove() {
		if (this.state.isMotherTongue === 1) {
			this.props.addFlashMessage({
				type: 'error',
				text: `Mother tongue can't remove`
			});
		} else {
			if (this.props.language.languages_counts > 1) {
				this.setState({ alertOpen: true });
			}
		}
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-languages/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false }, () => {
					this.child.clearState();
					this.dialogClose();
					this.props.profileLastUpdate();
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	renderRating(rating, classes) {
		const maxRating = 3;
		let ratingElements = [];
		for (var i = 0; i < maxRating; i++) {
			if (rating >= i) {
				ratingElements.push(<Lens key={'rat' + i} color="primary" key={'rating' + i} />);
			} else {
				ratingElements.push(
					<Lens className={classes.redLight} key={'no-rat' + i} color="primary" key={'norating' + i} />
				);
			}
		}

		return ratingElements;
	}

	render() {
		const { classes, editable, language, language_levels } = this.props;
		const { languages, languages_counts, show } = language;
		const { openDialog, remove, dataId, alertOpen, name } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Languages
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
							<Grid container spacing={16} alignItems="flex-start">
								{languages_counts == 0 || languages_counts < 1 ? (
									<Typography variant="body1">Sorry, no records found</Typography>
								) : (
									languages.map((lang) => {
										const langName =
											lang.language.name.length < 25
												? lang.language.name
												: lang.language.name.substring(0, 21) + '...';
										return (
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={12}
												xl={6}
												key={'lang-' + lang.id}
												className={classes.skill}
											>
												<Grid container spacing={0} alignItems="flex-start">
													<Grid item xs={6} sm={6} md={6} lg={6} xl={8}>
														<Tooltip title={lang.language.name} placement="bottom-start">
															<Typography variant="body2">
																{langName}
																{lang.is_mother_tongue === 1 ? (
																	<Chip
																		component="span"
																		icon={<StarBorder className={classes.star} />}
																		label="Mother Tongue"
																		color="primary"
																		className={classes.motherTongue}
																	/>
																) : null}
																{editable ? (
																	<Edit
																		fontSize="small"
																		color="primary"
																		className={classes.editSkill}
																		onClick={() =>
																			this.dialogOpenEdit(
																				lang.id,
																				lang.language.name
																			)}
																	/>
																) : null}
															</Typography>
														</Tooltip>
													</Grid>
													<Grid item xs={6} sm={6} md={6} lg={6} xl={4}>
														<div className={classes.ratingContainer}>
															<Tooltip
																title={lang.language_level.name}
																placement="bottom-end"
															>
																<div>
																	{!isEmpty(lang.language_level) ?
																		this.renderRating(
																			lang.language_level.order,
																			classes
																	) : null}
																</div>
															</Tooltip>
														</div>
													</Grid>
												</Grid>
												{/* <div className={classes.record}>
													{editable && (
														<IconButton
															onClick={() =>
																this.dialogOpenEdit(lang.id, lang.language.name)}
															className={classes.button}
															aria-label="Edit"
														>
															<Edit fontSize="small" className={classes.iconEdit} />
														</IconButton>
													)}
													<Typography variant="subtitle1" className={classes.jobTitle}>
														{lang.language.name}
														{lang.is_mother_tongue === 1 && (
															<Chip
																icon={<StarBorder className={classes.star} />}
																label="Mother Tongue"
																color="primary"
																className={classes.motherTongue}
															/>
														)}
													</Typography>
													<Typography variant="subtitle2" className={classes.employer}>
														{lang.language_level.name}
													</Typography>
												</div> */}
											</Grid>
										);
									})
								)}
							</Grid>
							<div className={classname(classes.divider, classes.withBorder)} />
							<Grid container spacing={0} justify="space-between">
								<Grid item xs={12}>
									<Typography className={classes.lightText}>notes :</Typography>
								</Grid>
								{language_levels.map((level) => (
									<Grid item key={'lang-level-' + level.value}>
										<div>
											{this.renderRating(level.order, classes)}{' '}
											<Typography className={classname(classes.note, classes.lightText)}>
												: {level.label}
											</Typography>
										</div>
									</Grid>
								))}
							</Grid>
							{editable ? (
								<div>
									<LanguageForm
										isOpen={openDialog}
										recordId={dataId}
										title={remove ? 'Edit Language' : 'Add Language'}
										languages={this.props.languages}
										onClose={this.dialogClose}
										updateList={this.dialogClose}
										getP11={this.dialogClose}
										handleRemove={() => this.checkBeforeRemove()}
										onRef={(ref) => (this.child = ref)}
										remove={remove}
										p11Languages={languages}
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
										text={'Are you sure to delete your language : ' + name + ' ?'}
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

Language.propTypes = {};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getLanguage,
	getLanguageLevels,
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
	language: state.language,
	languages: state.options.languages,
	language_levels: state.options.language_levels
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
	jobTitle: {
		fontWeight: 700
	},
	record: {
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
	motherTongue: {
		marginLeft: theme.spacing.unit,
		fontWeight: '400 !important',
		color: primaryColor,
		background: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)'
	},
	star: {
		marginLeft: theme.spacing.unit
	},
	employer: {
		color: primaryColor
	},
	redLight: {
		color: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)'
	},
	ratingContainer: {
		textAlign: 'right'
	},
	editSkill: {
		verticalAlign: 'middle',
		marginLeft: theme.spacing.unit / 2,
		display: 'none',
		cursor: 'pointer',
		'&:hover': {
			borderBottom: '1px solid ' + primaryColor
		}
	},
	skill: {
		paddingTop: theme.spacing.unit / 2 + 'px !important',
		paddingBottom: theme.spacing.unit / 2 + 'px !important',
		'&:hover $editSkill': {
			display: 'inline-block'
		}
	},
	withBorder: {
		borderBottom: '1px solid ' + borderColor,
		marginBottom: theme.spacing.unit
	},
	note: {
		display: 'inline-block',
		verticalAlign: 'super'
	},
	lightText: {
		color: lightText,
		fontStyle: 'italic'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Language));
