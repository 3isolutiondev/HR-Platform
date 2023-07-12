/** import React */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { Card, CardHeader, Collapse, CardContent } from '@material-ui/core'
import { Delete, Edit, ExpandLess, ExpandMore } from '@material-ui/icons'
import { TextField, Button } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

/** import Configs */
import {
	primaryColor,
} from '../../config/colors';


/**
 * Component that shows a single job question card.
 *
 *
 * Permission: -
 *
 * @component
 * @name JobQuestion
 * @category Page
 * @subcategory JobInterviewQuestion
 * @example
 * return (
 * 	  <JobQuestion 
 * 		canAdd={canAdd} 
 * 		ownQuestions={currentUser.data.id === q.user_id} 
 * 		job_manager_id={q.id} 
 * 		updateQuestion={this.updateQuestion} 
 * 		deleteQuestion={this.deleteQuestion} 
 * 		addQuestion={this.addQuestion} 
 * 		key={q.id} 
 * 		name={q.name} 
 * 		questions={q.interview_questions} />
 * )
 *
 */

class JobQuestion extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			questionText: '',
			edit: -1,
			questionType: ''
		}

		this.addQuestion = this.addQuestion.bind(this)
		this.updateQuestion = this.updateQuestion.bind(this)
	}
   /**
   * addQuestion a function that adds a new question to the job.
   */
	addQuestion(){
		const question = {
			user_id: this.props.user_id,
			question: this.state.questionText,
			question_type: this.state.questionType
		}
		if(this.props.job_id) question['job_id'] = this.props.job_id;
		if(this.props.roster_id) {
			question['roster_process_id'] = this.props.roster_id;
			question['roster_profile_id'] = this.props.roster_profile_id;
		}
		if(this.props.isAdmin) question['editable'] = 0;
		this.props.addQuestion(question).then(res => {
			this.setState({questionText: '', edit: -1, questionType: ''})
		}).catch(err =>{

		})
	}

   /**
   * updateQuestion a function that updates the question.
   */

	updateQuestion(){
		const question = {
			user_id: this.props.questions[this.state.edit].user_id,
			question: this.state.questionText,	
			question_type: this.state.questionType
		};
		if(this.props.job_id) question['job_id'] = this.props.questions[this.state.edit].job_id;
		if(this.props.roster_id) {
			question['roster_id'] = this.props.questions[this.state.edit].roster_id;
			question['roster_profile_id'] = this.props.questions[this.state.edit].roster_profile_id;
		}

		this.props.updateQuestion(question, this.props.questions[this.state.edit].id,this.state.edit).then(res => {
			this.setState({questionText: '', edit: -1, questionType: ''})
		}).catch(err =>{

		})
	}

   /**
   * render a function that renders the component.
   */
	render() {
        const { classes, name, questions, ownQuestions } = this.props;
		return <>
		<Card className={classes.responseCard} variant="outline" >
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
							 {name}
						</Typography>
					</div>
				}
				className={classes.noPaddingBottom}
				action={!this.state.expanded ? <ExpandMore rotate='30' className={classes.cardPlusIcon} onClick={()=>{this.setState({expanded: !this.state.expanded})}}  /> :
				 <ExpandLess  className={classes.cardMinimizeIcon} onClick={()=>{this.setState({expanded: !this.state.expanded})}}  />
				}        	
			/>
			<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                {(this.props.canAdd || this.props.isAdmin) && <Card className={classes.questionInput}>
					{(ownQuestions || this.props.isAdmin) && <CardContent className={classes.questionInputCardContent}>
						<TextField
								required
								id="question"
								name="question"
								label="Add a new question here"
								fullWidth
								multiline
								rowsMax={4}
								autoComplete="interview_address"
								value={this.state.questionText}
								onChange={(e)=>{
									this.setState({questionText: e.target.value})
								}}
								disabled={(questions.length >= 4 && this.state.edit < 0)}
								autoFocus
							/>
						{this.state.questionText.length > 0 && <Grid container spacing={16}>
						    <Grid item xs={12} className={classes.question_container} md={4}>
								<FormGroup style={{ marginTop: '8px' }}>
									<FormLabel style={{marginRight: 15}}>Does this question require scoring ?</FormLabel>
									<RadioGroup
										value={this.state.questionType}
										onChange={(e) =>
											this.setState({
												questionType: e.target.value
											})}
										className={classes.radioContainer}
									>
										<FormControlLabel value="number" className={classes.radio} control={<Radio />} label="Yes" />
										<FormControlLabel value="text" className={classes.radio} control={<Radio />} label="No" />
									</RadioGroup>
								</FormGroup>
							</Grid>
							<Grid item xs={12} md={6} style={{marginTop: 15}}>
								{(this.state.questionText.length > 0 && this.state.questionType.length > 0) && <div className={classes.questionBtn}>
									<Button color="primary" variant="contained"  onClick={()=>{
										this.state.edit < 0 ? 
										this.addQuestion() : 
										this.updateQuestion()
									}}> OK</Button>
									<Button color="secondary"  onClick={()=>{this.setState({
										edit: 0,
										questionText: ''
									})}}>Cancel</Button>
								</div>}
							</Grid>
						</Grid>}
						{(questions.length >= 4 && this.state.edit < 0) && <Typography color="primary" variant="body1">
							The max number of questions has been reached
							</Typography>}
					</CardContent>}
				</Card>}
				{questions.map((q, index) => <>
				<div className={classes.details} style={{borderLeftColor: primaryColor}}>
					<Typography
						variant="body1"
						className={classes.detailsText}
					>
						{q.question}
					</Typography>
					{((q.editable === 1 && ownQuestions) || this.props.isAdmin) && <>
						<div className={classes.detailIconContainer}>
							<Edit onClick={()=>{
								this.setState({
									edit: index,
									questionText: q.question,
									questionType: q.question_type
								})
							}} fontSize='small' className={classes.detailIcon} />
							<Delete onClick={()=>{
								this.props.deleteQuestion(q, q.id, index)
							}} fontSize='small' className={classes.detailIcon} color="primary" />
						</div>
						</>
					}
				</div>
				</>
				)}
			</Collapse>
	    </Card>
	</>
	}
}


JobQuestion.propTypes = {
   /**
   * name is a string that contains the hiring manager's name  
   */
	name: PropTypes.string.isRequired,
   /**
   * isEditable is a bool that specifies if the question of a particular hiring manager can be edited
   */
    isEditable: PropTypes.bool,
   /**
   * questions is an array of string 
   */
    questions: PropTypes.arrayOf(PropTypes.string),
   /**
   * canAdd is a bool that specifies if the user is allowed to add new questions 
   */
	canAdd: PropTypes.bool,
};

JobQuestion.defaultProps = {
    isEditable: true,
    questions: [],
	canAdd: false
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
		cursor: 'pointer',
		zIndex: 1,
		padding: '10px'
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
		cursor: 'pointer',
		zIndex: 1,
		padding: '10px'
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
		justifyContent: 'space-between'
	},
	detailsText: {
		fontSize: 14,
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
	detailIconContainer: {
		display: 'flex',
		justifyContent: 'space-between'
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
	question_container: {
		marginTop: 10
	},
	radioContainer: {
		flexDirection: 'row !important',
		marginTop: -5,
	}
});

export default withWidth()(withStyles(styles)(JobQuestion)); 
