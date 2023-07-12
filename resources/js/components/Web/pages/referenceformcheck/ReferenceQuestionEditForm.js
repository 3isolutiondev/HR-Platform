import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Save from '@material-ui/icons/Save';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import isEmpty from '../../validations/common/isEmpty';

class ReferenceQuestionEditForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			question: '',
			category_id: '',
			category: [],
			apiURL: '/api/reference-question'
		};
		this.getData = this.getData.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.setState({
			id: this.props.match.params.id
		});

		this.getData(this.props.match.params.id);
		this.getCategory();
		// if (typeof this.props.match.params.id !== 'undefined') {
		// 	this.props.setFormIsEdit(true, this.props.match.params.id);
		// }
	}
	getCategory(){
        this.props.getAPI('/api/reference-question-category')
	    .then((res) => {

            let options = res.data.data.map(function (ct) {
                return { value: ct.id, label: ct.name };
            });

            this.setState({
                category: options
            });

        })
        .catch((err) => {
            this.props.addFlashMessage({
                type: 'error',
                text: 'There is an error while processing the request'
            });
        });
    }

	getData(id) {
        this.props.getAPI(this.state.apiURL+'/'+id)
	    .then((res) => {
            this.setState({
                id: res.data.data[0].id,
                question: res.data.data[0].question,
                category_id : res.data.data[0].category_question_reference_id,
            });

        })
        .catch((err) => {
            this.props.addFlashMessage({
                type: 'error',
                text: 'There is an error while processing the request'
            });
        })
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	onSubmit(e) {
		e.preventDefault();

		let recordData = {
			question: this.state.question,
			category_question_reference_id: this.state.category_id,
			is_default: false,
			_method: 'PUT'
		};

		let url = this.state.apiURL + '/' + this.state.id;
		this.props
			.postAPI(url, recordData)
			.then((res) => {
				this.props.addFlashMessage({
					type: 'success',
					text: 'Data has been updated'
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

		return (
			<form onSubmit={this.onSubmit}>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								Edit Question
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="question"
								label="Question"
								autoComplete="question"
								autoFocus
								margin="normal"
								onChange={this.handleChange}
								required
								fullWidth
								name="question"
								value={this.state.question}
								error={!isEmpty(errors.question)}
								helperText={errors.question}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="standard-select-currency"
								required
								select
								fullWidth
								name="category_id"
								label="Question Category"
								className={classes.textField}
								value={this.state.category_id}
	                            onChange={this.handleChange}
								SelectProps={{
									MenuProps: {
										className: classes.menu,
									},
								}}
								margin="normal"
							>
								{this.state.category.map((data,index) => (
									<MenuItem key={data.value} value={data.value}>
										{data.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>

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

ReferenceQuestionEditForm.propTypes = {
	errors: PropTypes.object,
	isEdit: PropTypes.bool.isRequired,
	apiURL: PropTypes.string.isRequired,
	redirectURL: PropTypes.string.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReferenceQuestionEditForm));
