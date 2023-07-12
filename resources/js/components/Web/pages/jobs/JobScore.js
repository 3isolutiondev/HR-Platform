/** import React */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import { Card, CardHeader, Collapse, CardContent } from '@material-ui/core'
import { Delete, Edit, ExpandLess, ExpandMore } from '@material-ui/icons'
import { TextField, Button } from '@material-ui/core';

/** import Configs */
import {
	blueIMMAPHover,
	blueInfoColor,
	primaryColor,
} from '../../config/colors';
import { can } from '../../permissions/can';

/** import React Redux and it's actions */
import { getAPI, postAPI, deleteAPI, putApi } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { connect } from 'react-redux';
import Alert from '../../common/Alert';
import isEmpty from '../../validations/common/isEmpty';

/**
 * Component that shows a single job question card.
 *
 *
 * Permission: -
 *
 * @component
 * @name JobScore
 * @category Page
 * @subcategory JobInterviewScore
 * @example
 * return (
 * 	  <JobScore 
 * 		user_id={applicant_id}
 * 		scores={[]}
 * 		name="name"
 * 		questions={interview_questions}
 * 		manager={managerData} />
 * )
 *
 */

class JobScore extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			questionText: '',
			edit: -1,
			scores: [],
			globalImpression: {},
			adminValidate: false,
			errors: {}
		}

		this.addScore = this.addScore.bind(this);
		this.updateScore = this.updateScore.bind(this);
		this.enableValidation = this.enableValidation.bind(this);
		this.isValid = this.isValid.bind(this);
	}
   /**
   * isValid is a function that checks if there is an error in the scores.
   */
	isValid() {
		const errors = {};
		this.props.questions.forEach((q, index) => {
			const score = this.state.scores.find(s => s.interview_question_id == q.id);
			if(score) {
				if(q.question_type === 'number' && ((!score.score && score.score !== 0) || Number.isNaN(score.score) || score.score < 0)) {
					errors[`question-max-${q.id}`] = "Required";
				}  
				if(!score.comment) {
					errors[`question-comment-${q.id}`] = "Required";
				}
			} else {
				errors[`question-comment-${q.id}`] ="Required";
				errors[`question-max-${q.id}`] = "Required";
			}
			
		});
		const globalImpression = this.state.globalImpression;
		if(!globalImpression || !globalImpression.comment) errors['global-impression'] = "Required";
		return errors;
	}
   /**
   * addScore a function that adds a new scores to an interview.
   */
	addScore(questions){
		const errors = this.isValid();
		if(Object.keys(errors).length > 0) this.setState({errors}) 
		else {
			let sco = {
				scores: this.state.scores.filter(s => !s.id).map(s => ({...s, editable: 0})),
			}
			if(this.state.globalImpression && this.state.globalImpression.comment){
				if(!this.props.roster_process_id) sco.globalImpression = { ...this.state.globalImpression, editable: 0, applicant_id: this.props.user_id, manager_id: this.props.manager.id};
				else {
					sco.globalImpression = { ...this.state.globalImpression, editable: 0, manager_user_id: this.props.manager.id};
					sco.globalImpression = Object.fromEntries(Object.entries(sco.globalImpression).filter(([_, v]) => v != null));
				}
			} 

			sco.scores = sco.scores.filter(s => this.props.questions.find(iq => iq.id == s.interview_question_id));

			this.setState({isLoading: true}, () => {
				this.props.postAPI('/api/job-interview-scores', sco).then(res => {
				const scoresAdded = this.state.scores.filter(s => !s.id).map(s => ({...s, editable: 0, interview_question: questions.find(iq => iq.id == s.interview_question_id)}));
				const scores = [...this.state.scores.filter(s => s.id), ...scoresAdded];
				this.setState({ isLoading: false, scores, adminValidate:  false, globalImpression: { ...this.state.globalImpression, editable: 0 } })
				this.props.updateScores(scores, { ...this.state.globalImpression, editable: 0 })
				this.props.addFlashMessage({
					type: 'success',
					text: "Success"
				})
			}).catch(err =>{
				this.props.addFlashMessage({
					type: 'error',
					text: "Add score failed"
				})
			})})
		}
	}

	componentDidMount() {
		this.setState({
			scores: this.props.scores || [],
			globalImpression: this.props.globalImpression.find(g => !g.roster_process_id ? g.manager_id === this.props.manager.id : g.manager_user_id ===this.props.manager.id)
		})
	}

   /**
   * updateScore a function that updates scores.
   */

	updateScore(){
		const errors = this.isValid();
		if(Object.keys(errors).length > 0) this.setState({errors}) 
		else {
			let sco = {
				scores: this.state.scores.map(s => ({
					applicant_id: s.applicant_id,
					interview_question_id: s.interview_question_id,
					score: s.score,
					comment: s.comment
				})),
			}

		if(this.props.roster_process_id) {
			sco = {
				scores: this.state.scores.map(s => ({
					roster_process_id: this.props.roster_process_id,
					roster_profile_id: this.props.roster_profile_id,
					interview_question_id: s.interview_question_id,
					score: s.score,
					comment: s.comment,
					manager_user_id: this.props.manager.id
				})),
			}
		}


		sco.scores = sco.scores.filter(s => this.props.questions.find(iq => iq.id == s.interview_question_id));

		if(this.state.globalImpression && this.state.globalImpression.comment) {
			if(this.state.globalImpression.applicant_id) {
				sco.globalImpression = { 
					applicant_id: this.state.globalImpression.applicant_id,
					comment: this.state.globalImpression.comment,
					manager_id: this.props.manager.id,
					id: this.state.globalImpression.id, 
					editable: 0
				}
			} else {
				sco.globalImpression = { 
					roster_process_id: this.state.globalImpression.roster_process_id,
					roster_profile_id: this.state.globalImpression.roster_profile_id,
					comment: this.state.globalImpression.comment,
					manager_user_id: this.props.manager.id,
					id: this.state.globalImpression.id, 
					editable: 0
				}
			}
		}
		this.setState({isLoading: true}, () => {
			this.props.putApi('/api/job-interview-scores', sco).then(res => {
				const updatedScores = this.state.scores.filter(s => this.props.questions.find(iq => iq.id == s.interview_question_id)).map(s => ({...s, editable: 0, id: res.data.data.find(d => d.interview_question_id === s.interview_question_id).id, id: res.data.data.find(d => d.interview_question_id === s.interview_question_id).id}));
				this.setState({isLoading: false, scores: updatedScores, adminValidate:  false, globalImpression: {...this.state.globalImpression, editable: 0}});
				this.props.updateScores(updatedScores, { ...this.state.globalImpression, editable: 0 })
				this.props.addFlashMessage({
					type: 'success',
					text: "Success"
				})
			}).catch(err =>{
				this.props.addFlashMessage({
					type: 'error',
					text: "Update score failed"
				})
			})
		})
	  }
	}

   /**
   * enableValidation a function that enables edition of scores.
   */

	enableValidation() {
		const data = {
			job_manager_id: this.props.manager.user_id,
			job_id: this.props.manager.job_id,
			manager_id: this.props.manager.id,
		};
		if(this.props.roster_process_id) {
			data.roster_process_id = this.props.roster_process_id;
			data.roster_profile_id = this.props.roster_profile_id;
		}
		if(!this.props.roster_process_id) data.applicant_id = this.props.user_id;
		this.props.postAPI('/api/job-interview-scores/enable-validation', data).then(res => {
			this.setState({scores: this.state.scores.map(s => ({...s, editable: 1}))});
			const index = this.props.globalImpression.findIndex(g => (this.props.roster_process_id ? g.manager_user_id : g.manager_id) === this.props.manager.id)

			if(index >= 0) {
				this.props.updateScores(this.state.scores,{...this.props.globalImpression[index], editable: 1})
			}
			this.setState({globalImpression: {...this.state.globalImpression, editable: 1}})
			this.props.addFlashMessage({
				type: 'success',
				text: "Success"
			})
		}).catch(err => {
			this.props.addFlashMessage({
				type: 'error',
				text: "Enable validation failed"
			})
		})
	}

   /**
   * render a function that renders the component.
   */
	render() {
        const { classes, name, questions, currentUser , user_id, manager, roster_profile_id } = this.props;
		let { scores, errors } = this.state;
		const isAdmin = can('Set as Admin') && currentUser.isIMMAPER;
		let canValidate = (scores.find(s => s.editable === 0 && (s.interview_question && s.interview_question.user_id === (this.props.roster_process_id ? manager.id : manager.user_id)))) ? false : currentUser.data.id === (this.props.roster_process_id ? manager.id : manager.user_id);

		const cleanedScores = [];
		scores.sort((a,b) => b.id - a.id).forEach(score => {
			if(!cleanedScores.find(s => s.interview_question_id === score.interview_question_id)) {
				cleanedScores.push(score);
			}
		})
		scores = cleanedScores;

		if(scores.filter(s => s.interview_question && s.interview_question.user_id 
			=== (this.props.roster_process_id ? manager.id : manager.user_id)).length === 0) canValidate = currentUser.data.id === (this.props.roster_process_id ? manager.id : manager.user_id);
		let averageScore = 0;
		let countScore = this.props.questions.filter(iq => iq.question_type === 'number' && (iq.user_id === (this.props.roster_process_id ? manager.id : manager.user_id))).length;
		let scoreNumbers = scores.filter(s => this.props.questions.find(iq => iq.id == s.interview_question_id)).filter(s => (s.interview_question && s.interview_question.question_type === 'number' && (!isNaN(s.score) && s.interview_question && s.interview_question.user_id === (this.props.roster_process_id ? manager.id : manager.user_id)))); 
		scoreNumbers.forEach(s => {
			averageScore += s.score;
		})

		const legends = [
			'5 – Applicant’s answers exceed expectations',
			'4 – Applicant’s answers meet expectations',
			'3 – Applicant’s answers partially meet expectations',
			'2 – Applicant’s answers are insufficient',
			'1 – The Applicant doesn’t answer the question',
			'0 – The applicant didn’t understand the question at all and has been off topic'
		]
		let editGLobalImpression = true;
		if((this.props.globalImpression.find(g => !g.roster_process_id ? g.manager_id === manager.id : g.manager_user_id === manager.id) || {}).editable === 0) editGLobalImpression = false;
		if(!canValidate) editGLobalImpression = false;

		if(countScore > 1) averageScore = (averageScore / countScore).toFixed(2);
		const revalidate = () => {
			if(Object.keys(errors).length > 0) {
				const newErros = this.isValid();
				this.setState({errors: newErros});

			}
		}

		return <>
		<Card className={classes.responseCard} variant="outline" >
				<Alert
					isOpen={this.state.alertOpen}
					onClose={() => {
						this.setState({ alertOpen: false });
					}}
					onAgree={() => {
						this.setState({ alertOpen: false, adminValidate: true });
					}}
					title="Validation"
					text={'Are you sure you want to update and/or edit the scores and/or comments of this panel member ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			<CardHeader
				title={<div className={classes.questionHeader}>
						<Typography
							variant="body1"
							className={classes.cardTitle}
							onClick={() => {
								this.setState({ keyword: '' })
								this.props.resetFilter()
							}}
						>
							 {manager.name || manager.label}
						</Typography>
					</div>
				}
				className={classes.noPaddingBottom}
				action={
				 <div className={classes.expandableContainer}>
					  <Typography variant="body2" color="primary" className={classes.scoreTitle}>{!canValidate ? (scoreNumbers.length === 0 ? 'No scores' :  `AVG SCORE : ${averageScore} / 5`) : 'SCORE' }</Typography>
					  {!this.state.expanded ? <ExpandMore rotate='30' className={classes.cardPlusIcon} onClick={()=>{this.setState({expanded: !this.state.expanded})}}  /> : <ExpandLess  className={classes.cardMinimizeIcon} onClick={()=>{this.setState({expanded: !this.state.expanded})}}  />}
				 </div>
				}        	
			/>
			<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
				{questions.map((q, index) => {
				const score = (scores.find(s => s.interview_question_id === q.id) || {}).score;
				let editable = (scores.find(s => s.interview_question_id === q.id) || {}).editable !== 0;
				if(editable) editable = (editable && ((manager.user_id || manager.id) === currentUser.data.id)) || isAdmin;
				return <div className={classes.details} style={{borderLeftColor: primaryColor}}>
					<div style={{width: '90%'}}>
					<div className={classes.questionContain}>
						<Typography
							variant="body1"
							className={classes.detailsText}
							
						>
							{q.question}
						</Typography>
						<p className={classes.questionRequired}>*</p>
					</div>
						<TextField
								required
								name={`question-comment-${q.id}`}
								placeholder="Comment"
								className={classes.inputComment}
								fullWidth
								multiline
								rowsMax={10}
								type='text'					
								defaultValue={(scores.find(s => s.interview_question_id === q.id) || {}).comment}								
								onChange={(e)=>{
									const scoreArray = [...this.state.scores];
									const scoreIndex = scoreArray.findIndex(s => s.interview_question_id === q.id);
									if(scoreIndex >= 0) scoreArray[scoreIndex].comment = e.target.value;
									else {
											if(roster_profile_id) {
												scoreArray.push({
													interview_question_id: q.id, 
													comment: e.target.value,
													roster_profile_id: roster_profile_id,
													editable: 1,
													score: q.question_type === 'number' ? '' : 0,
												})
											} else {
												scoreArray.push({
												interview_question_id: q.id, 
												comment: e.target.value,
												applicant_id: user_id,
												editable: 1,
												score: q.question_type === 'number' ? '' : 0,
											})
										}
									}
									this.setState({scores: scoreArray}, revalidate)
								}}
								error={!isEmpty(this.state.errors[`question-comment-${q.id}`])}
								disabled={!(isAdmin && this.state.adminValidate) && !canValidate}
								autoFocus
								helperText={errors[`question-comment-${q.id}`]}
							/>
					</div>
					<div className={classes.detailScoreContainer}>
						{q.question_type === 'number' && <>
						<TextField
								required
								id="question"
								name={`question-${q.id}`}
								placeholder="Max"
								className={classes.inputMax}
								fullWidth
								inputProps={{
									max: 5,
									min: 0
								}}
								type='number'					
								autoComplete="interview_address"
								error={!isEmpty(this.state.errors[`question-max-${q.id}`])}
								helperText={errors[`question-max-${q.id}`]}
								value={(scores.find(s => s.interview_question_id === q.id) || {}).score}
								onChange={(e)=>{
									const score = Number.parseInt(e.target.value, 10);
									const scoreArray = [...this.state.scores];
									const scoreIndex = scoreArray.findIndex(s => s.interview_question_id === q.id);
									if(scoreIndex >= 0) scoreArray[scoreIndex].score = e.target.value === '' ? '' : score > 5 ? 5 : score < 0 ? 0 : score;
									else {
										if(!roster_profile_id) {
											scoreArray.push({
												interview_question_id: q.id, 
												score: e.target.value === '' ? '' : score > 5 ? 5 : score < 0 ? 0 : score,
												applicant_id: user_id,
												editable: 1,
												comment: ' '
											})} else  {
												scoreArray.push({
												interview_question_id: q.id, 
												score: e.target.value === '' ? '' : score > 5 ? 5 : score < 0 ? 0 : score,
												roster_profile_id:roster_profile_id,
												editable: 1,
												comment: ' '
											})
										}
									}
									this.setState({scores: scoreArray}, revalidate)
								}}
								disabled={!(isAdmin && this.state.adminValidate) && !canValidate}
								autoFocus
							/>
						<div className={classes.questionContain}>
						    <p className={classes.questionRequiredRight}>*</p>
							<Typography variant='body1' className={classes.scoreSubtotal} color="primary">/5</Typography>
						</div>
						</>}
					</div>
				</div>
				}
				)}

				<div className={classes.details} style={{borderLeftColor: blueInfoColor}}>
					<div style={{width: '90%'}}>
						<div className={classes.questionContain}>
							<Typography
								variant="body1"
								className={classes.detailsText}
							>
								Global Impression
							</Typography>
							<p className={classes.questionRequired}>*</p>
						</div>
						<TextField
								required
								name="question"
								placeholder="My global impression"
								className={classes.inputComment}
								fullWidth
								multiline
								error={!isEmpty(this.state.errors[`global-impression`])}
								helperText={errors[`global-impression`]}
								rowsMax={10}
								type='text'	
								defaultValue={this.state.globalImpression ? this.state.globalImpression.comment : ''}									
								onChange={(e)=>{
									
									if(!roster_profile_id) {
										this.setState({globalImpression: {
												comment: e.target.value,
												manager_id: this.props.manager.id,
												applicant_id: this.props.user_id
											}
										}, revalidate);
									} else {
										this.setState({globalImpression: {
												comment: e.target.value,
												roster_profile_id: roster_profile_id,
												roster_process_id: this.props.roster_process_id,
												manager_user_id: this.props.manager.id,
											}
										}, revalidate);
									}
								}}
								disabled={!(isAdmin && this.state.adminValidate) && !editGLobalImpression}
								autoFocus
							/>
					</div>
				</div>

				{this.state.expanded && <div style={{marginRight: 15, marginLeft: 25, flexWrap: 'wrap', justifyContent: 'center'}}>
				{legends.map(legend => <div style={{display: 'flex', marginRight:20, marginLeft: 0}}> <span style={{height: 5,marginTop: 6, width: 5,borderRadius: 5, backgroundColor: primaryColor}}></span> <Typography style={{marginLeft: 5, fontSize: 12}}> {legend} </Typography></div>)}
				</div>
				}

				<div className={classes.validateContainer}>
					<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
						{(canValidate || (isAdmin && this.state.adminValidate)) && <Button color="primary" variant="contained"  onClick={()=>{
							   if(!this.state.isLoading) {
								scores.filter(s =>(s.interview_question && s.interview_question.user_id === (manager.user_id || manager.id))).length === 0 ? 
								this.addScore(this.props.questions) : 
								this.updateScore();
										}}}> Validate</Button>}
						{(!canValidate && isAdmin && !this.state.adminValidate) && <Button className={classes.btnEnable} color="primary" variant="contained"  onClick={()=>{
							this.setState({alertOpen: true})
						}}> Update comments & scores</Button>}
					</div>
				</div>
			</Collapse>
	    </Card>
	</>
	}
}


JobScore.propTypes = {
   /**
   * manager is an object that contains the hiring manager's data 
   */
	manager: PropTypes.object.isRequired,
   /**
   * questions is an array that contains the questions of a particular hiring manager
   */
    questions: PropTypes.arrayOf(PropTypes.object).isRequired,
   /**
   * scores is an array of object containing the scores of different questions 
   */
    scores: PropTypes.arrayOf(PropTypes.object),
   /**
   * user_id is an integrer that contains an applicant id
   */
	user_id: PropTypes.number.isRequired
};

JobScore.defaultProps = {
    questions: [],
    scores: [],
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */

const styles = (theme) => ({
	cardTitle: {
		fontWeight: 'bold',
		marginTop: '0px',
		paddingBottom: '15px',
        display:  'flex',
		marginLeft: 10
	},
	cardPlusIcon: {
		marginRight: 10,
		fontSize: '26px',
		marginTop: 5,
		cursor: 'pointer'
	},
	noPaddingBottom: {
		'padding-bottom': '0'
	},
	questionHeader: {
		display: 'flex',
		marginTop: '0px',
		marginLeft: -5
	},
	cardMinimizeIcon: {
		marginRight: 10,
		fontSize: '26px',
		marginTop: 5,
		cursor: 'pointer'
	},
	questionContent: {
		paddingLeft: 15,
		paddingRight: 10
	},
	switch: {
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 15,
		marginBottom: 2
	},
	textAction: {
		paddingTop: 8,
		paddingRight: 15
	},
	responseCard: {
		boxShadow: "none",
		marginBottom: 10,
	},
	descriptionContainer: {
		backgroundColor: '#f8f7f7',
		borderRadius: 5,
		marginTop: 0,
		margin: 15
	},
	descriptionItem: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	description: {
		fontSize: 12,
		padding: 10
	},
	details: {
		marginLeft: 20,
		marginRight: 15,
		marginBottom: 10,
		borderRadius: 3,
		borderLeftWidth: 5,
		borderLeftStyle: 'solid',
		marginTop: 10,
		paddingLeft: 8,
		paddingTop: 5,
		paddingBottom: 5,
		display: 'flex',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: 'grey'
	},
	detailsText: {
		fontSize: '16px !important',
		fontWeight: 500,
	},
    questionInput: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 15,
		padding: '0px !important',
    },
	detailIcon: {
		marginLeft: 10
	},
	detailScoreContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		marginRight: 10
	},
	questionInputCardContent: {
		padding: 0,
		paddingTop: 5,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: '10px !important'
	},
	questionBtn: {
		marginTop: 10
	},
	scoreSubtotal: {
		fontWeight: 'bold'
	},
	expandableContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	scoreTitle: {
		fontWeight: 'bold',
		fontSize: 14,
		marginRight: 10,
		paddingTop: 2
	},
	validateContainer: {
		display: 'flex',
		flexDirection: 'row-reverse',
		paddingRight: 15,
		marginBottom: 10
	},
	inputMax: {
		width: '30px',
		marginTop: -5,
		fontWeight: 500,
		textAlign: 'center',
		marginRight: 10
	},
	inputComment: {
		marginTop: 5,
		fontSize: 12,
		fontWeight: 400,
		textAlign: 'right',
		marginBottom: 10,
		width: '95%'
	},
	btnEnable: {
		'background-color': '#0a477e',
		color: '#fff',
		'&:hover': {
		'background-color': blueIMMAPHover
		}
	},
	questionContain: {
		display: 'flex',
		flexDirection: 'row',
	},
	questionRequired: {
		color: 'red',
		fontSize: 14,
		marginTop: 3,
		marginLeft: 2
	},
	questionRequiredRight: {
		color: 'red',
		fontSize: 14,
		marginTop: 3,
		marginRight: 2
	}
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */

 const mapDispatchToProps = {
	getAPI,
	addFlashMessage,
	postAPI,
	deleteAPI,
	putApi
};

const mapStateToProps = (state) => ({
	currentUser: state.auth.user
});


export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobScore)));
