import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MultipleChoice from './MultipleChoice';
import MultipleSelectChoice from './MultipleSelectChoice';
import Essay from './Essay';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import CheckCircle from '@material-ui/icons/CheckCircle';
import SkipNext from '@material-ui/icons/SkipNext';
import Button from '@material-ui/core/Button';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 1,
		paddingBottom: theme.spacing.unit * 1,
		marginTop: 2,
		marginBottom: 2
	},
	progress: {
		paddingTop: theme.spacing.unit * 1,
		paddingBottom: theme.spacing.unit * 1,
		display: 'flex',
		alignItems: 'center'
	},
	back: {
		marginLeft: 8,
		marginRight: 8
	},
	next: {
		marginRight: 8
	},
	skip: {
		marginLeft: 8,
		marginRight: 8
	},
	progressBar: {
		flex: 1
	},
	container: {
		display: 'flex',
		flexDirection: 'column'
	},
	percentage: {
		marginLeft: 8
	}
});

class Quiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datas: [
				{
					type: 'multiple_choice',
					index: 0,
					paragraph: [
						{
							p:
								'An alteration of the well known multiple choices question is multiple true/false. An extended version is shown here: multiple true/false with four independent statements. Here each question contains an introduction and a figure or table. The student has to interpret the information and answer true or false to each of the four independent statements. The focus is on reasoning and creative thinking, and less on memorization and root knowledge.The example below is one of the 98 questions used during the International Biology Olympiad IBO2015 where 75% of all theoretical questions were based on research from the last five years, and about 20% on research from 2015.'
						},
						{ p: 'During IBO2015 the scoring was performed as described below:' },
						{
							p:
								'Each correctly answered question gives you 1 point, i.e. all four statements are correct.'
						}
					],
					choice: [
						{
							variable: 'a',
							value: 'If only three statements in a question are correct, you get 0.6 points.'
						},
						{ variable: 'b', value: 'If only two statements in a question are correct you get 0.2.' },
						{ variable: 'c', value: 'If only one statement in a question is correct you get 0.0.' },
						{
							variable: 'd',
							value: 'If no statements in a question are correct, you do not get any points.'
						}
					]
				},
				{
					type: 'multipe_select_choice',
					index: 1,
					paragraph: [
						{
							p:
								'What is chiefly responsible for the increase in the average length of life in the USA during the last fifty years?'
						}
					],
					choice: [
						{
							variable: 'a',
							value: 'Compulsory health and physical education courses in public schools.'
						},
						{ variable: 'b', value: 'The reduced death rate among infants and young children' },
						{
							variable: 'c',
							value: 'The safety movement, which has greatly reduced the number of deaths from accidents'
						},
						{
							variable: 'd',
							value: 'The substitution of machines for human labor.'
						},
						{
							variable: 'e',
							value: 'No Jutsu.'
						},
						{
							variable: 'f',
							value: 'Hokage 4'
						}
					]
				},
				{
					type: 'essay',
					index: 2,
					paragraph: [
						{
							p:
								'I have been a student at California State University Channel Islands (CI) for 5 semesters, and over the course of my stay I have grown and learned more that I thought possible. I came to this school from Moorpark Community College already knowing that I wanted to be an English teacher; I had taken numerous English courses and though I knew exactly what I was headed for-was I ever wrong. Going through the English program has taught me so much more than stuff about literature and language, it has taught me how to be me. I have learned here how to write and express myself, how to think for myself, and how to find the answers to the things that I don`t know. Most importantly I have learned how important literature and language are.'
						},
						{
							p:
								'When I started at CI, I thought I was going to spend the next 3 years reading classics, discussing them and then writing about them. That was what I did in community college English courses, so I didn`t think it would be much different here. On the surface, to an outsider, I am sure that this is what it appears that C.I. English majors do. In most all my classes I did read, discuss, and write papers; however, I quickly found out that that there was so much more to it. One specific experience I had while at C.I. really shows how integrated this learning is. Instead of writing a paper for my final project in Perspectives of Multicultural Literature (ENGL 449), I decided with a friend to venture to an Indian reservation and compare it to a book we read by Sherman Alexie. We had a great time and we learned so much more that we ever could have done from writing a paper. The opportunity to do that showed me that there are so many ways that one can learn that are both fun and educational.'
						}
					]
				}
			],
			selectedIndex: null,
			completed: 0,
			perStepComplete: 0,
			showQuiz: 0,
			selected: {},
			essay: ''
		};
		this.handleChangeMultipleChoice = this.handleChangeMultipleChoice.bind(this);
		this.handleChangeMultipleSelectChoice = this.handleChangeMultipleSelectChoice.bind(this);
		this.showQuestion = this.showQuestion.bind(this);
		this.handleSkip = this.handleSkip.bind(this);
		this.handleBack = this.handleBack.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.handleFinish = this.handleFinish.bind(this);
		this.percentCompleted = this.percentCompleted.bind(this);
	}

	componentDidMount() {
		let { datas } = this.state;
		this.setState(
			{
				perStepComplete: 100 / datas.length
			},
			() => this.percentCompleted()
		);
	}

	percentCompleted() {
		let { showQuiz, perStepComplete } = this.state;
		this.setState({ completed: perStepComplete * (showQuiz + 1) });
	}

	handleChangeMultipleChoice(event, index) {
		this.setState({ selectedIndex: index });
	}

	handleChangeMultipleSelectChoice(name, event) {}

	onChangeEssay(e) {
		this.setState({
			essay: e.target.value
		});
	}

	showQuestion() {
		let { datas, showQuiz, selectedIndex, selected, essay } = this.state;
		let data = datas.filter((res) => {
			return res.index === showQuiz;
		});
		if (data[0].type === 'multiple_choice') {
			return (
				<MultipleChoice
					handleChange={this.handleChangeMultipleChoice}
					paragraph={data[0].paragraph}
					choice={data[0].choice}
					selectedIndex={selectedIndex}
				/>
			);
		} else if (data[0].type === 'multipe_select_choice') {
			return (
				<MultipleSelectChoice
					handleChange={this.handleChangeMultipleSelectChoice}
					paragraph={data[0].paragraph}
					choice={data[0].choice}
					selected={selected}
				/>
			);
		} else if (data[0].type === 'essay') {
			return <Essay paragraph={data[0].paragraph} onChange={this.onChangeEssay} value={essay} />;
		}
	}
	handleSkip() {
		this.setState({ showQuiz: this.state.showQuiz + 1 });
	}
	handleBack() {
		this.setState({ showQuiz: this.state.showQuiz - 1 }, () => this.percentCompleted());
	}
	handleNext() {
		this.setState({ showQuiz: this.state.showQuiz + 1 }, () => this.percentCompleted());
	}
	handleFinish() {
		alert('finish');
	}
	render() {
		const { classes } = this.props;
		let { completed, showQuiz, datas } = this.state;
		return (
			<div className={classes.container}>
				<Paper className={classes.root} elevation={1}>
					<Typography className={classes.capitalize} variant="h6" gutterBottom>
						Question : {showQuiz + 1}
					</Typography>
				</Paper>
				{this.showQuestion()}
				<Paper className={classes.progress} elevation={1}>
					<Button
						variant="contained"
						color="secondary"
						className={classes.back}
						onClick={this.handleBack}
						disabled={showQuiz <= 0}
					>
						<ArrowBack />
						Back
					</Button>
					<LinearProgress
						className={classes.progressBar}
						color="primary"
						variant="determinate"
						value={completed}
					/>
					<Typography variant="subtitle1" gutterBottom className={classes.percentage}>
						{Math.round(completed)}%
					</Typography>
					<Button
						variant="contained"
						color="secondary"
						className={classes.skip}
						onClick={this.handleSkip}
						disabled={showQuiz === datas.length - 1}
					>
						Skip
						<SkipNext />
					</Button>
					{showQuiz === datas.length - 1 ? (
						<Button
							variant="contained"
							color="primary"
							className={classes.next}
							onClick={this.handleFinish}
						>
							Finish
							<CheckCircle />
						</Button>
					) : (
						<Button variant="contained" color="primary" className={classes.next} onClick={this.handleNext}>
							Next Question
							<ArrowForward />
						</Button>
					)}
				</Paper>
			</div>
		);
	}
}

export default withStyles(styles)(Quiz);
