import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import SaveIcon from '@material-ui/icons/Save';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Rating from 'material-ui-rating';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import SelectField from '../../../common/formFields/SelectField';
import isEmpty from '../../../validations/common/isEmpty';
import { validateEmploymentRecord } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { month } from '../../../config/options';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { getSectors, getYears, getP11Countries } from '../../../redux/actions/optionActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import SkillPicker from '../../../common/formFields/SkillPicker';
import SectorPicker from '../../../common/formFields/SectorPicker';
import { white } from '../../../config/colors';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	capitalize: {
		textTransform: 'capitalize'
	},
	overflowVisible: {
		overflow: 'visible'
	},
	responsiveImage: {
		'max-width': '200px',
		width: '100%'
	},
	addMarginRight: {
		marginRight: '4px'
	},
	removeButton: {
		position: 'absolute',
		left: '10px',
		bottom: '10px'
	},
	chip: {
		margin: '2px'
	},
	overflowYVisibile: {
		'overflow-y': 'visible'
	},
	icon: {
		display: 'inline-block',
		'vertical-align': 'text-bottom',
		'margin-right': '.25em'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	}
});

class EmploymentRecordForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			job_title: '',
			job_description: '',
			country: '',
			f_month: '',
			f_year: '',
			t_month: '',
			t_year: '',
			business_type: '',
			supervisor_name: '',
			skills: [],
			sectors: [],
			employer_name: '',
			employer_address: '',
			number_of_employees_supervised: '',
			kind_of_employees_supervised: '',
			reason_for_leaving: '',
			errors: {},
			apiURL: '/api/p11-employment-records',
			isEdit: false,
			recordId: 0,
			sectors: '',
			untilNow: false,
      showLoading: false,
			proficiency: 0,
			isOpenRating: false,
			selectedSkill: '',
			software_skills: [],
			soft_skills: [],
			technical_skills: [],
		};

		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
   		this.clearState = this.clearState.bind(this);
		this.handleCloseRating = this.handleCloseRating.bind(this);
		this.handleSaveRating = this.handleSaveRating.bind(this);
	}

	componentDidMount() {
		if (isEmpty(this.props.years)) {
			this.props.getYears();
		}
		if (isEmpty(this.props.sectors)) {
			this.props.getSectors();
		}
		if (isEmpty(this.props.p11Countries)) {
			this.props.getP11Countries();
		}
		//reference event method from parent
		this.props.onRef(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEmpty(this.props.recordId)) {
			if (this.props.recordId !== '' && this.props.recordId !== prevProps.recordId) {
				this.getData(this.props.recordId);
			}
   		}

		if ((isEmpty(prevState.skills) && !isEmpty(this.state.skills)) || (isEmpty(prevState.sectors) && !isEmpty(this.state.sectors))) {
		this.setScrollHeight()
		}
	}

	onChange(e) {
    const numberRegex = /^[0-9\b]+$/;
    if (e.target.name === "number_of_employees_supervised" && !isEmpty(e.target.value)) {
      if (numberRegex.test(e.target.value)) {
        return this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
      }
    } else {
      return this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
    }
	}

	handleChangeCheckbox() {
		this.setState({ untilNow: !this.state.untilNow, reason_for_leaving: '' }, () => this.isValid());
	}

	async selectOnChange(value, e) {
		if (e.name == 'skills') {
			const check = this.state.skills.length < value.length ? true : false;
			this.setState({ skills: value, isOpenRating: check, selectedSkill: value.slice(-1)[0].label }, () => this.isValid());
		} else {
			this.setState({ [e.name]: value }, () => this.isValid());
		}
	}

	isValid() {
		const { errors, isValid } = validateEmploymentRecord(this.state);

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
					let {
						employer_name,
						job_title,
						job_description,
						country,
						from,
						to,
						business_type,
						supervisor_name,
						number_of_employees_supervised,
						kind_of_employees_supervised,
						reason_for_leaving,
						employer_address,
						sectors,
						skills,
						untilNow
					} = res.data.data;

					from = new Date(from);
					to = new Date(to);

					this.setState(
						{
							employer_name,
							job_title,
							job_description,
							employer_address,
							business_type,
							supervisor_name,
							number_of_employees_supervised: isEmpty(number_of_employees_supervised)
								? ''
								: number_of_employees_supervised,
							kind_of_employees_supervised: isEmpty(kind_of_employees_supervised)
								? ''
								: kind_of_employees_supervised,
							reason_for_leaving,
							country: { value: country.id, label: country.name },
							f_month: ('0' + (from.getMonth() + 1)).slice(-2),
							f_year: from.getFullYear(),
							t_month: ('0' + (to.getMonth() + 1)).slice(-2),
							t_year: to.getFullYear(),
							skills,
							technical_skills: skills.filter((skill) => skill.category === 'technical'),
							soft_skills: skills.filter((skill) => skill.category === 'soft'),
							software_skills: skills.filter((skill) => skill.category === 'software'),
							sectors,
							untilNow: untilNow == 1 ? true : false,
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

	async handleSave() {
		await this.setState({ proficiency: 1 });
		if (this.isValid()) {
			let uploadData = {
				from: this.state.f_year + '-' + this.state.f_month + '-01',
				employer_name: this.state.employer_name,
				business_type: this.state.business_type,
				number_of_employees_supervised: this.state.number_of_employees_supervised,
				country_id: this.state.country.value,
				job_title: this.state.job_title,
				job_description: this.state.job_description,
				skills: [...this.state.technical_skills, ...this.state.soft_skills, ...this.state.software_skills],
				sectors: this.state.sectors,
				untilNow: this.state.untilNow ? 1 : 0
			};

			if (!this.state.untilNow) {
				uploadData.to = this.state.t_year + '-' + this.state.t_month + '-01';
			}

			let recId = '';

			if (this.state.isEdit) {
				uploadData._method = 'PUT';
				recId = '/' + this.state.recordId;
			}

			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL + recId, uploadData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							this.props.updateList();
							this.props.addFlashMessage({
								type: 'success',
								text: 'Your employment record has been saved'
							});
							this.props.getP11();
							if (this.props.getProfileLastUpdate) {
								this.props.profileLastUpdate();
							}
							this.handleClose();
							this.setState({ proficiency: 0 });
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'Error'
							});
						});
					});
			});
		} else {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Please check error on the form'
			});
		}
	}

	handleClose() {
		this.setState(
			{
				employer_name: '',
				employer_address: '',
				business_type: '',
				supervisor_name: '',
				number_of_employees_supervised: '',
				kind_of_employees_supervised: '',
				reason_for_leaving: '',
				job_title: '',
				job_description: '',
				country: '',
				f_month: '',
				f_year: '',
				t_month: '',
				t_year: '',
				recordId: 0,
				skills: [],
				sectors: [],
				isEdit: false,
				untilNow: true,
				apiURL: '/api/p11-employment-records'
			},
			() => {
				this.props.onClose();
			}
		);
	}
	clearState() {
		this.setState({
			employer_name: '',
			employer_address: '',
			business_type: '',
			supervisor_name: '',
			number_of_employees_supervised: '',
			kind_of_employees_supervised: '',
			reason_for_leaving: '',
			job_title: '',
			job_description: '',
			country: '',
			f_month: '',
			f_year: '',
			t_month: '',
			t_year: '',
			recordId: 0,
			skills: [],
			sectors: [],
			isEdit: false,
			untilNow: true,
			apiURL: '/api/p11-employment-records'
		});
	}

	handleRemove() {
		this.props.handleRemove();
	}

	selectedFile(e) {
		this.setState({ diploma_file: e.target.files[0] });
  }

  setScrollHeight() {
    setTimeout(() => {
      let element = document.getElementById("dialogContent")
      if (!isEmpty(element.scrollHeight)) {
        if (element.scrollHeight !== element.scrollTop) {
          element.scrollTop = element.scrollHeight
        }
      }
    }, 25)
  }

  handleCloseRating() {
	const skills = this.state.skills.slice(0,-1);
	this.setState({isOpenRating: false, proficiency: 0, skills});
  }

  autoCompleteOnChange(name, value) {
	this.setState({ proficiency: value }, () => this.isValid());
  } 

  handleSaveRating() {
	this.isValid();
	if (isEmpty(this.state.errors.proficiency)) {
		let skills = this.state.skills;
		let skill = skills.slice(-1)[0];
		skill.proficiency = this.state.proficiency;
		skills = skills.slice(0,-1);
		skills.push(skill);

		this.setState({isOpenRating: false, proficiency: 0, skills });
	}
  }

	render() {
		let { isOpen, title, classes, p11Countries, remove, allSectors, years } = this.props;
		let {
			employer_name,
			job_title,
			business_type,
			job_description,
			country,
			supervisor_name,
			number_of_employees_supervised,
			kind_of_employees_supervised,
			reason_for_leaving,
			employer_address,
			f_month,
			f_year,
			t_month,
			t_year,
			skills,
			sectors,
			errors,
			untilNow,
			showLoading,
			proficiency,
			isOpenRating,
			selectedSkill,
			technical_skills
		} = this.state;

		return (
			<Dialog
				open={isOpen}
				fullWidth
				maxWidth="xl"
				onClose={this.handleClose}
				// PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent id="dialogContent">
					<Grid container spacing={24} alignItems="flex-end">
						<Grid item xs={12} sm={12}>
							<TextField
								required
								id="job_title"
								name="job_title"
								label="Exact title of the position"
								fullWidth
								value={job_title}
								autoComplete="job_title"
								onChange={this.onChange}
								error={!isEmpty(errors.job_title)}
								helperText={errors.job_title}
							/>
						</Grid>

						<Grid item xs={12} sm={12} style={{ paddingBottom: 0 }}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={untilNow}
											onChange={this.handleChangeCheckbox}
											value={untilNow.toString()}
											color="primary"
										/>
									}
									label="Current position"
								/>
							</FormGroup>
						</Grid>
						<Grid item xs={12} sm={3} style={{ paddingTop: 0 }}>
							<TextField
								required
								id="f_month"
								name="f_month"
								select
								label="From (Month)"
								value={f_month}
								onChange={this.onChange}
								error={!isEmpty(errors.f_month)}
								helperText={errors.f_month}
								margin="normal"
								fullWidth
								className={classes.capitalize}
								autoFocus
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
						<Grid item xs={12} sm={3} style={{ paddingTop: 0 }}>
							<TextField
								required
								id="f_year"
								name="f_year"
								select
								label="From (Year)"
								value={f_year}
								onChange={this.onChange}
								error={!isEmpty(errors.f_year)}
								helperText={errors.f_year}
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
						{untilNow && <Grid item sm={6} style={{ paddingTop: 0 }} />}

						{!untilNow && (
							<Grid item xs={12} sm={3} style={{ paddingTop: 0 }}>
								<TextField
									required
									id="t_month"
									name="t_month"
									select
									label="To (Month)"
									value={t_month}
									onChange={this.onChange}
									error={!isEmpty(errors.t_month)}
									helperText={errors.t_month}
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
						)}

						{!untilNow && (
							<Grid item xs={12} sm={3} style={{ paddingTop: 0 }}>
								<TextField
									required
									id="t_year"
									name="t_year"
									select
									label="To (Year)"
									value={t_year}
									onChange={this.onChange}
									error={!isEmpty(errors.t_year)}
									helperText={errors.t_year}
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
						)}

						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="employer_name"
								name="employer_name"
								label="Name of Employer"
								fullWidth
								value={employer_name}
								autoComplete="employer_name"
								onChange={this.onChange}
								error={!isEmpty(errors.employer_name)}
								helperText={errors.employer_name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="business_type"
								name="business_type"
								label="Type of Business"
								fullWidth
								value={business_type}
								autoComplete="business_type"
								onChange={this.onChange}
								error={!isEmpty(errors.business_type)}
								helperText={errors.business_type}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								id="number_of_employees_supervised"
								name="number_of_employees_supervised"
								label="Number of Employees Supervised by You"
								fullWidth
								value={number_of_employees_supervised}
								autoComplete="number_of_employees_supervised"
								onChange={this.onChange}
								error={!isEmpty(errors.number_of_employees_supervised)}
								helperText={errors.number_of_employees_supervised}
							/>
						</Grid>
						<Grid item xs={12}>
							<SelectField
								label="Country *"
								options={p11Countries}
								value={country}
								onChange={this.selectOnChange}
								placeholder="Select country"
								isMulti={false}
								name="country"
								error={errors.country}
								required
								fullWidth={true}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id="job_description"
								name="job_description"
								label="Describe you duties?"
								value={job_description}
								onChange={this.onChange}
								error={!isEmpty(errors.job_description)}
								helperText={errors.job_description}
								fullWidth
								multiline
								rows={5}
							/>
						</Grid>
						<Grid item xs={12}>
							<SkillPicker
								name="technical_skills"
								skills={skills}
								onChange={this.selectOnChange}
								errors={errors.skills}
								onMenuOpenOrClose={this.setScrollHeight}
								category="technical"
								label="technical Skills *"
								// limit={5}
							/>
						</Grid>
						<Grid item xs={12}>
							<SkillPicker
								name="soft_skills"
								skills={skills}
								onChange={this.selectOnChange}
								errors={errors.skills}
								onMenuOpenOrClose={this.setScrollHeight}
								category="soft"
								label="Soft Skills *"
								// limit={5}
							/>
						</Grid>
						<Grid item xs={12}>
							<SkillPicker
								name="software_skills"
								skills={skills}
								onChange={this.selectOnChange}
								errors={errors.skills}
								onMenuOpenOrClose={this.setScrollHeight}
								category="software"
								label="Software Skills*"
								// limit={5}
							/>
						</Grid>
						<Grid item xs={12}>
							<SectorPicker
								name="sectors"
								sectors={sectors}
								onChange={this.selectOnChange}
								errors={errors.sectors}
								onMenuOpenOrClose={this.setScrollHeight}
								limit={3}
							/>
						</Grid>
					</Grid>
					<Dialog open={isOpenRating} maxWidth="lg" onClose={this.handleCloseRating}>
						<DialogTitle>Add Rating for "{selectedSkill}"</DialogTitle>
						<DialogContent>
							<Grid container spacing={24}>
								<Grid item xs={12}>
									<FormControl fullWidth error={!isEmpty(errors.proficiency) ? true : false}>
										<FormLabel>Proficiency Rating</FormLabel>
										<Rating
											value={proficiency}
											max={5}
											name="proficiency"
											classes={{
												iconButton: classes.iconButton,
												root: classes.rootRating
											}}
											onChange={(value) => this.autoCompleteOnChange('proficiency', value)}
											iconFilled={<Star color="primary" />}
											iconHovered={<Star color="primary" />}
											iconNormal={<StarBorder color="primary" />}
										/>
										{!isEmpty(errors.proficiency) && <FormHelperText>{errors.proficiency}</FormHelperText>}
									</FormControl>
								</Grid>
							</Grid>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleCloseRating} color="secondary" variant="contained">
								Close
							</Button>
							<Button onClick={this.handleSaveRating} color="primary" variant="contained">
								Save
							</Button>
						</DialogActions>
					</Dialog>
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
					<div>
						<Button onClick={this.handleClose} color="secondary" variant="contained">
							Close
						</Button>
						<Button
							onClick={this.handleSave}
							color="primary"
							variant="contained"
							style={{ marginLeft: '5px' }}
						>
							<SaveIcon fontSize="small" className={classes.addMarginRight} /> Save{' '}
							{showLoading && <CircularProgress className={classes.loading} size={22} thickness={5} />}
						</Button>
					</div>
				</DialogActions>
			</Dialog>
		);
	}
}

EmploymentRecordForm.defaultProps = {
	getProfileLastUpdate: false
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage,
	getYears,
	getSectors,
	getP11Countries,
	profileLastUpdate
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	years: state.options.years,
	allSectors: state.options.sectors,
	p11Countries: state.options.p11Countries
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EmploymentRecordForm));
