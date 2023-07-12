import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CloudDownload from '@material-ui/icons/CloudDownload';
import isEmpty from '../../../validations/common/isEmpty';
import classnames from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import { primaryColor, white } from '../../../config/colors';
import DropzoneFileField from '../../../common/formFields/DropzoneFileField';
import {
	imTestFile_DatasetURL,
	imTestFile_DatasetFileCollection,
	acceptedDocFiles,
	imTestFile_DatasetDeleteFileURL
} from '../../../config/general';
import { onChange, onDelete, handleSelectAnswer } from '../../../redux/actions/imtest/imTestUserActions';

class Part1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected1: null,
			selected2: null,
			selected3: null
		};
		this.handleSelect = this.handleSelect.bind(this);
		this.handleDownload = this.handleDownload.bind(this);
	}

	handleSelect(index, id) {
		this.setState({ ['selected' + (index + 1)]: id });
	}
	handleDownload(fileURL, fileName) {
		// for non-IE
		if (!window.ActiveXObject) {
			var save = document.createElement('a');
			save.href = fileURL;
			save.target = '_blank';
			var filename = fileURL.substring(fileURL.lastIndexOf('/') + 1);
			save.download = fileName || filename;
			if (
				navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) &&
				navigator.userAgent.search('Chrome') < 0
			) {
				document.location = save.href;
				// window event not working here
			} else {
				var evt = new MouseEvent('click', {
					view: window,
					bubbles: true,
					cancelable: false
				});
				save.dispatchEvent(evt);
				(window.URL || window.webkitURL).revokeObjectURL(save.href);
			}
		} else if (!!window.ActiveXObject && document.execCommand) {
			// for IE < 11
			var _window = window.open(fileURL, '_blank');
			_window.document.close();
			_window.document.execCommand('SaveAs', true, fileName || fileURL);
			_window.close();
		}
	}
	render() {
		const { imTestUser, classes, onChange, onDelete, handleSelectAnswer, preview } = this.props;

		return (
			<Grid container spacing={24}>
				<Grid item xs={12} sm={12} md={12}>
					<Typography
						variant="h4"
						component="h4"
						className={classnames(classes.subTitle, classes.capitalize)}
						gutterBottom
					>
						{imTestUser.step2[0].title}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<div
						className={classes.correctFont}
						dangerouslySetInnerHTML={{ __html: imTestUser.step2[0].text1 }}
					/>
				</Grid>
				<Grid item xs={12} sm={2} md={6} />
				<Grid item xs={12} sm={5} md={3}>
					<FormControl margin="normal" fullWidth>
						<FormLabel>Download Dataset</FormLabel>
						<Button
							variant="contained"
							color="primary"
							className={classnames(classes.btnChoose, classes.addMarginTop)}
							onClick={() =>
								this.handleDownload(
									imTestUser.step2[0].file_dataset1.file_url,
									imTestUser.step2[0].file_dataset1.filename
								)}
							// href={imTestUser.step2[0].file_dataset1.file_url}
						>
							<CloudDownload className={classes.addSmallMarginRight} />
							{imTestUser.step2[0].file_dataset1.filename}
						</Button>
					</FormControl>
				</Grid>

				<Grid item xs={12} sm={5} md={3}>
					<FormControl margin="normal" fullWidth>
						<FormLabel>Download Dataset</FormLabel>
						<Button
							variant="contained"
							color="primary"
							className={classnames(classes.btnChoose, classes.addMarginTop)}
							onClick={() =>
								this.handleDownload(
									imTestUser.step2[0].file_dataset2.file_url,
									imTestUser.step2[0].file_dataset2.filename
								)}
							// href={imTestUser.step2[0].file_dataset2.file_url}
						>
							<CloudDownload className={classes.addSmallMarginRight} />
							{imTestUser.step2[0].file_dataset2.filename}
						</Button>
					</FormControl>
				</Grid>

				<Grid item xs={12}>
					<div
						className={classes.correctFont}
						dangerouslySetInnerHTML={{ __html: imTestUser.step2[0].text2 }}
					/>
				</Grid>
				<Grid item xs={12} sm={12} md={12}>
					{imTestUser.step2[0].questions.map((paragraph, indexQuestion) => {
						return (
							<div key={indexQuestion}>
								<Typography className={classes.capitalize} variant="subtitle2" gutterBottom>
									{indexQuestion + 1}. {paragraph.question}
								</Typography>
								<List component="nav">
									{paragraph.answer.map((choice, indexAnswer) => {
										let variable = [ 'a', 'b', 'c', 'd' ];

										return (
											<ListItem
												key={indexAnswer}
												button
												selected={
													imTestUser['selectedstep2' + (indexQuestion + 1)] === choice.id
												}
												onClick={(e) => {
													preview
														? null
														: handleSelectAnswer('step2', indexQuestion, choice.id);
													let mapTrueFalse = paragraph.answer.map((data, index) => {
														if (indexAnswer === index) {
															data.true_false = 1;
														} else {
															data.true_false = 0;
														}
														return data;
													});

													imTestUser.step2[0].questions[indexQuestion][
														'answer'
													] = mapTrueFalse;
													preview ? null : onChange('step2', imTestUser.step2);
												}}
											>
												<ListItemIcon>
													<Fab
														size="small"
														className={
															imTestUser['selectedstep2' + (indexQuestion + 1)] ===
															choice.id ? (
																classes.active
															) : null
														}
													>
														{variable[indexAnswer]}
													</Fab>
												</ListItemIcon>
												<ListItemText primary={choice.choice} />
											</ListItem>
										);
									})}
								</List>
							</div>
						);
					})}
				</Grid>
				<Grid item xs={12} sm={12} md={12}>
					<div
						className={classes.correctFont}
						dangerouslySetInnerHTML={{ __html: imTestUser.step2[0].text3 }}
					/>
				</Grid>
				<Grid container xs={12} sm={12} md={12}>
					<Grid item xs={12} sm={7} md={9} />
					<Grid item xs={12} sm={5} md={3} className={classes.addMarginBottom}>
						{preview && !isEmpty(imTestUser.step2[0]['follow-imtes']) ? (
							<FormControl margin="normal" fullWidth>
								<FormLabel>Result IM Test</FormLabel>
								<Button
									variant="contained"
									color="primary"
									className={classnames(classes.btnChoose, classes.addMarginTop)}
									// href={imTestUser.step2[0]['follow-imtes'][0].file1.file_url}
									onClick={() =>
										this.handleDownload(
											imTestUser.step2[0]['follow-imtes'][0].file1.file_url,
											imTestUser.step2[0]['follow-imtes'][0].file1.filename
										)}
								>
									<CloudDownload className={classes.addSmallMarginRight} />

									{imTestUser.step2[0]['follow-imtes'][0].file1.filename}
								</Button>
							</FormControl>
						) : (
							<DropzoneFileField
								name="file1"
								label="Upload Answer"
								onUpload={(name, data) => onChange(name, data[0])}
								onDelete={(name, apiUrl, data, deleteId) =>
									onDelete(name, apiUrl, data, deleteId, file1.model_id)}
								collectionName={imTestFile_DatasetFileCollection + 'user_1'}
								apiURL={imTestFile_DatasetURL}
								deleteAPIURL={imTestFile_DatasetDeleteFileURL}
								isUpdate={false}
								filesLimit={1}
								acceptedFiles={acceptedDocFiles}
								gallery_files={!isEmpty(imTestUser.file1) ? [ imTestUser.file1 ] : []}
								error={imTestUser.errors.file1}
								fullWidth={false}
							/>
						)}
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChange,
	onDelete,
	handleSelectAnswer
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	imTestUser: state.imTestUser
});

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addMarginTop: {
		'margin-top': '0.5em'
	},
	btnChoose: {
		width: 'max-content'
	},
	subTitle: {
		color: primaryColor
	},
	addMarginBottom: {
		marginBottom: 10
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	active: {
		backgroundColor: primaryColor,
		color: white
	},
	capitalize: {
		textTransform: 'capitalize'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Part1));
