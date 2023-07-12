import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import isEmpty from '../../validations/common/isEmpty';
import { validate } from '../../validations/permission';
import { addFlashMessage } from '../../redux/actions/webActions';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { white } from '../../config/colors';
import WysiwygField from '../../common/formFields/WysiwygField';
import SelectField from '../../common/formFields/SelectField';

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
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

class PermissionForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
      description: '',
      group: '',
      groups: [],
			errors: {},
			isEdit: false,
			apiURL: '/api/permissions',
			redirectURL: '/dashboard/permissions',
			showLoading: false
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    this.getData = this.getData.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/permissions/' + this.props.match.params.id
			});
		}
	}

	componentDidMount() {
    this.props.getAPI('/api/groups/all-options').then(res => this.setState({ groups: res.data.data})).catch(err => { this.setState({groups: []}) })
    this.getData();
	}

  getData() {
    if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiURL)
				.then((res) => {
					const { name, description, group } = res.data.data;

					this.setState({ name, description: isEmpty(description) ? '' : description, group });
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while requesting permission data'
					});
				});
		}
  }

	isValid() {
		const { errors, isValid } = validate(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}

	onChange(e) {
		if (!!this.state.errors[e.target.name]) {
			const errors = Object.assign({}, this.state.errors);
			delete errors[e.target.name];
			this.setState({ [e.target.name]: e.target.value, errors }, () => {
				this.isValid();
			});
		} else {
			this.setState({ [e.target.name]: e.target.value }, () => {
				this.isValid();
			});
		}
	}

	onSubmit(e) {
		e.preventDefault();
    const { description } = this.state;
    let cleanDesc = description.toString().replace(/(<([^>]+)>)/ig, '');
		let permissionData = {
      name: this.state.name,
      description: isEmpty(cleanDesc) ? null : description,
      group_id: !isEmpty(this.state.group) ? this.state.group.value : null
		};

		if (this.state.isEdit) {
			permissionData._method = 'PUT';
		}

		if (this.isValid()) {
			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, permissionData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							const { status, message } = res.data;
              this.props.addFlashMessage({
                type: status,
                text: message
              });
              if (this.state.isEdit) {
                this.getData()
              } else {
                this.props.history.push(this.state.redirectURL);
              }
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							this.props.addFlashMessage({
								type: err.response.data.status ? err.response.data.status : 'error',
								text: err.response.data
									? err.response.data.message
									: 'There is an error while processing the request'
							});
						});
					});
			});
		}
	}

	render() {
		let { name, description, group, groups, errors, isEdit, showLoading } = this.state;

		const { classes } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Permission : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Permission'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Permission : ' + name
							) : (
								APP_NAME + ' Dashboard > Add Permission'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Permission : ' + name}
								{!isEdit && 'Add Permission'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="name"
								label="Name"
								autoComplete="name"
								autoFocus
								margin="normal"
								required
								fullWidth
								name="name"
								value={name}
								onChange={this.onChange}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
							/>
						</Grid>
            <Grid item xs={12}>
              <SelectField
                id="group"
								label="Group *"
								margin="dense"
								options={groups}
								value={group}
								placeholder="Group"
								isMulti={false}
								onChange={(value, e) => this.onChange({ target: { name: "group", value: value } })}
								name="group"
								error={errors.group}
								fullWidth={true}
							/>
            </Grid>
            <Grid item xs={12}>
              <WysiwygField
                id="description"
                label="Description"
                margin="dense"
								name="description"
								value={description}
								onChange={this.onChange}
								error={errors.description}
							/>
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
								{showLoading && (
									<CircularProgress thickness={5} size={22} className={classes.loading} />
								)}
							</Button>
						</Grid>
					</Grid>
					{/* </Grid> */}
				</Paper>
			</form>
		);
	}
}

PermissionForm.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

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

export default withStyles(styles)(connect(null, mapDispatchToProps)(PermissionForm));
