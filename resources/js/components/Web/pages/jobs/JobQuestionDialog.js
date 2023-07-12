/** import React */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

/** import Material UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import withWidth from '@material-ui/core/withWidth';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

/** import custom components */
import JobQuestion from "./JobQuestion"

/** import React Redux and it's actions */
import { getAPI, postAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { connect } from 'react-redux';

/** import Configs */
import { white } from '../../config/colors';
import { can } from '../../permissions/can';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
  
	return result;
  };
  
  const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	// styles we need to apply on draggables
	...draggableStyle
  });
  
  const getListStyle = isDraggingOver => ({
	//background: isDraggingOver ? "lightblue" : "lightgrey",
  });

/**
 * Component that shows the job question dialog.
 *
 *
 * Permission: -
 *
 * @component
 * @name JobQuestionDialog
 * @category Page
 * @subcategory JobInterviewQuestion
 * @example
 * return (
 *    <JobQuestionDialog
 * 		setSelectedJobID={()=>{}} />
 * )
 *
 */

class JobQuestionDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
			nonEditableQuestionsCount: 0,
			notificationText: '',
			actionEnableEdit: false,
			btnLoading: false,
			canAddQuestion:  false,
			modified: false,
		}
		this.getQuestions = this.getQuestions.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
		this.deleteQuestion = this.deleteQuestion.bind(this);
		this.updateQuestion = this.updateQuestion.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
	}

   /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.getQuestions();
	}

   /**
   * getQuestions is a function that's called to fetch the interview questions for the job
   */
	getQuestions(){
		let url = '/api/job-interview-questions/'+this.props.jobID;
		if(this.props.rosterID) url = '/api/job-interview-questions-roster/'+this.props.rosterProfileID;
		this.props.getAPI(url).then((res) => {
		  if(res.data.data.questions[0]) {
			let questionList = res.data.data.questions[0].interview_questions || [];
			questionList = questionList.sort((a,b) => (a.id  - b.id));
			let managerList = res.data.data.questions[0].job_manager || [];
			if(this.props.rosterID) managerList = res.data.data.managers.map(m => ({
				name: m.label,
				user_id: m.id
			}));
			let questions = managerList.map(r => {
				return {...r, interview_questions : questionList.filter(q => q.user_id === r.user_id)}
			})
			if(res.data.data.questions[0].interview_order || (res.data.data.profileProcess && res.data.data.profileProcess.interview_order)) {
				const oldQuestions = questions;
				questions = (res.data.data.questions[0].interview_order || res.data.data.profileProcess.interview_order).split(',').map(o => questions.find(q => q.user_id.toString() === o ));
				questions = questions.filter(q => q);
				if(questions.length < oldQuestions.length) {
					const notInArray = oldQuestions.filter(o => !questions.find(q => q.user_id === o.user_id));
					questions = [...questions, ...notInArray];
				}
			}
			this.setState({questions, 
				earliestInterview: res.data.data.earliestInterview,
				nonEditableQuestionsCount: res.data.data.nonEditableQuestionsCount,
				canAddQuestion: res.data.data.canAddQuestion,
			})
		  }
		}).catch((err) => {
		  this.props.addFlashMessage({
			type: 'error',
			text: 'There is an error while getting the job questions'
		  });
		});
	}

   /**
   * addQuestion is a function that's called to add an interview question to the job
   * @param {object} questionData - The question data to be added
   * @return {object} - The added question data
   */
	addQuestion(questionData) {
		return this.props.postAPI('/api/job-interview-questions/', questionData).then((res) => {
		  const index = this.state.questions.findIndex(q => q.user_id === questionData.user_id)
		  const newQuestionData = this.state.questions;
		  newQuestionData[index].interview_questions.push(res.data.data);
		  this.setState({questions: newQuestionData, modified: true});
		  this.props.addFlashMessage({
			type: 'success',
			text: 'Success'
		  });
		}).catch((err) => {
		  this.props.addFlashMessage({
			type: 'error',
			text: 'There is an error while adding the job questions'
		  });
		});
	}

   /**
   * updateQuestion is a function that's called to update an interview question to the job
   * @param {object} questionData - The question data to be updated
   * @param {string} questionId - The question id to be updated
   * @param {number} jobId - The question index in interview question array
   * @return {object} - The updated question data
   */
	updateQuestion(questionData, questionID, questionIndex) {
		return this.props.postAPI('/api/job-interview-questions/'+questionID, questionData).then((res) => {
		  const index = this.state.questions.findIndex(q => q.user_id === questionData.user_id)
		  const newQuestionData = this.state.questions;
		  newQuestionData[index].interview_questions[questionIndex].question = questionData.question;
		  this.setState({questions: newQuestionData, modified: true});
		  this.props.addFlashMessage({
			type: 'success',
			text: 'Success'
		  });
		}).catch((err) => {
		  this.props.addFlashMessage({
			type: 'error',
			text: 'There is an error while updating the job questions'
		  });
		});
	}

   /**
   * enableEdition is a function that's called to enable the edit mode for the interview question
   */

	enableEdition() {
		if(moment(this.state.earliestInterview[0].interview_date) < moment.now()) {
			this.setState({notificationText: `Past interview found for the candidate 
			${this.state.earliestInterview[0].user ? this.state.earliestInterview[0].user.full_name : ''} : ${this.state.earliestInterview[0].interview_date}`});
		} else {
			let data = {jobId: this.props.jobID};
			if(this.props.rosterID) data = {rosterProcessID: this.props.rosterID, rosterProfileID: this.props.rosterProfileID};
			this.props.postAPI('/api/job-interview-questions/edit/enable', data).then((res) => {
				const questions = this.state.questions.map(q => ({...q,
					interview_questions: q.interview_questions.map(iq => ({...iq, editable: 1})) }));
				this.setState({nonEditableQuestionsCount: 0, notificationText: '', questions});
				this.props.addFlashMessage({
				  type: 'success',
				  text: 'The questions are editable'
				});
			  }).catch((err) => {
				this.props.addFlashMessage({
				  type: 'error',
				  text: 'There is an error while updating the job questions'
				});
			  });
		}

	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
		  return;
		}
	
		const items = reorder(
		  this.state.questions,
		  result.source.index,
		  result.destination.index
		);
		this.setState({
			questions: items,
		});
		if(this.props.jobID) {
			this.props.postAPI('/api/jobs/change_interview_order', {
				job_id: this.props.jobID,
				interview_order: items.map(i => i.user_id).join(',')
			})
		} else {
			this.props.postAPI('/api/job-interview-questions/roster-process/change_interview_order', {
				roster_profile_id: this.props.rosterProfileID,
				interview_order: items.map(i => i.user_id).join(',')
			})
		}
	  }

   /**
   * deleteQuestion is a function that's called to delete an interview question to the job
   * @param {object} questionData - The question data to be deleted
   * @param {string} questionId - The question id to be deleted
   * @param {number} questionIndex - The question index in interview question array
   * @return {object} - The deleted question data
   */
  
	deleteQuestion(questionData, questionID, questionIndex) {
		return this.props.deleteAPI('/api/job-interview-questions/'+questionID, {question: questionData.question}).then((res) => {
			const index = this.state.questions.findIndex(q => q.user_id === questionData.user_id)
		  const newQuestionData = this.state.questions;
		  newQuestionData[index].interview_questions.splice(questionIndex, 1);
		  this.setState({questions: newQuestionData, modified: true});
		  this.props.addFlashMessage({
			type: 'success',
			text: 'Success'
		  });
		}).catch((err) => {
		  this.props.addFlashMessage({
			type: 'error',
			text: 'There is an error while getting the job questions'
		  });
		});
	}

   /**
   * render is a function that's called to render the component
   */

	render() {
		const { classes, currentUser } = this.props;
		const isAdmin = can('Set as Admin') && currentUser.isIMMAPER;
		let canAdd = this.state.canAddQuestion;

		

		return <div>
			 {this.state.notificationText && <Dialog
			 	open
				aria-labelledby="alert-dialog-title"
				fullWidth={true}
				maxWidth="md"
				disableEnforceFocus
			 >
				 <DialogTitle  id="scroll-dialog-title">Error</DialogTitle>
				 <DialogContent className={scroll === 'body' ? classes.overflowVisible : null} >
					<Typography variant="body1"> {this.state.notificationText} </Typography>
				 </DialogContent>
				 <DialogActions>
				    <Button  color="primary" variant="contained" autoFocus onClick={()=>{
						this.enableEdition();
					}}>
						PROCEED
					</Button>
						
					<Button  color="secondary" variant="contained" autoFocus onClick={()=>{
						this.setState({notificationText: ''})
					}}>
						close
					</Button>
				</DialogActions>
			 </Dialog>}
			<Dialog
				open={true}
				onClose={()=>{
				    if(this.props.setSelectedJobID)	this.props.setSelectedJobID(0)
					if(this.props.setSelectedRosterID) this.props.setSelectedRosterID(0);
					if(this.props.reloadProfiles && this.state.modified) {
							this.props.reloadProfiles();
					}
				}}
				aria-labelledby="alert-dialog-title"
				fullWidth={true}
				disableEnforceFocus
				maxWidth="md"
				PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle  id="scroll-dialog-title">
					<div className={classes.dialogTitle}> 
						<Typography variant="h5" > Interview questions </Typography>
						{(this.state.nonEditableQuestionsCount > 0 && isAdmin) && <Button color="primary" variant="contained" 
							onClick={()=>{
								this.setState({notificationText: `To edit the questions again, all past interviews must be scheduled in a future date. The current date is: ${this.state.earliestInterview[0].interview_date}`})
							}}
						>Enable Edit</Button>}
					</div>
				</DialogTitle>
				<DialogContent className={scroll === 'body' ? classes.overflowVisible : null} >
				<DragDropContext onDragEnd={this.onDragEnd}>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => {
							return <div
								{...provided.droppableProps}
								ref={provided.innerRef}
								style={getListStyle(snapshot.isDraggingOver)}
							    >
								{ this.state.questions.map((q, index) => (
								<Draggable key={index} draggableId={`${index}-draggable`} index={index}>
									{(provided1, snapshot1) => {
									return <div ref={provided1.innerRef}
										{...provided1.draggableProps}
										{...provided1.dragHandleProps}
										style={getItemStyle(
											snapshot1.isDragging,
											provided1.draggableProps.style
										)}
									>
									<JobQuestion roster_profile_id={this.props.rosterProfileID} canAdd={canAdd} isAdmin={isAdmin} ownQuestions={currentUser.data.id === q.user_id} job_id={this.props.jobID} roster_id={this.props.rosterID} user_id={q.user_id} updateQuestion={this.updateQuestion} deleteQuestion={this.deleteQuestion} addQuestion={this.addQuestion} key={q.id} name={q.name} questions={q.interview_questions} />
									</div>}}
								</Draggable>)) }
							</div>}
						}
					</Droppable>
				</DragDropContext>
				</DialogContent>
				<DialogActions>
						
					<Button  color="primary" variant="contained" autoFocus onClick={()=>{
						if(this.props.setSelectedJobID)	this.props.setSelectedJobID(0)
						if(this.props.setSelectedRosterID) this.props.setSelectedRosterID(0);
						if(this.props.reloadProfiles && this.state.modified) {
							this.props.reloadProfiles();
						}
					}}>
						close
					</Button>
				</DialogActions>
			</Dialog>
			</div>
	}
}

JobQuestionDialog.propTypes = {
   /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   *
   * (see the source file to see more information about the styles)
   */
	classes: PropTypes.object,
   /**
   * setSelectedJobID is a function that is used to define the selected job Id for which the dialog is shown
   */
	setSelectedJobID: PropTypes.func.isRequired,
	/* setSelectedRosterID is a function that is used to define the selected roster Id for which the dialog is shown
	*/
	setSelectedRosterID: PropTypes.func.isRequired,
   /**
   * currentUser is an object that contains the details of the current looged in user
   */
	currentUser: PropTypes.object,
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */

const styles = (theme) => ({
	block: {
		display: 'block !important',
		textAlign: 'center',
		margin: '0 auto'
	},
	noTextDecoration: {
		'text-decoration': 'none'
	},
	acceptBtn: {
		background: '#FB0000',
    marginTop: '8px',
		color: white,
		'box-shadow': 'none',
		'-webkit-font-smoothing': 'auto',
		'&:hover': {
			background: '#E50000'
		}
	},
	declineBtn: {
		marginRight: '4px',
		// color: 'rgba(255,255,255,0.8)',
		color: '#ffdddd',
		'-webkit-font-smoothing': 'auto',
		'&:hover': {
			background: 'transparent',
			textDecoration: 'underline'
		}
	},
    label: {
		color: white
	},
	cardTitle: {
		fontWeight: 'bold',
		marginTop: '0px',
		paddingBottom: '15px',
		
	},
	cardPlusIcon: {
		marginRight: 10,
		fontSize: '22px',
		marginTop: 2,
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
		fontSize: '22px',
		marginTop: -5,
		cursor: 'pointer'
	},
	dialogTitle: {
		display: 'flex',
		justifyContent: 'space-between'
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
	deleteAPI
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */

const mapStateToProps = (state) => ({
	currentUser: state.auth.user
  });

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobQuestionDialog)));
