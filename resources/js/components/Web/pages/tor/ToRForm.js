/** import React, classnames, momentjs, React Loadable, arrayMove, React Helmet and PropTypes */
import React, { Component } from 'react';
import classname from 'classnames';
import moment from 'moment';
import Loadable from 'react-loadable';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import Add from '@material-ui/icons/Add';
import Star from '@material-ui/icons/Star';

/** import fontawesome icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import {
	onChange,
	getLevels,
	getDurations,
	getJobStandards,
	getMailingAddress,
	getFormData,
	checkError,
	getCategories,
	getMatching,
	onSubmit,
	onReset,
	duplicateToR
} from '../../redux/actions/tor/torFormActions';
import { getCountries, getImmapOffices } from '../../redux/actions/optionActions';
import { getAllSbpSkillsets } from '../../redux/actions/dashboard/roster/rosterProcessActions'
import { getPDF } from '../../redux/actions/common/PDFViewerActions';
import { can } from '../../permissions/can';

/** import configuration value */
import {
	blueIMMAP,
	white,
	recommendationColor,
	recommendationHoverColor,
	primaryColorHover,
	primaryColor,
	green,
	greenHover,
	iMMAPSecondaryColor2022,
	iMMAPSecondaryColor2022Hover
} from '../../config/colors';
import { statusOptions, organizationOptions, clusterOptions } from '../../config/options';
import { APP_NAME } from '../../config/general';


/** import custom components */
import Btn from '../../common/Btn';
import isEmpty from '../../validations/common/isEmpty';
import { validate } from '../../validations/HR/ToR';
import LoadingSpinner from '../../common/LoadingSpinner';
import PDFViewer from '../../common/pdf-viewer/PDFViewer';
const HRJobCategoryRequirements = Loadable({
	loader: () => import('../dashboard/HR/jobCategoryRequirements/requirements'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

const JobCategorySubSection = Loadable({
	loader: () => import('../dashboard/HR/jobCategorySubSection/JobCategorySubSection'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

const SelectField = Loadable({
	loader: () => import('../../common/formFields/SelectField'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

const DatePickerStringValue = Loadable({
	loader: () => import('../../common/formFields/DatePickerStringValue'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

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
	loading: {
		margin: theme.spacing.unit * 2 + 'px auto',
		display: 'block'
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	duty: {
		'margin-bottom': '8px'
	},
	viewBtn: {
		marginRight: '8px',
		background: blueIMMAP,
		[theme.breakpoints.down('sm')]: {
			float: 'left'
		}
	},
	addBtn: {
		[theme.breakpoints.down('xs')]: {
			// float: 'left',
			width: '100%',
			// display: 'block',
			marginRight: theme.spacing.unit,
			marginBottom: theme.spacing.unit
		}
	},
	isLoading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	switch: {
		marginLeft: 0
	},
	pdf: {
		'background-color': primaryColor,
		'margin-right': theme.spacing.unit,
		padding: '5px 12px',
		color: white,
		'&:hover': {
			'background-color': primaryColorHover
		},
		[theme.breakpoints.down('xs')]: {
			width: '100%',
			marginRight: theme.spacing.unit,
			marginBottom: theme.spacing.unit
		}
	},
	recommendation: {
		'background-color': recommendationColor,
		'margin-right': theme.spacing.unit,
		color: white,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
	},
	fontAwesome: {
		width: '1.1em !important',
		'margin-right': '4px'
	},
	btnContainer: {
		'text-align': 'right',
		[theme.breakpoints.down('sm')]: {
			'text-align': 'center'
		}
	},
	pageTitle: {
		[theme.breakpoints.down('sm')]: {
			'text-align': 'center'
		}
	},
	check: {
		padding: '8px 12px'
	},
	noMarginTop: {
		marginTop: 0
	},
	switchBase: {
		height: 'auto'
	},
	addAsJobBtn :{
		'background-color': green,
		'margin-left': theme.spacing.unit,
		color: white,
		'&:hover': {
			'background-color': greenHover
		},
  },
	duplicate: {
		'background-color': iMMAPSecondaryColor2022,
		'margin-right': theme.spacing.unit,
		padding: '5px 12px',
		color: white,
		'&:hover': {
			'background-color': iMMAPSecondaryColor2022Hover
		},
		[theme.breakpoints.down('xs')]: {
			width: '100%',
			marginRight: theme.spacing.unit,
			marginBottom: theme.spacing.unit
		}
	}
});

/**
 * ToRForm is a component to show add and edit ToR page
 *
 * @name ToRForm
 * @component
 * @category Page
 * @subcategory ToR
 *
 */
class ToRForm extends Component {
	constructor(props) {
		super(props);
		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.dateOnChange = this.dateOnChange.bind(this);
		this.jobStandardOnChange = this.jobStandardOnChange.bind(this);
		this.jobCategoryOnChange = this.jobCategoryOnChange.bind(this);
		this.addSection = this.addSection.bind(this);
		this.updateSection = this.updateSection.bind(this);
		this.deleteSection = this.deleteSection.bind(this);
		this.requirementsOnChange = this.requirementsOnChange.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
		this.switchOnChangeShare = this.switchOnChangeShare.bind(this);
		this.moveArray = this.moveArray.bind(this);
		this.addSectionBelow = this.addSectionBelow.bind(this);
	}

  /**
   * componentWillMount is a lifecycle function called where the component will be mounted
   */
	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			const oldToRId = this.props.torForm.id;
			this.props.onChange("apiURL", '/api/tor/' + this.props.match.params.id)
			this.props.onChange("id", this.props.match.params.id)
			this.props.onChange("redirectURL", '/tor/' + this.props.match.params.id + '/edit')
			this.props.onChange("redirectURL", '/tor/' + this.props.match.params.id + '/edit')
			this.props.onChange("isEdit", true).then(() => {
				let check = typeof this.props.location.state !== 'undefined' ? true : false;
				let loadData = check ? (this.props.location.state.fromEdit ? true : false) : false;
				if (!(this.props.torForm.change) || oldToRId != this.props.match.params.id || !loadData) {
					this.props.getFormData().then(() => this.isValid())
				}
			})
		}
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
    this.props.getAllSbpSkillsets();
		this.props.getCountries();
		this.props.getImmapOffices();
		this.props.getLevels();
		this.props.getDurations();
		this.props.getJobStandards();
		this.props.getMailingAddress()
        this.isValid();
	}

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   */
	componentDidUpdate(prevProps) {
		const prevFormData = JSON.stringify(prevProps.torForm);
		const currentFormData = JSON.stringify(this.props.torForm);

		if (prevFormData !== currentFormData) {
			this.isValid();
		}

		const currentCountries = JSON.stringify(this.props.countries);
		const prevCountries = JSON.stringify(prevProps.countries);

		if (prevCountries !== currentCountries) {
			this.props.getCountries();
		}

		const currentImmapOffices = JSON.stringify(this.props.immap_offices);
		const prevImmapOffices = JSON.stringify(prevProps.immap_offices);

		if (prevImmapOffices !== currentImmapOffices) {
			this.props.getImmapOffices();
		}
	}

  /**
   * switchOnChangeShare is a function to handle change of data related to cost allocation between HQ
   * @param {Event} e
   */
	switchOnChangeShare(e) {
		let { value } = e.target;
		let boleanData = value === 'false' ? false : true;
		this.props.onChange("hq_us", boleanData ? this.props.torForm.hq_us : '')
		this.props.onChange("hq_france", boleanData ? this.props.torForm.hq_france : '')
		this.props.onChange(e.target.name, !boleanData)
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * isValid is a function to handle validation on the ToR Form
   * @returns {Boolean}
   */
	isValid() {
		let { errors, isValid } = validate(this.props.torForm);
		this.props.checkError(errors, isValid, true);
		return isValid;
	}

  /**
   * onChange is a function to handle change of the data in the form
   * @param {Event} e
   */
	onChange(e) {
		this.props.onChange(e.target.name, e.target.value)
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * selectOnChange is a function to handle change of data for select field
   * @param {*} value
   * @param {object} e
   */
	selectOnChange(value, e) {
		this.props.onChange(e.name, value)

    if (e.name === "country") {
      switch(value.label) {
        case "Home Based": this.props.onChange("duty_station", "Home Based");
          break;
        default: this.props.onChange("duty_station", "");
      }
    }

		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * dateOnChange is a function to handle change of date in the form
   * @param {Event} e
   */
	dateOnChange(e) {
		this.props.onChange(e.target.name, moment(e.target.value).format('YYYY-MM-DD'))
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * jobStandardOnChange is a function to handle the change of data in job standard select field
   * @param {*} value
   * @param {object} e
   */
	jobStandardOnChange(value, e) {
		this.props.onChange(e.name, value).then(() => {
			this.props.getCategories(value.value);
		})
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * jobCategoryOnChange is a function to handle change of data in job category select field
   * @param {*} value
   * @param {object} e
   */
	jobCategoryOnChange(value, e) {
		this.props.onChange('matching_requirements', [])
		this.props.onChange('sub_sections', [])
		this.props.onChange(e.name, value).then(() => {
			if (value.value == 0) {
				this.props.onChange('other_category_open', true)
				this.props.onChange('sub_sections', [
					{
						sub_section: 'Organization',
						sub_section_content:
							'<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>',
						level: 0
					},
					{
						sub_section: 'Background',
						sub_section_content: '<p><em>Country specific</em></p>',
						level: 1
					},
					{
						sub_section: 'Description of Duties',
						sub_section_content: '',
						level: 2
					},
					{
						sub_section: 'Requirements',
						sub_section_content: '',
						level: 3
					}
				])

			} else {
				this.props.getMatching(value.value)
			}
		})
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * requirementsOnChange is a function handle change of data in matching requirement
   * @param {*} matching_requirements
   */
	requirementsOnChange(matching_requirements) {
		this.props.onChange('matching_requirements', matching_requirements)
    this.isValid();

		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * onSubmit is a function to handle form submission
   * @param {Event} e
   */
	onSubmit(e) {
		e.preventDefault();
		this.props.onSubmit(this.props.history)
	}

  /**
   * addSection is a function to add sub section
   */
	addSection() {
		let { sub_sections, default_section } = this.props.torForm;
		sub_sections.push(default_section);
		this.props.onChange('sub_sections', sub_sections)
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * updateSection is a function to handle change of data in the sub section
   * @param {*} level
   * @param {*} sectionData
   * @param {*} section_errors
   */
	updateSection(level, sectionData, section_errors) {
		let { sub_sections, errors } = this.props.torForm;
		sub_sections[level] = sectionData;
		if (!isEmpty(section_errors)) {
			errors.sub_sections = 'There is an error from one of the section';
		} else if (!isEmpty(errors.sub_sections) && isEmpty(section_errors)) {
			delete errors.sub_sections;
		}

		this.props.onChange('errors', errors)
		this.props.onChange('sub_sections', sub_sections)
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * deleteSection is a function to delete sub section
   * @param {number} level
   */
	deleteSection(level) {
		let { sub_sections } = this.props.torForm;
		sub_sections.splice(level, 1);
		this.props.onChange('sub_sections', sub_sections);
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

  /**
   * switchOnChange is a function to handle of data of the switch field
   * @param {Event} e
   */
	switchOnChange(e) {
		const defaultMailingAddress = {
			is_immap_inc: '10 rue Stanislas Torrents - 13006 Marseille',
			is_immap_france: '10 rue Stanislas Torrents - 13006 Marseille'
		}
		if (this.props.torForm[e.target.name]) {
			if (e.target.name == 'is_immap_inc') {
				this.props.onChange(e.target.name, 0).then(() => {
					this.props.onChange('is_immap_france', 1);
					this.props.onChange('mailing_address', defaultMailingAddress['is_immap_france'])
				})
			} else {
				this.props.onChange(e.target.name, 0).then(() => {
					this.props.onChange('is_immap_inc', 1);
					this.props.onChange('mailing_address', defaultMailingAddress['is_immap_inc'])
				})
			}
		} else {
			if (e.target.name == 'is_immap_inc') {
				this.props.onChange(e.target.name, 1).then(() => {
					this.props.onChange('is_immap_france', 0);
					this.props.onChange('mailing_address', defaultMailingAddress['is_immap_inc'])
				})
			} else {
				this.props.onChange(e.target.name, 1).then(() => {
					this.props.onChange('is_immap_inc', 0);
					this.props.onChange('mailing_address', defaultMailingAddress['is_immap_france'])
				})
			}
		}
		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

   /**
   * moveArray is a function to move section up or down into an array
   * @param {string} action
   * @param {number} index
   */
	moveArray(action, index) {
		let { sub_sections } = this.props.torForm;
		let newIndex = (index > 0 && action == "up") ? index - 1 : (index < sub_sections.length - 1 && action == "down") ? index + 1 : index;
		if (index != newIndex) {
		  let newSubSections = arrayMove(sub_sections, index, newIndex);
		  this.props.onChange('sub_sections', newSubSections);
		}

		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}
	}

   /**
   * addSectionBelow is a function to add new section below the current section
   * @param {number} index
   */
	addSectionBelow(index) {
		let { sub_sections, default_section } = this.props.torForm;
		sub_sections.splice(index + 1, 0, default_section);
		this.props.onChange('sub_sections', sub_sections);

		//set parameter change
		if (!(this.props.torForm.change)) {
			this.props.onChange('change', true)
		}

	}

	render() {
		const { classes, countries, immap_offices, torForm, skillsets, onChange } = this.props;
		const {
			jobLevels,
			durations,
			jobStandard,
			jobStandards,
			mailing_address,
			title,
			contract_start,
			contract_end,
			relationship,
			duty_station,
			country,
			errors,
			isEdit,
			organization,
			jobCategories,
			jobCategory,
			jobLevel,
			sub_sections,
			program_title,
			duration,
			matching_requirements,
			isLoading,
			max_salary,
			min_salary,
			is_immap_inc,
			is_immap_france,
			is_international,
			with_template,
			is_organization,
			immap_office,
      		skillset,
			hq_us,
			hq_france,
			is_shared,
			other_category_open,
			loading,
			other_category,
			cluster,
			cluster_seconded,
			duplicatingLoading
		 } = torForm;

		let organizationList = [...organizationOptions];
		if(organization && organization.value && !organizationList.find(v =>v.value === (organization.value))) {
			organizationList.push({value: organization.value, label: organization.value});
		}

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? APP_NAME + ' - Edit ToR > ' + title + ' - ' + country.label : APP_NAME + ' - Add ToR'}
					</title>
					<meta
						name="description"
						content={isEdit ? APP_NAME + ' ToR >' + title + ' - ' + country.label : APP_NAME + ' Add ToR'}
					/>
				</Helmet>
				{loading ? <CircularProgress
					color="primary"
					size={24}
					thickness={5}
					className={classes.loading}
					disableShrink
				/> : <Paper className={classes.paper}>
						<Grid container spacing={16} alignItems="flex-end">
							<Grid item xs={12} sm={12} md={4} lg={5}>
								<Typography variant="h5" component="h3" className={classes.pageTitle}>
									{isEdit ? 'Edit ToR : ' + title : 'Add ToR' }
								</Typography>
							</Grid>
							<Grid item xs={12} sm={12} md={8} lg={7}>
								<div className={classes.btnContainer}>
									{isEdit ? (
										<Button
											variant="contained"
											size="small"
											className={classes.pdf}
											onClick={() =>
												this.props.getPDF('/api/tor/' + this.props.match.params.id + '/pdf')}
										>
											<FontAwesomeIcon
												icon={faFilePdf}
												size="lg"
												className={classes.fontAwesome}
											/>{' '}
									View ToR
										</Button>
									) : null}
									{isEdit ? (
										<Button
											variant="contained"
											size="small"
											className={classes.duplicate}
											disabled={duplicatingLoading}
											onClick={() => this.props.duplicateToR(this.props.match.params.id, this.props.history )}
										>
											<FontAwesomeIcon
												icon={faCopy}
												size="lg"
												className={classes.fontAwesome}
											/>{' '} Duplicate ToR {duplicatingLoading ? <CircularProgress className={classes.isLoading} size={22} thickness={5} /> : null}
										</Button>
									) : null}
									{isEdit ? (
										<Btn
											link={'/tor/' + this.props.match.params.id + '/recommendations'}
											btnText="Recommendations"
											btnStyle="contained"
											color="primary"
											size="small"
											icon={<Star />}
											className={classname(classes.addBtn, classes.recommendation)}
										/>
									) : null}
									{isEdit ? (
										<Btn
											onClick={() => this.props.onReset()}
											link="/tor/add"
											btnText="Add ToR"
											btnStyle="contained"
											color="primary"
											size="small"
											icon={<Add />}
											className={classes.addBtn}
										/>
									) : null}
									{isEdit && can('Add Job') ? (
										<Btn
											link={
												{
													pathname: "/jobs/create",
													tor: {
														value:this.props.match.params.id,
														label : title,
														under_sbp_program: jobStandard.under_sbp_program,
														sbp_recruitment_campaign: jobStandard.sbp_recruitment_campaign
													}
											   }
										   }
											btnText="Add As A Job"
											btnStyle="contained"
											color="primary"
											size="small"
											icon={<Add />}
											className={classes.addAsJobBtn}
										/>
									) : null}

								</div>
							</Grid>

							<Grid item xs={12}>
								<SelectField
									label="Select Job Standard *"
									margin="dense"
									options={jobStandards}
									value={jobStandard}
									placeholder="Choose Job Standard"
									isMulti={false}
									name="jobStandard"
									fullWidth
									onChange={this.jobStandardOnChange}
									error={errors.jobStandard}
									required
									autoFocus
								/>
							</Grid>
							{(jobCategories.length > 0) ? (
								<Grid item xs={12}>
									<SelectField
										label="Select Job Category *"
										margin="dense"
										options={jobCategories}
										value={jobCategory}
										placeholder="Choose Job Category"
										isMulti={false}
										name="jobCategory"
										fullWidth
										onChange={this.jobCategoryOnChange}
										error={errors.jobCategory}
										required
										autoFocus
									/>
								</Grid>
							) : null}
							{other_category_open ? (
								<Grid item xs={12}>
									<TextField
										id="other_category"
										label="Specifiy Job Category Name"
										autoComplete="other_category"
										margin="dense"
										required
										fullWidth
										name="other_category"
										value={other_category}
										onChange={this.onChange}
										error={!isEmpty(errors.other_category)}
										helperText={errors.other_category}
									/>
								</Grid>
							) : null}
							<Grid item xs={12}>
								<SelectField
									label="Select Job Level *"
									margin="dense"
									options={jobLevels}
									value={jobLevel}
									placeholder="Choose Job Level"
									isMulti={false}
									name="jobLevel"
									fullWidth
									onChange={this.selectOnChange}
									error={errors.jobLevel}
									required
									autoFocus
								/>
							</Grid>
							{(jobStandard.sbp_recruitment_campaign === "yes" || jobStandard.under_sbp_program === "yes") && (
								<Grid item xs={12}>
								<SelectField
									label="Profiles"
									options={skillsets}
									value={skillsets.find((s) => s.value === skillset)}
									onChange={(value, e) => onChange(e.name, value.value)}
									placeholder="Please select the Profiles"
									isMulti={false}
									name="skillset"
									fullWidth={true}
									margin="dense"
									error={errors.skillset}
								/>
								</Grid>
							)}
							<Grid item xs={12}>
								<TextField
									id="title"
									label="Title"
									autoComplete="title"
									margin="dense"
									required
									fullWidth
									name="title"
									value={title}
									onChange={this.onChange}
									error={!isEmpty(errors.title)}
									helperText={errors.title}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControl margin="none" error={!isEmpty(errors.is_international)}>
									<FormControlLabel
										className={classes.switch}
										labelPlacement="start"
										control={
											<Switch
												checked={is_international === 1 ? true : false}
												onChange={(e) =>
													this.selectOnChange(is_international == 1 ? 0 : 1, {
														name: e.target.name
													})}
												value={is_international === 1 ? true : false}
												color="primary"
												name="is_international"
												classes={{ switchBase: classes.switchBase }}
											/>
										}
										label="International Staff ?"
									/>
									{!isEmpty(errors.is_international) ? (
										<FormHelperText>{errors.is_international}</FormHelperText>
									) : null}
								</FormControl>
							</Grid>
							<Grid item xs={12} className={classes.hq}>
								<Typography variant="caption">Choose iMMAP Headquarter</Typography>
								<Grid container spacing={16}>
									<Grid item xs={12} sm={6} className={classes.hq}>
										<FormControl margin="none" error={!isEmpty(errors.is_immap_inc)}>
											<FormControlLabel
												control={
													<Checkbox
														checked={is_immap_inc === 1 ? true : false}
														name="is_immap_inc"
														color="primary"
														onChange={this.switchOnChange}
														className={classes.check}
													/>
												}
												label="3iSolution"
											/>
											{!isEmpty(errors.is_immap_inc) ? (
												<FormHelperText className={classes.noMarginTop}>
													{errors.is_immap_inc}
												</FormHelperText>
											) : null}
										</FormControl>
									</Grid>
									<Grid item xs={12} sm={6} className={classes.hq}>
										<FormControl margin="none" error={!isEmpty(errors.is_immap_france)}>
											<FormControlLabel
												control={
													<Checkbox
														checked={is_immap_france === 1 ? true : false}
														name="is_immap_france"
														color="primary"
														onChange={this.switchOnChange}
														className={classes.check}
													/>
												}
												label="iMMAP France"
											/>
											{!isEmpty(errors.is_immap_france) ? (
												<FormHelperText className={classes.noMarginTop}>
													{errors.is_immap_france}
												</FormHelperText>
											) : null}
										</FormControl>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<FormControlLabel
									className={classes.switch}
									labelPlacement="start"
									label="Shared Cost Allocation Between iMMAP HQ"
									control={
										<Switch
											id="is_shared"
											name="is_shared"
											onChange={this.switchOnChangeShare}
											checked={is_shared}
											value={is_shared}
											color="primary"
											classes={{ switchBase: classes.switchBase }}
										/>
									}
								/>
							</Grid>

							{is_shared ? (
								<Grid item xs={12} sm={6}>
									<TextField
										id="hq_us"
										label="3iSolution (%)"
										margin="none"
										fullWidth
										type="number"
										name="hq_us"
										value={hq_us}
										onChange={this.onChange}
										error={!isEmpty(errors.hq_us)}
										helperText={errors.hq_us}
									/>
								</Grid>
							) : null}
							{is_shared ? (
								<Grid item xs={12} sm={6}>
									<TextField
										id="hq_france"
										label="iMMAP France (%)"
										margin="none"
										fullWidth
										type="number"
										name="hq_france"
										value={hq_france}
										onChange={this.onChange}
										error={!isEmpty(errors.hq_france)}
										helperText={errors.hq_france}
									/>
								</Grid>
							) : null}

							{ (jobStandard.sbp_recruitment_campaign == "no" && jobStandard.under_sbp_program == "no") &&
								<Grid item xs={12} sm={6}>
									<SelectField
										label="iMMAP Office *"
										options={immap_offices}
										value={immap_office}
										onChange={this.selectOnChange}
										placeholder="Select iMMAP Office"
										isMulti={false}
										name="immap_office"
										error={errors.immap_office}
										required
										fullWidth={true}
										margin="none"
									/>
								</Grid>
							}
							<Grid item xs={12} sm={6}>
								<SelectField
									label="Status *"
									options={statusOptions.filter(o => o.isInternational === is_international || o.isInternationalAndNational)}
									value={relationship}
									onChange={this.selectOnChange}
									placeholder="Select Status"
									isMulti={false}
									name="relationship"
									error={errors.relationship}
									required
									fullWidth={true}
									margin="none"
								/>
							</Grid>
							{jobStandard.sbp_recruitment_campaign != "yes" &&
								<>
                  					<Grid item xs={12} sm={6}>
										<SelectField
											label="Country *"
											options={countries}
											value={country}
											onChange={this.selectOnChange}
											placeholder="Select Country"
											isMulti={false}
											name="country"
											error={errors.country}
											required
											fullWidth={true}
                    						margin="dense"
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											id="duty_station"
											label="Duty Station"
											autoComplete="duty_station"
											margin="dense"
											required
											fullWidth
											name="duty_station"
											value={duty_station}
											onChange={this.onChange}
											error={!isEmpty(errors.duty_station)}
											helperText={errors.duty_station}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<DatePickerStringValue
											label="Contract Start *"
											name="contract_start"
											value={contract_start}
											onChange={this.dateOnChange}
											error={errors.contract_start}
											margin="dense"
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<DatePickerStringValue
											label="Contract End *"
											name="contract_end"
											value={contract_end}
											onChange={this.dateOnChange}
											error={errors.contract_end}
											margin="dense"
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<SelectField
											label="Host Agency *"
											options={organizationList}
											value={organization}
											onChange={this.selectOnChange}
											placeholder="Select "
											isMulti={false}
											name="organization"
											error={errors.organization}
											helperText={errors.organization}
											required
											fullWidth={true}
                     						 margin="dense"
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
                   					 {/* KEEP THIS SELECT FIELD UNTIL WE WORKING ON THE FLOW OF CLUSTER/SECTOR USER STORY */}
										{/* <SelectField
											label={jobStandard.under_sbp_program === "yes" ? "Cluster Seconded To *" : "Cluster Seconded To" }
											options={clusterOptions}
											value={cluster_seconded}
											onChange={this.selectOnChange}
											placeholder="Select "
											isMulti={false}
											name="cluster_seconded"
											error={errors.cluster_seconded}
											helperText={errors.cluster_seconded}
											required={jobStandard.under_sbp_program === "yes" ? true : false}
											fullWidth={true}
										/> */}
                  						 <TextField
											id="cluster_seconded"
											label="Cluster Seconded To"
											margin="dense"
											required={jobStandard.under_sbp_program === "yes" ? true : false }
											fullWidth
											name="cluster_seconded"
											value={cluster_seconded}
											onChange={this.onChange}
											error={!isEmpty(errors.cluster_seconded)}
											helperText={errors.cluster_seconded}
										/>
									</Grid>
								</>
							}
							<Grid item xs={12} sm={6}>
								<TextField
									id="program_title"
									label="Program Title"
									autoComplete="program_title"
									margin="dense"
									required
									fullWidth
									name="program_title"
									value={program_title}
									onChange={this.onChange}
									error={!isEmpty(errors.program_title)}
									helperText={errors.program_title}
								/>
							</Grid>
							<Grid item xs={12} sm={jobStandard.sbp_recruitment_campaign != "yes" ? 6 : 12}>
								<SelectField
									label="Type *"
									options={durations}
									value={duration}
									onChange={this.selectOnChange}
									placeholder="Select Type"
									isMulti={false}
									name="duration"
									error={errors.duration}
									required
									fullWidth={true}
									margin="dense"
								/>
							</Grid>
							{jobStandard.sbp_recruitment_campaign != "yes" &&
								<>
									<Grid item xs={12} sm={6}>
									<TextField
										required
										id="min_salary"
										name="min_salary"
										label="Minimum Fees (USD)"
										fullWidth
										value={min_salary}
										autoComplete="min_salary"
										onChange={this.onChange}
										error={!isEmpty(errors.min_salary)}
										helperText={errors.min_salary}
										InputProps={{
											startAdornment: <InputAdornment position="start">$</InputAdornment>
										}}
									/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											required
											id="max_salary"
											name="max_salary"
											label="Maximum Fees (USD)"
											fullWidth
											value={max_salary}
											autoComplete="max_salary"
											onChange={this.onChange}
											error={!isEmpty(errors.max_salary)}
											helperText={errors.max_salary}
											InputProps={{
												startAdornment: <InputAdornment position="start">$</InputAdornment>
											}}
										/>
									</Grid>
								</>
							}
							<Grid item xs={12}>
								<TextField
									id="mailing_address"
									label="Mailing Address"
									autoComplete="mailing_address"
									margin="dense"
									required
									fullWidth
									name="mailing_address"
									value={mailing_address}
									onChange={this.onChange}
									error={!isEmpty(errors.mailing_address)}
									helperText={errors.mailing_address}
									multiline={true}
									rows={5}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button variant="contained" color="primary" size="small" onClick={this.addSection}>
									<Add size="small" /> Add Section
								</Button>
								<br />
								<FormControl error={!isEmpty(errors.sub_sections)} fullWidth>
									{(sub_sections.length > 0) ?
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
										}) : null}
									{!isEmpty(errors.sub_sections) ? (
										<FormHelperText>{errors.sub_sections}</FormHelperText>
									) : null}
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
									disabled={!isEmpty(errors)}
								>
									<Save /> Save{' '}
									{isLoading ? <CircularProgress className={classes.isLoading} size={22} thickness={5} /> : null}
								</Button>
							</Grid>
						</Grid>
						<PDFViewer />
					</Paper>}
			</form>
		);
	}
}

ToRForm.propTypes = {
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
	getAPI: PropTypes.func.isRequired,
  /**
   * onChange is a prop containing redux action to change state of data in torFormReducer
   */
	onChange: PropTypes.func.isRequired,
  /**
   * getLevels is a prop containing redux action to get job level data
   */
	getLevels: PropTypes.func.isRequired,
  /**
   * getDurations is a prop containing redux action to get duration data
   */
	getDurations: PropTypes.func.isRequired,
  /**
   * getJobStandards is a prop containing redux action to get job standard data
   */
	getJobStandards: PropTypes.func.isRequired,
  /**
   * getMailingAddress is a prop containing redux action to get mailing address data
   */
	getMailingAddress: PropTypes.func.isRequired,
  /**
   * checkError is a prop containing redux action to handle check form error data
   */
	checkError: PropTypes.func.isRequired,
  /**
   * getJobStandards is a prop containing redux action to get job standard data
   */
	getCategories: PropTypes.func.isRequired,
  /**
   * getFormData is a prop containing redux action to get the form data
   */
	getFormData: PropTypes.func.isRequired,
  /**
   * getMatching is a prop containing redux action to get matching requirement and sub sections data
   */
	getMatching: PropTypes.func.isRequired,
  /**
   * onSubmit is a prop containing redux action to submit the ToR Form
   */
	onSubmit: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux action to call an api using POST HTTP Request
   */
	postAPI: PropTypes.func.isRequired,
  /**
   * getCountries is a prop containing redux action to get countries data
   */
	getCountries: PropTypes.func.isRequired,
  /**
   * onReset is a prop containing redux action to reset the data inside the form
   */
	onReset: PropTypes.func.isRequired,
  /**
   * getImmapOffices is a prop containing redux action to get immap offices data
   */
	getImmapOffices: PropTypes.func.isRequired,
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
	classes: PropTypes.object.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
	addFlashMessage: PropTypes.func.isRequired,
  /**
   * countries is a prop containing list of countries data
   */
	countries: PropTypes.array,
  /**
   * immap_offices is a prop containing list of immap offices data
   */
	immap_offices: PropTypes.array,
  /**
   * skillsets is a prop containig list of roster skillsets
   */
  skillsets: PropTypes.array.isRequired,
  /**
   * getAllSbpSkillsets is a prop containing redux action to get roster skillset
   */
   getAllSbpSkillsets: PropTypes.func.isRequired,
   /**
   * duplicateToR is a prop containing redux action to duplicate the current ToR
   */
	duplicateToR: PropTypes.func.isRequired,
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
	getCountries,
	getImmapOffices,
	getPDF,
	onChange,
	getLevels,
	getDurations,
	getJobStandards,
	getMailingAddress,
	getFormData,
	checkError,
	getCategories,
	getMatching,
	onSubmit,
	onReset,
  	getAllSbpSkillsets,
	duplicateToR
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	countries: state.options.countries,
	immap_offices: state.options.immapOffices,
	torForm: state.torForm,
 	skillsets: state.rosterProcess.rosterProcess.skillsets
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ToRForm));
