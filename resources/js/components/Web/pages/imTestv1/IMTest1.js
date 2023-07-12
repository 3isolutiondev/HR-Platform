import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import classnames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import CardContent from '@material-ui/core/CardContent';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { primaryColor, white } from '../../config/colors';
import WysiwygField from '../../common/formFields/WysiwygField';
import isEmpty from '../../validations/common/isEmpty';
import DropzoneFileField from '../../common/formFields/DropzoneFileField';

import { onChangeStep, isValid, onUpload, onDelete } from '../../redux/actions/imtest/imtestActions';
import {
	imTestFile_DatasetURL,
	imTestFile_DatasetFileCollection,
	acceptedDocFiles,
	imTestFile_DatasetDeleteFileURL
} from '../../config/general';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	title: {
		color: primaryColor
	},
	editContainer: {
		position: 'absolute',
		right: 50
	},
	root: {
		width: '100%'
	},
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
		marginBottom: 45
	},
	backButton: {
		marginRight: theme.spacing.unit
	},
	instructions: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit
	},

	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	addMarginTop: {
		'margin-top': '0.5em'
	},
	btnChoose: {
		width: 'max-content'
	},
	timmer: {
		fontWeight: 'bold',
		position: 'fixed',
		right: '50%',
		bottom: 0

		// top: 90
	},
	active: {
		backgroundColor: primaryColor,
		color: white
	},
	addMarginBottom: {
		'margin-bottom': '0.5em'
	}
});
class IMTest1 extends Component {
	componentDidMount() {
		this.props.isValid(2);
		// this.props.isValid('answer');
	}
	componentDidUpdate(prevProps) {
		// const currentDashboardIMTest = JSON.stringify(this.props.imtest.step2);
		// const prevDashboardIMTest = JSON.stringify(prevProps.imtest.step2);
		// if (currentDashboardIMTest !== prevDashboardIMTest) {
		// 	this.props.isValid(2);
		// }

		if (this.props.imtest.step2 !== prevProps.imtest.step2) {
			this.props.isValid(2);
		}
	}
	render() {
		let { text1, text2, title, questions, text3, file_dataset1, file_dataset2 } = this.props.imtest.step2;
		let { errors } = this.props.imtest;

		const { onUpload, onDelete, onChangeStep, isEdit, isAdd, classes, margin, fullWidth } = this.props;
		return (
			<Grid container spacing={24}>
				{isEdit || isAdd ? (
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<TextField
								required
								id="Title"
								name="title"
								label="Title"
								fullWidth
								value={title}
								autoComplete="title"
								onChange={(e) => onChangeStep('step2', e.target.name, e.target.value)}
								error={!isEmpty(errors.title)}
								helperText={errors.title}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<WysiwygField
								withColor={true}
								label="Body"
								margin="dense"
								name="text1"
								value={text1}
								onChange={(e) => onChangeStep('step2', e.target.name, e.target.value)}
								error={errors.text1}
							/>
						</Grid>
						<Grid item>
							<DropzoneFileField
								name="file_dataset1"
								label="Dataset 1"
								onUpload={(name, data) => onUpload(name, data, 'step2')}
								onDelete={(name, apiUrl, data, deleteId) =>
									onDelete(name, apiUrl, data, deleteId, 'step2', file_dataset1.model_id)}
								collectionName={imTestFile_DatasetFileCollection + '1'}
								apiURL={imTestFile_DatasetURL}
								deleteAPIURL={imTestFile_DatasetDeleteFileURL}
								isUpdate={false}
								filesLimit={1}
								acceptedFiles={acceptedDocFiles}
								gallery_files={!isEmpty(file_dataset1) ? [ file_dataset1 ] : []}
								error={errors.file_dataset1}
								fullWidth={false}
							/>
						</Grid>
						<Grid item>
							<DropzoneFileField
								name="file_dataset2"
								label="Dataset 2"
								onUpload={(name, data) => onUpload(name, data, 'step2')}
								onDelete={(name, apiUrl, data, deleteId) =>
									onDelete(name, apiUrl, data, deleteId, 'step2', file_dataset2.model_id)}
								collectionName={imTestFile_DatasetFileCollection + '2'}
								apiURL={imTestFile_DatasetURL}
								deleteAPIURL={imTestFile_DatasetDeleteFileURL}
								isUpdate={false}
								filesLimit={1}
								acceptedFiles={acceptedDocFiles}
								gallery_files={!isEmpty(file_dataset2) ? [ file_dataset2 ] : []}
								error={errors.file_dataset2}
								fullWidth={false}
							/>
						</Grid>
						<Grid item xs={12}>
							<WysiwygField
								withColor={true}
								label="Title"
								margin="dense"
								name="text2"
								value={text2}
								onChange={(e) => onChangeStep('step2', e.target.name, e.target.value)}
								error={errors.text2}
							/>
						</Grid>
						<Grid item xs={12}>
							<Card>
								<CardContent>
									<Grid container spacing={16}>
										<Grid item xs={12}>
											<TextField
												required
												fullWidth
												id="question1"
												label="Question 1"
												margin="normal"
												name="question1"
												value={questions[0].question}
												onChange={(e) => {
													questions[0]['question'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.question1)}
												helperText={errors.question1}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												name="choiceA"
												id="choiceA"
												label="Answer A"
												margin="normal"
												value={questions[0].answer[0].choice}
												onChange={(e) => {
													questions[0]['answer'][0]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice0A)}
												helperText={errors.choice0A}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[0].answer[0].true_false}
														onChange={(e) => {
															questions[0]['answer'][0]['true_false'] = true;
															questions[0]['answer'][1]['true_false'] = false;
															questions[0]['answer'][2]['true_false'] = false;
															questions[0]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[0].answer[0].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[0].true_false ? 'True' : ''}
											/>
										</Grid>

										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer B"
												margin="normal"
												value={questions[0].answer[1].choice}
												onChange={(e) => {
													questions[0]['answer'][1]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice0B)}
												helperText={errors.choice0B}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[0].answer[1].true_false}
														onChange={(e) => {
															questions[0]['answer'][0]['true_false'] = false;
															questions[0]['answer'][1]['true_false'] = true;
															questions[0]['answer'][2]['true_false'] = false;
															questions[0]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[0].answer[1].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[1].true_false ? 'True' : ''}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer C"
												margin="normal"
												value={questions[0].answer[2].choice}
												onChange={(e) => {
													questions[0]['answer'][2]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice0C)}
												helperText={errors.choice0C}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[0].answer[2].true_false}
														onChange={(e) => {
															questions[0]['answer'][0]['true_false'] = false;
															questions[0]['answer'][1]['true_false'] = false;
															questions[0]['answer'][2]['true_false'] = true;
															questions[0]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[0].answer[2].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[2].true_false ? 'True' : ''}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer D"
												margin="normal"
												value={questions[0].answer[3].choice}
												onChange={(e) => {
													questions[0]['answer'][3]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice0D)}
												helperText={errors.choice0D}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[0].answer[3].true_false}
														onChange={(e) => {
															questions[0]['answer'][0]['true_false'] = false;
															questions[0]['answer'][1]['true_false'] = false;
															questions[0]['answer'][2]['true_false'] = false;
															questions[0]['answer'][3]['true_false'] = true;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[0].answer[3].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[3].true_false ? 'True' : ''}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12}>
							<Card>
								<CardContent>
									<Grid container spacing={16}>
										<Grid item xs={12}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Question 2"
												margin="normal"
												value={questions[1].question}
												onChange={(e) => {
													// let temp = (questions[1]['question'] = e.target.value);
													// let tempSpread = { ...questions, temp };
													// onChangeStep('step2', 'questions', tempSpread);
													questions[1]['question'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.question2)}
												helperText={errors.question2}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer A"
												margin="normal"
												value={questions[1].answer[0].choice}
												onChange={(e) => {
													questions[1]['answer'][0]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice1A)}
												helperText={errors.choice1A}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[1].answer[0].true_false}
														onChange={(e) => {
															questions[1]['answer'][0]['true_false'] = true;
															questions[1]['answer'][1]['true_false'] = false;
															questions[1]['answer'][2]['true_false'] = false;
															questions[1]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[1].answer[0].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[0].true_false ? 'True' : ''}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer B"
												margin="normal"
												value={questions[1].answer[1].choice}
												onChange={(e) => {
													questions[1]['answer'][1]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice1B)}
												helperText={errors.choice1B}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[1].answer[1].true_false}
														onChange={(e) => {
															questions[1]['answer'][0]['true_false'] = false;
															questions[1]['answer'][1]['true_false'] = true;
															questions[1]['answer'][2]['true_false'] = false;
															questions[1]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[1].answer[1].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[0].true_false ? 'True' : ''}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer C"
												margin="normal"
												value={questions[1].answer[2].choice}
												onChange={(e) => {
													questions[1]['answer'][2]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice1C)}
												helperText={errors.choice1C}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[1].answer[2].true_false}
														onChange={(e) => {
															questions[1]['answer'][0]['true_false'] = false;
															questions[1]['answer'][1]['true_false'] = false;
															questions[1]['answer'][2]['true_false'] = true;
															questions[1]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[1].answer[2].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[0].true_false ? 'True' : ''}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer D"
												margin="normal"
												value={questions[1].answer[3].choice}
												onChange={(e) => {
													questions[1]['answer'][3]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice1D)}
												helperText={errors.choice1D}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[1].answer[3].true_false}
														onChange={(e) => {
															questions[1]['answer'][0]['true_false'] = false;
															questions[1]['answer'][1]['true_false'] = false;
															questions[1]['answer'][2]['true_false'] = false;
															questions[1]['answer'][3]['true_false'] = true;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[1].answer[3].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[0].true_false ? 'True' : ''}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12}>
							<Card>
								<CardContent>
									<Grid container spacing={16}>
										<Grid item xs={12}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Question 3"
												margin="normal"
												value={questions[2].question}
												onChange={(e) => {
													// let temp = (questions[2]['question'] = e.target.value);
													// let tempSpread = { ...questions, temp };
													// onChangeStep('step2', 'questions', tempSpread);
													questions[2]['question'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.question3)}
												helperText={errors.question3}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer A"
												margin="normal"
												value={questions[2].answer[0].choice}
												onChange={(e) => {
													questions[2]['answer'][0]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice2A)}
												helperText={errors.choice2A}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[2].answer[0].true_false}
														onChange={(e) => {
															questions[2]['answer'][0]['true_false'] = true;
															questions[2]['answer'][1]['true_false'] = false;
															questions[2]['answer'][2]['true_false'] = false;
															questions[2]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[2].answer[0].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[0].true_false ? 'True' : ''}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer B"
												margin="normal"
												value={questions[2].answer[1].choice}
												onChange={(e) => {
													questions[2]['answer'][1]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice2B)}
												helperText={errors.choice2B}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[2].answer[1].true_false}
														onChange={(e) => {
															questions[2]['answer'][0]['true_false'] = false;
															questions[2]['answer'][1]['true_false'] = true;
															questions[2]['answer'][2]['true_false'] = false;
															questions[2]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[2].answer[1].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[0].true_false ? 'True' : ''}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer C"
												margin="normal"
												value={questions[2].answer[2].choice}
												onChange={(e) => {
													questions[2]['answer'][2]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice2C)}
												helperText={errors.choice2C}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[2].answer[2].true_false}
														onChange={(e) => {
															questions[2]['answer'][0]['true_false'] = false;
															questions[2]['answer'][1]['true_false'] = false;
															questions[2]['answer'][2]['true_false'] = true;
															questions[2]['answer'][3]['true_false'] = false;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[0].answer[0].true_false)}
														color="primary"
													/>
												}
												label={questions[2].answer[2].true_false ? 'True' : ''}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												required
												fullWidth
												id="standard-required"
												label="Answer D"
												margin="normal"
												value={questions[2].answer[3].choice}
												onChange={(e) => {
													questions[2]['answer'][3]['choice'] = e.target.value;
													onChangeStep('step2', 'questions', questions);
												}}
												error={!isEmpty(errors.choice2D)}
												helperText={errors.choice2D}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={questions[2].answer[3].true_false}
														onChange={(e) => {
															questions[2]['answer'][0]['true_false'] = false;
															questions[2]['answer'][1]['true_false'] = false;
															questions[2]['answer'][2]['true_false'] = false;
															questions[2]['answer'][3]['true_false'] = true;
															onChangeStep('step2', 'questions', questions);
														}}
														value={toString(questions[2].answer[3].true_false)}
														color="primary"
													/>
												}
												label={questions[0].answer[0].true_false ? 'True' : ''}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12}>
							<WysiwygField
								withColor={true}
								label="Information"
								margin="dense"
								name="text3"
								value={text3}
								onChange={(e) => onChangeStep('step2', e.target.name, e.target.value)}
								error={errors.text3}
							/>
						</Grid>
						{/* <Grid item>
							<Button variant="contained" color="primary">
								Choose File
							</Button>
						</Grid> */}
					</Grid>
				) : (
					<Grid container spacing={24}>
						<Grid item xs={12} sm={11}>
							<Typography variant="h4" component="h4" className={classes.title} gutterBottom>
								{title}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<div dangerouslySetInnerHTML={{ __html: text1 }} />
						</Grid>
						<Grid item xs={5} />
						{file_dataset1 && (
							<Grid item xs={3}>
								<FormControl
									margin={margin}
									fullWidth={fullWidth}
									error={!isEmpty(errors.file_dataset1)}
								>
									<FormLabel>Download Dataset</FormLabel>
									<Button
										variant="contained"
										color="primary"
										className={classnames(classes.btnChoose, classes.addMarginTop)}
									>
										<CloudDownload className={classes.addSmallMarginRight} />
										{file_dataset1.filename}
									</Button>
									{!isEmpty(errors.file_dataset1) && (
										<FormHelperText>{errors.file_dataset1}</FormHelperText>
									)}
								</FormControl>
							</Grid>
						)}
						{file_dataset2 && (
							<Grid item xs={3}>
								<FormControl
									margin={margin}
									fullWidth={fullWidth}
									error={!isEmpty(errors.file_dataset2)}
								>
									<FormLabel>Download Dataset</FormLabel>
									<Button
										variant="contained"
										color="primary"
										className={classnames(classes.btnChoose, classes.addMarginTop)}
									>
										<CloudDownload className={classes.addSmallMarginRight} />
										{file_dataset2.filename}
									</Button>
									{!isEmpty(errors.file_dataset2) && (
										<FormHelperText>{errors.file_dataset2}</FormHelperText>
									)}
								</FormControl>
							</Grid>
						)}

						<Grid item xs={12}>
							<div dangerouslySetInnerHTML={{ __html: text2 }} />
						</Grid>
						<Grid item xs={12}>
							{questions.map((paragraph, i) => (
								<div key={i}>
									<Typography className={classes.capitalize} variant="subtitle2" gutterBottom>
										{i + 1}. {paragraph.question}
									</Typography>
									<List component="nav">
										{paragraph.answer.map((choice, index) => {
											let variable = [ 'a', 'b', 'c', 'd' ];
											return (
												<ListItem key={index} button selected={choice.true_false === 1}>
													<ListItemIcon>
														<Fab
															size="small"
															className={choice.true_false === 1 ? classes.active : null}
														>
															{variable[index]}
														</Fab>
													</ListItemIcon>
													<ListItemText primary={choice.choice} />
												</ListItem>
											);
										})}
									</List>
								</div>
							))}
						</Grid>
						<Grid item xs={12}>
							<div dangerouslySetInnerHTML={{ __html: text3 }} />
						</Grid>
						<Grid container xs={12}>
							<Grid item xs={9} />
							<Grid item xs={3} className={classes.addMarginBottom}>
								<FormControl margin={margin} fullWidth={fullWidth} error={!isEmpty(errors.upload2)}>
									<FormLabel>Upload</FormLabel>
									<Button
										variant="contained"
										color="primary"
										className={classnames(classes.btnChoose, classes.addMarginTop)}
									>
										<CloudUpload className={classes.addSmallMarginRight} /> Choose File
									</Button>
									{!isEmpty(errors.upload2) && <FormHelperText>{errors.upload2}</FormHelperText>}
								</FormControl>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
}

IMTest1.defaultProps = {
	margin: 'normal',
	fullWidth: true,
	buttonLabel: 'Choose File',
	filesLimit: 1,
	acceptedFiles: [ 'image/jpeg', 'image/jpg', 'image/png' ],
	isUpdate: false,
	deleted: true
};

IMTest1.propTypes = {
	classes: PropTypes.object,
	onChangeStep: PropTypes.func.isRequired,
	isValid: PropTypes.func.isRequired,
	onUpload: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChangeStep,
	isValid,
	onUpload,
	onDelete
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	imtest: state.imtest
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTest1));
