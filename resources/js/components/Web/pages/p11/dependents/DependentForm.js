import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { date, month, year } from '../../../config/options';
import isEmpty from '../../../validations/common/isEmpty';
import { validateDependent } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	capitalize: {
		textTransform: 'capitalize'
	},
	removeButton: {
		position: 'absolute',
		left: '10px',
		bottom: '10px'
	}
});

class DependentForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			first_name: '',
			middle_name: '',
			family_name: '',
			bdate: '',
			bmonth: '',
			byear: '',
			relationship: '',
			years: [],
			errors: {},
			apiURL: '/api/p11-dependents',
			isEdit: false,
			recordId: 0
		};

		this.onChange = this.onChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.clearState = this.clearState.bind(this);
	}

	componentDidMount() {
		let years = [];
		for (var temp = year.max; temp >= year.min; temp--) {
			years.push(temp);
		}
		this.setState({ years });
		//reference event method from parent
		this.props.onRef(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEmpty(this.props.recordId)) {
			if (this.props.recordId !== '' && this.props.recordId !== prevProps.recordId) {
				this.getData(this.props.recordId);
			}
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

	isValid() {
		const { errors, isValid } = validateDependent(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}

	getData(id) {
		if (!isEmpty(id)) {
			this.props
				.getAPI(this.state.apiURL + '/' + id)
				.then((res) => {
					let { first_name, middle_name, family_name, bdate, bmonth, byear, relationship } = res.data.data;
					this.setState(
						{
							first_name,
							middle_name,
							family_name,
							bdate,
							bmonth,
							byear,
							relationship,
							isEdit: true,
							recordId: id
						},
						() => this.isValid()
					);
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the request'
					});
				});
		}
	}

	handleSave() {
		if (this.isValid()) {
			let dependentData = {
				first_name: this.state.first_name,
				middle_name: this.state.middle_name,
				family_name: this.state.family_name,
				bdate: this.state.bdate.toString(),
				bmonth: this.state.bmonth.toString(),
				byear: this.state.byear,
				relationship: this.state.relationship
			};

			let recId = '';

			if (this.state.isEdit) {
				dependentData._method = 'PUT';
				recId = '/' + this.state.recordId;
			}

			this.props
				.postAPI(this.state.apiURL + recId, dependentData)
				.then((res) => {
					this.props.updateList();
					this.props.addFlashMessage({
						type: 'success',
						text: 'Your dependent has been saved'
					});
					// this.props.updateDependent();
					// this.props.updateDependent();
					this.handleClose();
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'error'
					});
				});
		} else {
			let firstObj = Object.keys(this.state.errors)[0];
			this.props.addFlashMessage({
				type: 'error',
				text: this.state.errors[firstObj]
			});
		}
	}

	handleClose() {
		this.setState(
			{
				first_name: '',
				middle_name: '',
				family_name: '',
				bdate: '',
				bmonth: '',
				byear: '',
				relationship: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-dependents'
			},
			() => {
				this.props.onClose();
				this.isValid();
			}
		);
	}

	clearState() {
		this.setState({
			first_name: '',
			middle_name: '',
			family_name: '',
			bdate: '',
			bmonth: '',
			byear: '',
			relationship: '',
			recordId: 0,
			isEdit: false,
			apiURL: '/api/p11-dependents'
		});
	}

	handleRemove() {
		this.props.handleRemove();
	}

	render() {
		let { isOpen, title, classes, remove } = this.props;
		let { first_name, middle_name, family_name, bdate, bmonth, byear, relationship, years, errors } = this.state;

		return (
			<Dialog open={isOpen} onClose={this.handleClose}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<Grid container spacing={24}>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="first_name"
								name="first_name"
								label="First Name"
								fullWidth
								autoComplete="first_name"
								value={first_name}
								onChange={this.onChange}
								error={!isEmpty(errors.first_name)}
								helperText={errors.first_name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="middle_name"
								name="middle_name"
								label="Middle Name"
								fullWidth
								autoComplete="middle_name"
								value={middle_name}
								onChange={this.onChange}
								error={!isEmpty(errors.middle_name)}
								helperText={errors.middle_name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="family_name"
								name="family_name"
								label="Family Name"
								fullWidth
								autoComplete="family_name"
								value={family_name}
								onChange={this.onChange}
								error={!isEmpty(errors.family_name)}
								helperText={errors.family_name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="bdate"
								name="bdate"
								select
								label="Birth Date"
								value={bdate}
								onChange={this.onChange}
								error={!isEmpty(errors.bdate)}
								helperText={errors.bdate}
								margin="normal"
								fullWidth
							>
								{date.map((date, index) => (
									<MenuItem key={index} value={date.toString().length < 2 ? '0' + date : date}>
										{date}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="bmonth"
								name="bmonth"
								select
								label="Birth Month"
								value={bmonth}
								onChange={this.onChange}
								error={!isEmpty(errors.bmonth)}
								helperText={errors.bmonth}
								margin="normal"
								fullWidth
								className={classes.capitalize}
							>
								{month.map((month, index) => (
									<MenuItem
										key={index}
										value={(index + 1).toString().length < 2 ? '0' + (index + 1) : index + 1}
										className={classes.capitalize}
									>
										{month}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="byear"
								name="byear"
								select
								label="Birth Year"
								value={byear}
								onChange={this.onChange}
								error={!isEmpty(errors.byear)}
								helperText={errors.byear}
								margin="normal"
								fullWidth
							>
								{years.map((year1, index) => (
									<MenuItem key={index} value={year1}>
										{year1}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id="relationship"
								name="relationship"
								label="Relationship"
								fullWidth
								autoComplete="realtionship"
								value={relationship}
								onChange={this.onChange}
								error={!isEmpty(errors.relationship)}
								helperText={errors.relationship}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					{remove ? (
						<Button
							onClick={this.handleRemove}
							color="primary"
							className={classes.removeButton}
							justify="space-between"
						>
							Remove
						</Button>
					) : null}
					<Button onClick={this.handleClose} color="secondary" variant="contained">
						Close
					</Button>
					<Button onClick={this.handleSave} color="primary" variant="contained">
						Save
					</Button>
				</DialogActions>
			</Dialog>
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
	addFlashMessage
};

export default withStyles(styles)(connect('', mapDispatchToProps)(DependentForm));
