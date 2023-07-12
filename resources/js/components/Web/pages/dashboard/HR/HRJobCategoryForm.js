import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import Add from '@material-ui/icons/Add';
import isEmpty from '../../../validations/common/isEmpty';
import { validate } from '../../../validations/HR/HRJobCategory';
import { addFlashMessage } from '../../../redux/actions/webActions';
import Loadable from 'react-loadable';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';
import { white } from '../../../config/colors';

const HRJobCategoryRequirements = Loadable({
	loader: () => import('./jobCategoryRequirements/requirements'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

const JobCategorySubSection = Loadable({
	loader: () => import('./jobCategorySubSection/JobCategorySubSection'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

/**
 * set up styles for this component
 * @ignore
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
		marginRight: theme.spacing.unit,
		marginLeft: theme.spacing.unit,
		color: white
	},
	check: {
		padding: theme.spacing.unit + 'px ' + (theme.spacing.unit + theme.spacing.unit / 2 + 'px')
	}
});

class HRJobCategoryForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			matching_requirements: [],
			sub_sections: [],
			is_approved: 0,
			errors: {},
			isEdit: false,
			apiURL: '/api/hr-job-categories',
			redirectURL: '/dashboard/hr-job-categories',
			default_section: {
				sub_section: '',
				sub_section_content: '',
				level: 0
			},
			showLoading: false
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.requirementsOnChange = this.requirementsOnChange.bind(this);
		this.addSection = this.addSection.bind(this);
		this.updateSection = this.updateSection.bind(this);
		this.deleteSection = this.deleteSection.bind(this);
		this.addSectionBelow = this.addSectionBelow.bind(this);
		this.moveArray = this.moveArray.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/hr-job-categories/' + this.props.match.params.id,
				redirectURL: '/dashboard/hr-job-categories/' + this.props.match.params.id + '/edit'
			});
		}
	}

	componentDidMount() {
		if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiURL)
				.then((res) => {
					const { name, matching_requirements, sub_sections, is_approved } = res.data.data;

					this.setState({ name, matching_requirements, sub_sections, is_approved });
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while requesting sector data'
					});
				});
		} else {
			this.isValid();
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

	requirementsOnChange(matching_requirements) {
		this.setState({ matching_requirements }, () => this.isValid());
	}

	onSubmit(e) {
		e.preventDefault();

		if (this.isValid()) {
			let recordData = {
				name: this.state.name,
				matching_requirements: this.state.matching_requirements,
				sub_sections: this.state.sub_sections,
				is_approved: this.state.is_approved
			};

			if (this.state.isEdit) {
				recordData._method = 'PUT';
			}

			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, recordData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							const { status, message } = res.data;
							this.props.history.push(this.state.redirectURL);
							this.props.addFlashMessage({
								type: status,
								text: message
							});
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'There is an error while processing the request'
							});
						});
					});
			});
		}
	}

	addSection() {
		let { sub_sections, default_section } = this.state;

		sub_sections.push(default_section);
		this.setState({ sub_sections }, () => {
			this.isValid();
		});
	}

	updateSection(level, sectionData) {
		let { sub_sections } = this.state;
		sub_sections[level] = sectionData;
		this.setState({ sub_sections }, () => this.isValid());
	}

	deleteSection(level) {
		let { sub_sections } = this.state;
		sub_sections.splice(level, 1);
		this.setState({ sub_sections }, () => this.isValid());
	}

	/**
	 * addSectionBelow is a function to add new section below the current section
	 * @param {number} index
	 */
	  addSectionBelow(index) {
		let { sub_sections, default_section } = this.state;
		sub_sections.splice(index + 1, 0, default_section);
		
		this.setState({ sub_sections }, () => {
			this.isValid();
		});
	}

	/**
	 * moveArray is a function to move section up or down into an array
	 * @param {string} action
	 * @param {number} index
	 */
	 moveArray(action, index) {
		let { sub_sections } = this.state;
		let newIndex = (index > 0 && action == "up") ? index - 1 : (index < sub_sections.length - 1 && action == "down") ? index + 1 : index;
		if (index != newIndex) {
		  let newSubSections = arrayMove(sub_sections, index, newIndex);

			this.setState({ sub_sections: newSubSections}, () => {
				this.isValid();
			});
		}
	}

	render() {
		let { name, matching_requirements, errors, sub_sections, is_approved, isEdit, showLoading } = this.state;

		const { classes } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Job Category : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Job Category'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Job Category : ' + name
							) : (
								APP_NAME + ' Dashboard > Add Job Category'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Job Category : ' + name}
								{!isEdit && 'Add Job Category'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="name"
								label="Name"
								autoComplete="name"
								autoFocus
								margin="dense"
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
							<FormControl margin="none" error={!isEmpty(errors.is_approved)}>
								<FormControlLabel
									control={
										<Checkbox
											checked={is_approved === 1 ? true : false}
											name="is_approved"
											color="primary"
											onChange={(e) => {
												this.onChange({
													target: {
														name: e.target.name,
														value: e.target.checked ? 1 : 0
													}
												});
											}}
											className={classes.check}
										/>
									}
									label="Approved / Shown in ToR Form"
								/>
								{!isEmpty(errors.is_approved) && <FormHelperText>{errors.is_approved}</FormHelperText>}
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Button variant="contained" color="primary" size="small" onClick={this.addSection}>
								<Add size="small" /> Add Section
							</Button>
							<br />
							<FormControl error={!isEmpty(errors.sub_sections)} fullWidth>
								{sub_sections.length > 0 &&
									sub_sections.map((sub_section, index) => {
										sub_section.level = index;
										return (
											<JobCategorySubSection
												key={'sub-section-' + index}
												level={index}
												sectionData={sub_section}
												updateSection={this.updateSection}
												deleteSection={this.deleteSection}
												addSectionBelow={this.addSectionBelow}
												moveArray={this.moveArray}
												isFirst={0 == index ? true : false}
												isLast={(sub_sections.length - 1) == index ? true : false}
											/>
										);
									})}
								{!isEmpty(errors.sub_sections) && (
									<FormHelperText>{errors.sub_sections}</FormHelperText>
								)}
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<HRJobCategoryRequirements
								label="Set Requirements"
								requirements={matching_requirements}
								onChange={this.requirementsOnChange}
								error={!isEmpty(errors.matching_requirements)}
								helperText={errors.matching_requirements}
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
				</Paper>
			</form>
		);
	}
}

HRJobCategoryForm.propTypes = {
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(HRJobCategoryForm));
