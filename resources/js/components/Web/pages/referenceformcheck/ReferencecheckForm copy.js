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
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
// import { onSubmit, onChange, setFormIsEdit, switchPassword } from '../../redux/actions/dashboard/userActions';
import isEmpty from '../../validations/common/isEmpty';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class ReferencecheckForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			name: '',
			title: '',
			is_default: '',
			apiURL: '/api/reference-question-category'
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
	}

	switchOnChange(e) {
		let { value } = e.target;
		let boleanData = value === 'false' ? false : true;
		this.setState({
			[e.target.name]: !boleanData
		});

		//		this.props.switchShowProfileSection(!booleanData, name);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	onSubmit(e) {
		e.preventDefault();

		let recordData = {
			name: this.state.name,
			title: this.state.title,
			is_default: this.state.is_default == true ? true : false
		};

		let url = this.state.apiURL;
		this.props
			.postAPI(url, recordData)
			.then((res) => {
				// this.setState({ id, steps, text1, title, isEdit: false, editButton: true });
				this.props.addFlashMessage({
					type: 'success',
					text: 'Data has been added'
				});
			})
			.catch((err) => {});
	}

	render() {
		const { classes, errors, onChange, history } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								Add Reference Check Template
							</Typography>
						</Grid>

						<Grid item xs={12} sm={8}>
							<TextField
								id="name"
								label="Name"
								autoComplete="name"
								margin="normal"
								onChange={this.handleChange}
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
						{/* <hr style={{ width: '100%', marginBottom: '15px' }} />
                        <br/> */}
						{/* <Button variant="contained" color="primary" size="small" style={{marginBottom: '15px'}}>
							Add Question
						</Button> */}

						{/* <Grid container spacing={16} alignItems="center">
							<Grid item xs={12}>
								<ReactQuill
                                    value={''}
									onChange={this.handleChange}
							    />
							</Grid>
						</Grid> */}

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

ReferencecheckForm.propTypes = {
	errors: PropTypes.object,
	isEdit: PropTypes.bool.isRequired,
	apiURL: PropTypes.string.isRequired,
	redirectURL: PropTypes.string.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReferencecheckForm));
