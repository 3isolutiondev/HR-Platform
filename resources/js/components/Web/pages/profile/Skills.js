import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Star from '@material-ui/icons/Star';
import Chip from '@material-ui/core/Chip';
import Edit from '@material-ui/icons/Edit';
import StarBorder from '@material-ui/icons/StarBorder';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';
import classname from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SkillForm from '../p11/skills/SkillForm';
import { getSkill } from '../../redux/actions/profile/skillActions';
import Alert from '../../common/Alert';
import { addFlashMessage } from '../../redux/actions/webActions';
import { deleteAPI } from '../../redux/actions/apiActions';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	skilStyle: {
		'&:hover $iconEdit': {
			color: '#043C6E'
		}
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#043C6E'
		},
		'&:hover $iconAdd': {
			color: 'white'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#043C6E'
	},
	iconEdit: {
		color: 'transparent'
	},
	rating: {
		display: 'inline-block',
		'vertical-align': 'super',
		'margin-left': '4px'
	},
	iconBtn: {
		padding: '8px'
	},
	break: {
		marginBottom: '20px'
	},
	label: {
		maxWidth: '100%',
		'& > span': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inline !important'
		}
	}
});

class Skills extends Component {
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
		this.refreshSkill = this.refreshSkill.bind(this);
	}

	componentDidMount() {
		this.props.getSkill(this.props.profileID);

		//reference event method from parent
		this.props.onRef(this);
	}

	refreshSkill() {
		this.props.getSkill(this.props.profileID);
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, remove: false, dataId: '', name: '' }, () =>
			this.props.getSkill(this.props.profileID)
		);
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
				this.setState({ dataId: '', alertOpen: false, name: '', openDialog: false }, () => this.dialogClose());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	renderRating(rating, typographyCSS) {
		let ratingElements = [];
		for (var i = 0; i < rating; i++) {
			ratingElements.push(<Star key={i} color="primary" />);
		}
		if (rating === 0) {
			ratingElements.push(<StarBorder key="no-rating-0" color="primary" />);
		}
		ratingElements.push(
			<Typography key={'rating-' + rating} className={typographyCSS}>
				{' ' + rating + ' / 5'}
			</Typography>
		);
		return ratingElements;
	}

	render() {
		const { classes, editable } = this.props;
		const { p11_skills, skills_counts, show } = this.props.skill;
		let { openDialog, remove, dataId, alertOpen, name } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Skills
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
									{skills_counts == 0 || skills_counts < 1 ? (
										<Typography variant="body1">Sorry, no matching records found</Typography>
									) : (
										p11_skills.map((skill, index) => {
											return (
												<Grid
													className={classes.skilStyle}
													key={'skill-list-' + skill.slug + '-' + index}
													container
													spacing={8}
												>
													<Grid item xs={12} sm={3}>
														<Tooltip title={skill.skill}>
															<Chip
																key={skill.slug + '-' + skill.id}
																label={skill.skill}
																color="primary"
																className={classname(
																	classes.capitalize,
																	classes.addSmallMarginRight,
																	classes.label
																)}
															/>
														</Tooltip>
													</Grid>
													<Grid item xs={12} sm={8}>
														{skill.proficiency >= 0 &&
															this.renderRating(skill.proficiency, classes.rating)}
													</Grid>
													{editable ? (
														<Grid item xs={12} sm={1}>
															<IconButton
																className={classes.button}
																onClick={() =>
																	this.dialogOpenEdit(skill.id, skill.skill)}
																aria-label="Delete"
																classes={{ root: classes.iconBtn }}
															>
																<Edit
																	fontSize="small"
																	className={classes.iconEdit}
																	classes={{ fontSizeSmall: '12px' }}
																/>
															</IconButton>
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
						<SkillForm
							isOpen={openDialog}
							recordId={dataId}
							title={remove ? 'Edit Skill' : 'Add Skill'}
							onClose={this.dialogClose}
							updateList={this.dialogClose}
							getP11={this.dialogClose}
							handleRemove={() => this.checkBeforeRemove()}
							remove={remove}
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
			</div>
		);
	}
}

Skills.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getSkill: PropTypes.func.isRequired
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
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getSkill,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Skills));
