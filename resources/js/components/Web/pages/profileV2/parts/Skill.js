import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import { primaryColor, borderColor } from '../../../config/colors';
import SkillForm from '../../p11/skills/SkillForm';
import { getSkill } from '../../../redux/actions/profile/skillActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import Alert from '../../../common/Alert';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';

class Skill extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: '',
			name: '',
			alertOpen: false,
			skills: []
		};
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.refreshSkill = this.refreshSkill.bind(this);
	}

	componentDidMount() {
		this.props.getSkill(this.props.profileID).then(() => this.refreshSkill());

		//reference event method from parent
		this.props.onRef(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getSkill(this.props.profileID);
			// this.props.onRef(this);
		}
	}

	refreshSkill() {
		this.props.getSkill(this.props.profileID).then(() =>{
			let reformatSkills = [];
			 this.props.skill.p11_skills.map((skill) =>{
				let reformatSkill = {
					label: skill.skill,
					value: skill.skill_id
				};
				 reformatSkills.push(reformatSkill);
			});
			this.setState({ skills : reformatSkills  });
		})
	}

	dialogOpen() {
		this.setState({ openDialog: true }, () => this.refreshSkill());
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true }, () => this.refreshSkill());
	}

	dialogClose() {
		this.setState({ openDialog: false, remove: false, dataId: '', name: '' }, () => this.refreshSkill());
	}

	checkBeforeRemove() {
		if (this.props.skill.skills_counts > 1) {
			this.setState({ alertOpen: true });
		}
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-skills/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.props.profileLastUpdate();
				this.setState({ dataId: '', alertOpen: false, name: '', openDialog: false }, () => this.dialogClose());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	renderRating(rating) {
		const maxRating = 5;
		let ratingElements = [];
		for (var i = 0; i < maxRating; i++) {
			if (rating > i) {
				ratingElements.push(<Star key={'rat' + i} color="primary" key={'rating' + i} />);
			} else {
				ratingElements.push(<StarBorder key={'no-rat' + i} color="primary" key={'norating' + i} />);
			}
		}

		return ratingElements;
	}

	render() {
		const { classes, editable, skill, showSkills } = this.props;
		const { p11_skills, skills_counts, show } = skill;
		const { openDialog, remove, dataId, alertOpen, name, skills } = this.state;

		return (
			<div>
				{ (showSkills || show) ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Skills
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
							<Typography variant="subtitle2" color="secondary" className={classes.subtitle}>
										Technical Skills
							</Typography>
							{p11_skills.filter(skill => skill.category === 'technical').length > 0 ? <>
								<Grid container spacing={16}>
									{skills_counts > 0 ? (
										p11_skills.filter(skill => skill.category === 'technical').map((skill) => {
											const skillName =
												skill.skill.length < 25
													? skill.skill
													: skill.skill.substring(0, 21) + '...';
											return (
												<Grid
													item
													xs={12}
													sm={6}
													md={12}
													lg={6}
													className={classes.skill}
													key={'skill-' + skill.skill + '-' + skill.id}
												>
													<Grid container spacing={8}>
														<Grid item xs={6} sm={6} md={6} lg={6}>
															<Tooltip title={skill.skill} placement="bottom-start">
																<Typography variant="body2">
																	{skillName}
																	{editable ? (
																		<Edit
																			fontSize="small"
																			color="primary"
																			className={classes.editSkill}
																			onClick={() =>
																				this.dialogOpenEdit(skill.id, skill.skill)}
																		/>
																	) : null}
																</Typography>
															</Tooltip>
														</Grid>
														<Grid item xs={6} sm={6} md={6} lg={6}>
															<div className={classes.ratingContainer}>
																{skill.proficiency >= 0 ? this.renderRating(skill.proficiency, classes) : null}
															</div>
														</Grid>
													</Grid>
												</Grid>
											);
										})
									) : (
										<Grid item xs={12}>
											<Typography>Sorry, no records found</Typography>
										</Grid>
									)}
								</Grid>
							</> : (
							<Typography variant="subtitle2" color="primary" className={classes.subtitle}>
								<b>Please update your skills</b>
							</Typography>
							)}
							<Typography variant="subtitle2" color="secondary" className={classes.subtitle}>
									Soft Skills
							</Typography>
						    {p11_skills.filter(skill => skill.category === 'soft').length > 0 ? <>
							<Grid container spacing={16}>
								{skills_counts > 0 ? (
									p11_skills.filter(skill => skill.category === 'soft').map((skill) => {
										const skillName =
											skill.skill.length < 25
												? skill.skill
												: skill.skill.substring(0, 21) + '...';
										return (
											<Grid
												item
												xs={12}
												sm={6}
												md={12}
												lg={6}
												className={classes.skill}
												key={'skill-' + skill.skill + '-' + skill.id}
											>
												<Grid container spacing={8}>
													<Grid item xs={6} sm={6} md={6} lg={6}>
														<Tooltip title={skill.skill} placement="bottom-start">
															<Typography variant="body2">
																{skillName}
																{editable ? (
																	<Edit
																		fontSize="small"
																		color="primary"
																		className={classes.editSkill}
																		onClick={() =>
																			this.dialogOpenEdit(skill.id, skill.skill)}
																	/>
																) : null}
															</Typography>
														</Tooltip>
													</Grid>
													<Grid item xs={6} sm={6} md={6} lg={6}>
														<div className={classes.ratingContainer}>
															{skill.proficiency >= 0 ? this.renderRating(skill.proficiency, classes) : null}
														</div>
													</Grid>
												</Grid>
											</Grid>
										);
									})
								) : (
									<Grid item xs={12}>
										<Typography>Sorry, no records found</Typography>
									</Grid>
								)}
							</Grid>
							</> : (
							<Typography variant="subtitle2" color="primary" className={classes.subtitle}>
								<b>Please update your skills</b>
							</Typography>
							)}
							<Typography variant="subtitle2" color="secondary" className={classes.subtitle}>
										Software Skills
							</Typography>

							{p11_skills.filter(skill => skill.category === 'software').length > 0 ? <>
								<Grid container spacing={16}>
									{skills_counts > 0 ? (
										p11_skills.filter(skill => skill.category === 'software').map((skill) => {
											const skillName =
												skill.skill.length < 25
													? skill.skill
													: skill.skill.substring(0, 21) + '...';
											return (
												<Grid
													item
													xs={12}
													sm={6}
													md={12}
													lg={6}
													className={classes.skill}
													key={'skill-' + skill.skill + '-' + skill.id}
												>
													<Grid container spacing={8}>
														<Grid item xs={6} sm={6} md={6} lg={6}>
															<Tooltip title={skill.skill} placement="bottom-start">
																<Typography variant="body2">
																	{skillName}
																	{editable ? (
																		<Edit
																			fontSize="small"
																			color="primary"
																			className={classes.editSkill}
																			onClick={() =>
																				this.dialogOpenEdit(skill.id, skill.skill)}
																		/>
																	) : null}
																</Typography>
															</Tooltip>
														</Grid>
														<Grid item xs={6} sm={6} md={6} lg={6}>
															<div className={classes.ratingContainer}>
																{skill.proficiency >= 0 ? this.renderRating(skill.proficiency, classes) : null}
															</div>
														</Grid>
													</Grid>
												</Grid>
											);
										})
									) : (
										<Grid item xs={12}>
											<Typography>Sorry, no records found</Typography>
										</Grid>
									)}
								</Grid>
							</> : (
							<Typography variant="subtitle2" color="primary" className={classes.subtitle}>
								<b>Please update your skills</b>
							</Typography>
							)}
							{editable ? (
								<div>
									<SkillForm
										isOpen={openDialog}
										recordId={dataId}
										title={remove ? 'Edit Skill' : 'Add Skill'}
										onClose={this.dialogClose}
										updateList={this.dialogClose}
										getP11={this.dialogClose}
										handleRemove={() => this.checkBeforeRemove()}
										remove={remove}
										getProfileLastUpdate={true}
										canAddSkill={skills_counts < 5}
										excludedSkills={p11_skills.map(v => ({value: v.skill_id, label: v.skill}))}
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
										text={'Are you sure to delete your skill ' + name + ' ?'}
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
	getSkill,
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
	skill: state.skill
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
		paddingBottom: theme.spacing.unit,
		marginBottom: theme.spacing.unit * 2,
		position: 'relative'
	},
	skill: {
		paddingTop: theme.spacing.unit / 2 + 'px !important',
		paddingBottom: theme.spacing.unit / 2 + 'px !important',
		'&:hover $editSkill': {
			display: 'inline-block'
		}
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
	subtitle: {
		marginTop: 10,
		marginBottom: 10
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Skill));
