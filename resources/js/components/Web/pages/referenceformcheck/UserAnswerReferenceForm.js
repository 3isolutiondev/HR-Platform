import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
// import MenuItem from '@material-ui/core/MenuItem';
import Save from '@material-ui/icons/Save';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
//import WysiwygField from '../../../Web/common/formFields/WysiwygField';
//import Fq from './Fq'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import isEmpty from '../../validations/common/isEmpty';

const add_styles = {
	default: {
		border: '1px solid #ccc',
		padding: '0 16px 16px 16px',
		marginTop: '16px',
		borderRadius: '4px'
	},
	reactQuill: {
		width: '100%',
		marginTop: '0.5em',
		'& .ql-container': {
			height: 'auto !important',
			'min-height': '120px'
		},
		'& .ql-editor': {
			height: 'auto !important',
			'min-height': '120px'
		}
	}
};

class UserAnswerReferenceForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: '',
			quest: [],
			category_id: '',
			title: '',
			jawaban: '',
			countries: [],
			apiURL: '/api/user-answer-reference-question'
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.setState({
			id: this.props.match.params.id
		});

		this.getQuestion(39);
	}

	getQuestion($user_id) {
		this.props
			.getAPI('/api/user-answer-reference-question/get-question/' + $user_id)
			.then((res) => {
				let tempdata = [];

				let qx = res.data.data.map(function (ct) {
					tempdata.push({
						id: ct.id,
						question: ct.question,
						id_answer: ct.id_answer,
						answer: ct.answer,
						user_id: $user_id,
						email_reference: ct.email_reference
					});
				});

				this.setState({
					quest: tempdata
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
			});
	}

	handleChange(e) {
		let { quest } = this.state;
		quest[e.target.index]['answer'] = e.target.value;
		this.setState({
			quest
		});
	}

	onSubmit(e) {
		e.preventDefault();

		let url = this.state.apiURL,
			recordData = {
				data: this.state.quest
			};
		this.props
			.postAPI(url, recordData)
			.then((res) => {
				this.props.addFlashMessage({
					type: 'success',
					text: 'Data has been saved'
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response.data.status,
					text: err.response.data.message
				});
			});
	}

	render() {
		const { classes, errors } = this.props;
		let { quest } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						{quest.map((data, index) => {
							return (
								<Grid container spacing={16} alignItems="center" style={add_styles.default} key={index}>
									<Grid item xs={12}>
										<Typography component="p">{data.question}</Typography>
									</Grid>
									<Grid item xs={12}>
										<ReactQuill
											// name="answer"
											value={data.answer}
											onChange={(value) =>
												this.handleChange({
													target: {
														value: value,
														index
													}
												})}
										/>
									</Grid>
								</Grid>
							);
						})}

						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<Save /> Save
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	}
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage //getQuestionCategories
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	errors: state.dashboardUser.errors,
	isEdit: state.dashboardUser.isEdit,
	apiURL: state.dashboardUser.apiURL,
	redirectURL: state.dashboardUser.redirectURL
});

UserAnswerReferenceForm.propTypes = {
	errors: PropTypes.object,
	isEdit: PropTypes.bool.isRequired,
	apiURL: PropTypes.string.isRequired,
	redirectURL: PropTypes.string.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserAnswerReferenceForm));
