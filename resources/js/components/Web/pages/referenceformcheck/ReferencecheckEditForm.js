import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Save from '@material-ui/icons/Save';
// import { getRoles } from '../../redux/actions/optionActions';
import { getAPI, postAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
// import { onSubmit, onChange, setFormIsEdit, switchPassword } from '../../redux/actions/dashboard/userActions';
import isEmpty from '../../validations/common/isEmpty';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Delete from '@material-ui/icons/Delete';
import Alert from '../../common/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { white } from '../../config/colors';

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
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

class ReferencecheckEditForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			name: '',
			is_default: '',
			deleteId: '',
			level: 0,
			alertOpen: false,
			quest: [],
			apiURL: '/api/reference-check',
			deletequestionUrl: '/api/reference-check/delete-question'
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
		this.delete = this.delete.bind(this);
	}
	componentDidMount() {
		this.setState({
			id: this.props.match.params.id
		});

		this.getData(this.props.match.params.id);
	}
	getData(id) {
		this.props
			.getAPI(this.state.apiURL + '/' + id)
			.then((res) => {
				this.setState({
					id: res.data.data[0].id,
					name: res.data.data[0].name,
					is_default: res.data.data[0].is_default === 1 ? true : false,
					quest: res.data.data[0].hasquestion
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
			});
	}
	switchOnChange(e) {
		let { value } = e.target;
		let boleanData = value === 'false' ? false : true;
		this.setState({
			[e.target.name]: !boleanData
		});

		//		this.props.switchShowProfileSection(!booleanData, name);
	}
	addQuestion() {
		this.setState({
			quest: [ ...this.state.quest, '' ]
		});
	}

	handleChange(e) {
		const { index, value } = e.target;

		if (this.state.quest[index]['question']) {
			this.state.quest[index]['question'] = value;
		} else {
			this.state.quest[index] = value;
		}
		this.setState({
			quest: this.state.quest
		});
	}
	delete() {
		this.state.quest.splice(this.state.level, 1);
		this.setState({ deleteId: 0, alertOpen: false });

		if (this.state.deleteId > 0) {
			this.props
				.deleteAPI(this.state.deletequestionUrl + '/' + this.state.deleteId)
				.then((res) => {
					const { status, message } = res.data;
					this.props.addFlashMessage({
						type: status,
						text: message
					});
					this.setState({ deleteId: 0, alertOpen: false });
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the delete request'
					});
				});
		}
	}
	onSubmit(e) {
		e.preventDefault();

		let recordData = {
			name: this.state.name,
			quest: this.state.quest,
			is_default: this.state.is_default == true ? true : false,
			_method: 'PUT'
		};

		let url = this.state.apiURL + '/' + this.state.id;

		this.setState({ showLoading: true }, () => {
			this.props
				.postAPI(url, recordData)
				.then((res) => {
					this.setState({ showLoading: false }, () => {
						this.props.addFlashMessage({
							type: 'success',
							text: 'Data has been updated'
						});
					});
				})
				.catch((err) => {
					this.setState({ showLoading: false }, () => {
						this.props.addFlashMessage({
							type: 'error',
							text: 'There is an error while processing your request'
						});
					});
				});
		});
	}

	render() {
		const { classes, errors, onChange, history } = this.props;

		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<Paper className={classes.paper}>
						<Grid container spacing={16}>
							<Grid item xs={12}>
								<Typography variant="h5" component="h3">
									Edit Reference Check Template
								</Typography>
							</Grid>

							<Grid item xs={12} sm={8}>
								<TextField
									id="name"
									label="Name"
									autoComplete="name"
									margin="normal"
									onChange={(e) =>
										this.setState({
											[e.target.name]: e.target.value
										})}
									required
									autoFocus
									fullWidth
									name="name"
									value={this.state.name}
									error={!isEmpty(errors.name)}
									helperText={errors.name}
								/>
							</Grid>

							<Grid item xs={12} sm={4}>
								<FormControlLabel
									label="Is Default"
									control={
										<Switch
											id="is_default"
											name="is_default"
											onChange={this.switchOnChange}
											checked={this.state.is_default}
											value={this.state.is_default}
											color="primary"
										/>
									}
								/>
							</Grid>
							<Grid item xs={12}>
								<hr style={{ width: '100%', marginBottom: '15px' }} />
								<Button
									variant="contained"
									color="primary"
									size="small"
									onClick={this.addQuestion}
									style={{ marginBottom: '15px' }}
								>
									Add Question
								</Button>
							</Grid>
							<Grid item xs={12}>
								{this.state.quest.map((pertanyaan, index) => {
									let idq = pertanyaan['id'] ? pertanyaan['id'] : 0;

									return (
										<Grid
											container
											spacing={16}
											alignItems="center"
											key={index}
											style={{ marginBottom: '10px' }}
										>
											<Grid item xs={12} sm={7} md={9} lg={10}>
												<ReactQuill
													value={pertanyaan['question'] ? pertanyaan['question'] : pertanyaan}
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
											<Grid item xs={12} sm={5} md={3} lg={2}>
												<Button
													variant="contained"
													color="primary"
													size="small"
													fullWidth
													onClick={() => {
														this.setState({
															deleteId: idq,
															level: index,
															alertOpen: true
														});
													}}
												>
													<Delete fontSize="small" /> Delete
												</Button>
											</Grid>
										</Grid>
									);
								})}
							</Grid>
							<Grid item xs={12}>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									<Save /> Save{' '}
									{this.state.showLoading ? (
										<CircularProgress thickness={5} size={22} className={classes.loading} />
									) : null }
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</form>
				<Alert
					isOpen={this.state.alertOpen}
					onClose={() => {
						this.setState({ alertOpen: false });
					}}
					onAgree={() => {
						this.delete();
					}}
					title="Delete Warning"
					text={'Are you sure to delete question reference ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
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
	getAPI,
	postAPI,
	deleteAPI,
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

ReferencecheckEditForm.propTypes = {
	errors: PropTypes.object,
	isEdit: PropTypes.bool.isRequired,
	apiURL: PropTypes.string.isRequired,
	redirectURL: PropTypes.string.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReferencecheckEditForm));
