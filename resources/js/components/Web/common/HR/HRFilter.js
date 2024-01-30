import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classname from 'classnames';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import { primaryColor } from '../../config/colors';
import FilterCheckbox from '../FilterCheckbox';
import SelectField from '../formFields/SelectField';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './job.css';
import {
	onChange,
	filterCheckbox,
	searchOnChange,
	getFilter,
	setParameters,
	closeDialog,
	immaperOnChange,
	genderOnChange,
	availableOnChange,
	selectOnChange,
	resetFilter,
	torMinimumOnChange
} from '../../redux/actions/hr/hrFilterActions';
import isEmpty from '../../validations/common/isEmpty';

import LanguageModal from './modal/LanguageModal';
import SectorModal from './modal/SectorModal';
import SkillModal from './modal/SkillModal';
import CountryModal from './modal/CountryModal';
import DegreeLevelModal from './modal/DegreeLevelModal';
import Typography from '@material-ui/core/Typography';

class HRFilter extends Component {
	constructor(props) {
		super(props);

    this.state = {
      keyword: ''
    }
    this.timer = null

    this.timerCheck = this.timerCheck.bind(this)
	}

	componentDidMount() {
		this.props.getFilter(this.props.filterFor);
    if (!isEmpty(this.props.filter.search)) {
      this.setState({ keyword: this.props.filter.search })
    }
	}

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword) {
      this.timerCheck();
    }
  }

  timerCheck() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.props.onChange('search', this.state.keyword);
    }, 500)
  }

	render() {
    const { keyword } = this.state;
		let {
			filter,
			filterCheckbox,
			onChange,
			searchOnChange,
			closeDialog,
			setParameters,
			classes,
			immaperOnChange,
			availableOnChange,
			genderOnChange,
			selectOnChange,
			torMinimumOnChange
		} = this.props;

		let {
			search_degree_level,
			search_language,
			search_sector,
			search_skill,
			search_field_of_work,
			search_country,
			search_nationality,
			language_lists,
			degree_level_lists,
			sector_lists,
			skill_lists,
			field_of_work_lists,
			country_lists,
			nationality_lists,
			country_of_residence_lists,
			experience,
			chosen_language,
			chosen_sector,
			chosen_skill,
			chosen_degree_level,
			chosen_field_of_work,
			chosen_country,
			chosen_nationality,
			chosen_country_of_residence,
			is_available,
			available_filter,
			languageDialog,
			languageParameters,
			sectorDialog,
			sectorParameters,
			skillDialog,
			skillParameters,
			countryDialog,
			countryParameters,
			degreeLevelDialog,
			degreeLevelParameters,
			immaper_filter,
			errors,
			immaper_status,
			gender_filter,
			select_gender,
		} = filter;

		return (
			<Card>
				<CardHeader
					title="Filter"
					className={classes.noPaddingBottom}
					action={
						<Typography
							variant="body1"
							color="primary"
							className={classes.resetBtn}
							onClick={() => {
                this.setState({ keyword: '' })
                this.props.resetFilter()
              }}
						>
							Reset
						</Typography>
					}
				/>
				<CardContent className={classes.noPaddingTop}>
					<form>
						<TextField
							id="search"
							name="search"
							label="Search Name"
							fullWidth
							autoComplete="search"
							value={keyword}
							onChange={(e) => this.setState({ keyword: e.target.value })}
							error={!isEmpty(errors.search)}
							helperText={errors.search}
							autoFocus
						/>
						<FormControl
							margin="normal"
							fullWidth
							error={!isEmpty(errors.experience) ? true : false}
							classes={{ root: classname(classes.addPaddingBottom, classes.addMarginBottom) }}
						>
							<FormLabel className={classes.sliderLabel}>Min. Work Experience (Year)</FormLabel>
							<div>
								<InputRange
									className={classname(classes.addPaddingBottom, classes.sliderColor)}
									maxValue={10}
									minValue={0}
									value={experience}
									onChange={(experience) => onChange('experience', experience)}
								/>
							</div>
							{!isEmpty(errors.experience) && (
								<FormHelperText className={classes.sliderFormHelperText}>
									{errors.experience}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="normal" fullWidth error={!isEmpty(errors.job_status) ? true : false}>
							<FormLabel>Consultant</FormLabel>
							<FormGroup row>
								{immaper_filter.map((immaperFilter) => (
									<FormControlLabel
										classes={{ label: classes.addMarginTop }}
										color="primary"
										key={'immaper_filter' + immaperFilter.value}
										control={
											<Checkbox
												checked={
													immaper_status.indexOf(immaperFilter.value) > -1 ? true : false
												}
												value={immaperFilter.value}
												color="primary"
												name="immaper_status"
												className={classes.noPaddingBottom}
												onChange={(e) => immaperOnChange(e.target.value, e.target.checked)}
											/>
										}
										label={immaperFilter.label}
									/>
								))}
							</FormGroup>
						</FormControl>
						{ this.props.filterFor === 'applicant' ?
						<FormControl margin="normal" fullWidth error={!isEmpty(errors.job_status) ? true : false}>
							<FormLabel>Gender</FormLabel>
							<FormGroup col="true">
								{gender_filter.map((genderFilter) => (
									<FormControlLabel
										classes={{ label: classes.addMarginTop }}
										color="primary"
										key={'gender_filter' + genderFilter.value}
										control={
											<Checkbox
												checked={
													select_gender.indexOf(genderFilter.value) > -1 ? true : false
												}
												value={genderFilter.value}
												color="primary"
												name="select_gender"
												className={classes.noPaddingBottom}
												onChange={(e) => genderOnChange(e.target.value, e.target.checked)}
											/>
										}
										label={genderFilter.label}
									/>
								))}
							</FormGroup>
						</FormControl>
						: null }
						<FormControl margin="normal" fullWidth error={!isEmpty(errors.is_available) ? true : false}>
							<FormLabel>Available or Not Available</FormLabel>
							<FormGroup row>
								{available_filter.map((availableFilter) => (
									<FormControlLabel
										classes={{ label: classes.addMarginTop }}
										color="primary"
										key={'available_filter' + availableFilter.value}
										control={
											<Checkbox
												checked={
													is_available.indexOf(availableFilter.value) > -1 ? true : false
												}
												value={availableFilter.value}
												color="primary"
												name="is_available"
												className={classes.noPaddingBottom}
												onChange={(e) => availableOnChange(e.target.value, e.target.checked)}
											/>
										}
										label={availableFilter.label}
									/>
								))}
							</FormGroup>
						</FormControl>
						{this.props.filterFor === 'applicant' ?
						<FormControl margin="normal" fullWidth >
							<FormLabel>TOR Minimum requirements</FormLabel>
							<FormGroup row>
									<FormControlLabel
										classes={{ label: classes.addMarginTop }}
										color="primary"
										key={'immaper_filter-minimum'}
										control={
											<Checkbox
												color="primary"
												name="minimum_requirement"
												className={classes.noPaddingBottom}
												onChange={(e) => torMinimumOnChange(e.target.checked)}
											/>
										}
										label={'Set minimum requirements'}
									/>
							</FormGroup>
						</FormControl>
						: null }
						<SelectField
							label="Country of Residence *"
							options={country_of_residence_lists}
							value={chosen_country_of_residence}
							onChange={selectOnChange}
							placeholder="Select Country of Residence"
							isMulti={false}
							name="chosen_country_of_residence"
							error={errors.chosen_country_of_residence}
							fullWidth={true}
							onClear={() => this.props.onChange('chosen_country_of_residence', '')}
							clearable={true}
						/>
						<FilterCheckbox
							name="chosen_nationality"
							label="Nationality"
							options={nationality_lists}
							optionVariable="nationality_lists"
							optionDefaultVariable="nationalities"
							value={chosen_nationality}
							error={errors.chosen_nationality}
							filterCheckbox={filterCheckbox}
							keyword={search_nationality}
							search="search_nationality"
							searchOnChange={searchOnChange}
							searchLabel="Search Nationality"
							variableIsOpen="nationalityDialog"
							parameterVariable="nationalityParameters"
							usingDialog={false}
						/>
						<FilterCheckbox
							name="chosen_language"
							label="Languages"
							options={language_lists}
							optionVariable="language_lists"
							optionDefaultVariable="languages"
							value={chosen_language}
							error={errors.chosen_language}
							filterCheckbox={filterCheckbox}
							keyword={search_language}
							search="search_language"
							searchOnChange={searchOnChange}
							searchLabel="Search Language"
							variableIsOpen="languageDialog"
							parameterVariable="languageParameters"
							usingDialog={true}
						/>
						<FilterCheckbox
							name="chosen_degree_level"
							label="Degree Level"
							options={degree_level_lists}
							optionVariable="degree_level_lists"
							optionDefaultVariable="degree_levels"
							value={chosen_degree_level}
							error={errors.chosen_degree_level}
							filterCheckbox={filterCheckbox}
							keyword={search_degree_level}
							search="search_degree_level"
							searchOnChange={searchOnChange}
							searchLabel="Search Degree Level"
							variableIsOpen="degreeLevelDialog"
							parameterVariable="degreeLevelParameters"
							autoHeight={true}
							usingDialog={true}
						/>
						<FilterCheckbox
							name="chosen_sector"
							label="Sectors"
							options={sector_lists}
							optionVariable="sector_lists"
							optionDefaultVariable="approvedSectors"
							value={chosen_sector}
							error={errors.chosen_sector}
							filterCheckbox={filterCheckbox}
							keyword={search_sector}
							search="search_sector"
							searchOnChange={searchOnChange}
							searchLabel="Search Sector"
							variableIsOpen="sectorDialog"
							parameterVariable="sectorParameters"
							usingDialog={true}
						/>
						<FilterCheckbox
							name="chosen_skill"
							label="Technical Skills"
							options={skill_lists.filter(c => c.category === 'technical')}
							optionVariable="skill_lists"
							optionDefaultVariable="skillsForMatching"
							value={chosen_skill}
							error={errors.chosen_skill}
							filterCheckbox={filterCheckbox}
							keyword={search_skill}
							search="search_skill"
							searchOnChange={searchOnChange}
							searchLabel="Search Technical Skill"
							variableIsOpen="skillDialog"
							parameterVariable="skillParameters"
							usingDialog={true}
						/>
						<FilterCheckbox
							name="chosen_skill"
							label="Soft Skills"
							options={skill_lists.filter(c => c.category === 'soft')}
							optionVariable="skill_lists"
							optionDefaultVariable="skillsForMatching"
							value={chosen_skill}
							error={errors.chosen_skill}
							filterCheckbox={filterCheckbox}
							keyword={search_skill}
							search="search_skill"
							searchOnChange={searchOnChange}
							searchLabel="Search Soft Skill"
							variableIsOpen="skillDialog"
							parameterVariable="skillParameters"
							usingDialog={true}
						/>
						<FilterCheckbox
							name="chosen_skill"
							label="Software Skills"
							options={skill_lists.filter(c => c.category === 'software')}
							optionVariable="skill_lists"
							optionDefaultVariable="skillsForMatching"
							value={chosen_skill}
							error={errors.chosen_skill}
							filterCheckbox={filterCheckbox}
							keyword={search_skill}
							search="search_skill"
							searchOnChange={searchOnChange}
							searchLabel="Search Software Skill"
							variableIsOpen="skillDialog"
							parameterVariable="skillParameters"
							usingDialog={true}
						/>
						<FilterCheckbox
							name="chosen_field_of_work"
							label="Areas of Expertise"
							options={field_of_work_lists}
							optionVariable="field_of_work_lists"
							optionDefaultVariable="approvedFieldOfWorks"
							value={chosen_field_of_work}
							error={errors.chosen_field_of_work}
							filterCheckbox={filterCheckbox}
							keyword={search_field_of_work}
							search="search_field_of_work"
							searchOnChange={searchOnChange}
							searchLabel="Search Area of expertise"
							variableIsOpen="fieldOfWorkDialog"
							parameterVariable="fieldOfWorkParameters"
							usingDialog={false}
						/>
						<FilterCheckbox
							name="chosen_country"
							label="Working Experience in specific country"
							options={country_lists}
							optionVariable="country_lists"
							optionDefaultVariable="p11Countries"
							value={chosen_country}
							error={errors.chosen_country}
							filterCheckbox={filterCheckbox}
							keyword={search_country}
							search="search_country"
							searchOnChange={searchOnChange}
							searchLabel="Search Country"
							variableIsOpen="countryDialog"
							parameterVariable="countryParameters"
							usingDialog={true}
						/>
						<LanguageModal
							isOpen={languageDialog}
							parameters={languageParameters}
							onClose={() => closeDialog('languageDialog')}
							setParameters={(parameters) =>
								setParameters('chosen_language', parameters, 'languageDialog')}
						/>
						<DegreeLevelModal
							isOpen={degreeLevelDialog}
							parameters={degreeLevelParameters}
							onClose={() => closeDialog('degreeLevelDialog')}
							setParameters={(parameters) =>
								setParameters('chosen_degree_level', parameters, 'degreeLevelDialog')}
						/>
						<SectorModal
							isOpen={sectorDialog}
							parameters={sectorParameters}
							onClose={() => closeDialog('sectorDialog')}
							setParameters={(parameters) => setParameters('chosen_sector', parameters, 'sectorDialog')}
						/>
						<SkillModal
							isOpen={skillDialog}
							parameters={skillParameters}
							onClose={() => closeDialog('skillDialog')}
							setParameters={(parameters) => setParameters('chosen_skill', parameters, 'skillDialog')}
						/>
						<CountryModal
							isOpen={countryDialog}
							parameters={countryParameters}
							onClose={() => closeDialog('countryDialog')}
							setParameters={(parameters) => setParameters('chosen_country', parameters, 'countryDialog')}
						/>
					</form>
				</CardContent>
			</Card>
		);
	}
}

HRFilter.propTypes = {
	classes: PropTypes.object.isRequired,

	getFilter: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	searchOnChange: PropTypes.func.isRequired,
	filterCheckbox: PropTypes.func.isRequired,
	setParameters: PropTypes.func.isRequired,
	closeDialog: PropTypes.func.isRequired,

	search_sector: PropTypes.string,
	search_language: PropTypes.string,
	search_degree_level: PropTypes.string,
	search_skill: PropTypes.string,
	minimumRequirements : PropTypes.array
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getFilter,
	onChange,
	searchOnChange,
	filterCheckbox,
	setParameters,
	closeDialog,
	immaperOnChange,
	availableOnChange,
	selectOnChange,
	resetFilter,
	genderOnChange,
	torMinimumOnChange
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	filter: state.filter
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	addMarginTop: {
		'margin-top': '1em'
	},
	addSmallMarginTop: {
		'margin-top': '.75em'
	},
	addMarginBottom: {
		'margin-bottom': '.75em'
	},
	addPaddingBottom: {
		'padding-bottom': '.75em'
	},
	sliderLabel: {
		'padding-bottom': '1.5em'
	},
	sliderFormControl: {
		'margin-bottom': '1.5em'
	},
	sliderFormHelperText: {
		'margin-top': '2.5em'
	},
	countryFormControl: {
		'margin-top': '2em'
	},
	noPaddingBottom: {
		'padding-bottom': '0'
	},
	noPaddingTop: {
		'padding-top': '0'
	},
	sliderColor: {
		background: primaryColor
	},
	checkbox: {
		'&:hover': {
			cursor: 'pointer'
		}
	},
	resetBtn: {
		marginTop: theme.spacing.unit * 2,
		marginRight: theme.spacing.unit,
		cursor: 'pointer',
		'&:hover': {
			textDecoration: 'underline'
		}
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(HRFilter));
