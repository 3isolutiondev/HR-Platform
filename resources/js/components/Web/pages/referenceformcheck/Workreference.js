import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Save from '@material-ui/icons/Save';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

class Workreference extends Component {
	constructor(props) {
		super(props);

		this.state = {
			categoryID: '',
			profilID: '',
			preferenceId: '',
			quest: [],
			field_error: false,
			email: '',
			helperText: '',
			authorize: false,
			hasInput: false,
			apiURLemail: '/api/work-reference/validate-email',
			apiURL: '/api/work-reference'
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.setState({
			categoryID: this.props.match.params.id,
			profilID: this.props.match.params.profilID
		});
		// this.props
		// 	.getAPI('/api/work-reference/check-exist-data/' + this.props.match.params.profilID)
		// 	.then((res) => {

		//         if(res.data.data>0) {
		//             this.setState({
		//                 hasInput:true
		//             });
		//         } else {
		//             this.getQuestion(this.props.match.params.id, this.props.match.params.profilID);
		//         }
		//     });
	}

	getQuestion($categoryID, $profilID) {
		this.props
			.getAPI('/api/work-reference/get-question/' + $categoryID + '/' + $profilID)
			.then((res) => {
				let tempdata = [];

				res.data.data.map(function (ct) {
					tempdata.push({
						id: ct.id,
						question: ct.question,
						id_answer: ct.id_answer,
						answer: ct.answer,
						// profil_id: $profilID,
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
		if (this.state.authorize == false) {
			let ferror = false,
				hText;
			if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)) {
				ferror = false;
				hText = '';
			} else {
				ferror = true;
				hText = 'Please enter a valid email';
			}

			this.setState({
				field_error: ferror,
				helperText: hText,
				[e.target.name]: e.target.value
			});
		} else {
			let { quest } = this.state;
			quest[e.target.index]['answer'] = e.target.value;
			this.setState({
				quest
			});
		}
	}

	handleClick(e) {
		e.preventDefault();
		let url = this.state.apiURLemail,
			recordData = {
				profilID: this.state.profilID,
				email: this.state.email
			};

		this.props
			.postAPI(url, recordData)
			.then((res) => {
				if (res.data.data.existdata == 0) {
					//data tida valid
					this.props.addFlashMessage({
						type: 'error',
						text: 'You don’t have permission to access this page'
					});
				} else if (res.data.data.filled > 0) {
					this.setState({
						hasInput: true
					});
				} else {
					this.getQuestion(this.props.match.params.id, this.props.match.params.profilID);
					this.setState({
						authorize: true,
						preferenceId: res.data.data.preference_id
					});
				}
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response.data.status,
					text: err.response.data.message
				});
			});
	}
	handleSubmit(e) {
		e.preventDefault();

		let url = this.state.apiURL,
			recordData = {
				data: this.state.quest
			};
		recordData['email'] = this.state.email;
		recordData['profil_id'] = this.state.profilID;
		recordData['category_id'] = this.state.categoryID;
		recordData['preference_id'] = this.state.preferenceId;

		this.props
			.postAPI(url, recordData)
			.then((res) => {
				this.props.addFlashMessage({
					type: 'success',
					text: 'Data has been saved'
				});

				this.setState({
					hasInput: true
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response.data.status,
					text: err.response.data.message
				});
			});
	}
	onSubmit(e) {
		e.preventDefault();
		let url = this.state.apiURL,
			recordData = {
				data: this.state.quest
			};
		recordData['email'] = this.state.email;
		recordData['profil_id'] = this.state.profilID;
		recordData['category_id'] = this.state.categoryID;
		recordData['preference_id'] = this.state.preferenceId;

		this.props
			.postAPI(url, recordData)
			.then((res) => {
				this.props.addFlashMessage({
					type: 'success',
					text: 'Data has been saved'
				});

				this.setState({
					hasInput: true
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
			<form>
				<Paper className={classes.paper}>
					{(!this.state.authorize && this.state.hasInput == false) ? (
							<Grid container spacing={16}>
								<Grid item xs={12}>
									<Typography component="p">Please enter your email</Typography>
								</Grid>

								<Grid item xs={12}>
									<TextField
										error={this.state.field_error}
										id="email"
										name="email"
										onChange={this.handleChange}
										onKeyPress={(event) => {
											if (event.which === 13 /* Enter */) {
												event.preventDefault();
											}
										}}
										placeholder="Email"
										fullWidth
										required
										autoFocus
										margin="normal"
										InputLabelProps={{
											shrink: true
										}}
										helperText={this.state.helperText}
									/>
								</Grid>

								<Grid item xs={12}>
									<Button
										type="button"
										fullWidth
										variant="contained"
										color="primary"
										onClick={this.handleClick}
										disabled={this.state.field_error}
										className={classes.submit}
									>
										<Save /> Next
								</Button>
								</Grid>
							</Grid>
						) : null }

					{(this.state.authorize && this.state.hasInput == false) ? (
							<Grid container spacing={16}>
								<Grid item xs={12}>
									<Typography component="p">
										<b>
											Please check your data before saving. Data that has been saved cannot be changed
											anymore.
									</b>
									</Typography>
								</Grid>
								{quest.map((data, index) => {
									return (
										<Grid
											container
											spacing={16}
											alignItems="center"
											style={add_styles.default}
											key={index}
										>
											<Grid item xs={12}>
												<Typography component="p">
													{data.question.replace('<p>', '').replace('</p>', '')}
												</Typography>
											</Grid>

											<Grid item xs={12}>
												<ReactQuill
													className={classes.reactQuill}
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
										onClick={this.handleSubmit}
										variant="contained"
										color="primary"
										className={classes.submit}
									>
										<Save /> Save
								</Button>
								</Grid>
							</Grid>
						) : null }

					{this.state.hasInput == true ? (
						<Grid item xs={12}>
							<Typography component="p" variant="h4" color="primary">
								<b>Thank you for your participation</b>
							</Typography>
						</Grid>
					) : null}
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
	},
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
	addFlashMessage
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

Workreference.propTypes = {
	errors: PropTypes.object,
	isEdit: PropTypes.bool.isRequired,
	apiURL: PropTypes.string.isRequired,
	redirectURL: PropTypes.string.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Workreference));
