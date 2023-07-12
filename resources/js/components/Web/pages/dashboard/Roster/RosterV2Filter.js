import React, { Component } from 'react';
import classname from 'classnames';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Close from '@material-ui/icons/Close';
import InputRange from 'react-input-range';
import SelectField from '../../../common/formFields/SelectField';
import FilterCheckbox from '../../../common/FilterCheckbox';
import isEmpty from '../../../validations/common/isEmpty';

import {
	onChange,
	filterCheckbox,
	searchOnChange,
	selectOnChange,
	getFilter,
	setParameters,
	closeDialog,
	immaperOnChange,
	availableOnChange,
	resetFilter
} from '../../../redux/actions/dashboard/roster/rosterDashboardFilterActions';
import { setUserFormData as onChangeList } from '../../../redux/actions/dashboard/roster/rosterDashboardActions';
import LanguageModal from '../../../common/HR/modal/LanguageModal';
import SectorModal from '../../../common/HR/modal/SectorModal';
import SkillModal from '../../../common/HR/modal/SkillModal';
import CountryModal from '../../../common/HR/modal/CountryModal';
import DegreeLevelModal from '../../../common/HR/modal/DegreeLevelModal';
// import FilterCheckbox from '../../../common/FilterCheckbox';

class RosterV2Filter extends Component {
	constructor(props) {
		super(props);

		// this.checkboxOnChange = this.checkboxOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getFilter();
	}

	// async checkboxOnChange(e) {
	//   await this.props.filterCheckbox
	// }

	render() {
		const {
			openDrawer,
			classes,
			experience,
			chosen_language,
			chosen_degree_level,
			chosen_sector,
			chosen_skill,
			chosen_field_of_work,
			chosen_country,
			chosen_nationality,
			chosen_country_of_residence,

			is_available,
			immaper_filter,
			immaper_status,
			available_filter,

			language_lists,
			degree_level_lists,
			sector_lists,
			skill_lists,
			field_of_work_lists,
			country_lists,
			nationality_lists,
			country_of_residence_lists,

			search_language,
			search_sector,
			search_skill,
			search_degree_level,
			search_field_of_work,
			search_country,
			search_nationality,

			languageDialog,
			degreeLevelDialog,
			sectorDialog,
			skillDialog,
			countryDialog,

			languageParameters,
			degreeLevelParameters,
			sectorParameters,
			skillParameters,
			countryParameters,

			errors,

			searchOnChange,
			filterCheckbox,
			closeDialog,
			setParameters,

			immaperOnChange,
			availableOnChange
		} = this.props;

		return (
			<Drawer anchor="top" open={openDrawer} onClose={() => this.props.onChangeList('openDrawer', false)}>
				<Card className={classes.card}>
					<CardContent>
						<Typography variant="h4" className={classes.title}>
							Filter
							<Button
								className={classname(classes.capitalize, classes.reset)}
								variant="text"
								color="primary"
								aria-owns={open ? 'fade-menu' : undefined}
								aria-haspopup="true"
								onClick={this.props.resetFilter}
							>
								Reset
							</Button>
							<Close
								size={12}
								className={classes.close}
								onClick={() => this.props.onChangeList('openDrawer', false)}
							/>
						</Typography>
						<Grid container spacing={16}>
							<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
								<FormControl
									margin="normal"
									fullWidth
									// error={!isEmpty(errors.experience) ? true : false}
									classes={{ root: classname(classes.addPaddingBottom, classes.addMarginBottom) }}
								>
									<FormLabel className={classes.sliderLabel}>Min. Work Experience (Year)</FormLabel>
									<div>
										<InputRange
											className={classname(classes.addPaddingBottom, classes.sliderColor)}
											maxValue={10}
											minValue={0}
											value={experience}
											onChange={(experience) => this.props.onChange('experience', experience)}
										/>
									</div>
									{/* {!isEmpty(errors.experience) && (
											<FormHelperText className={classes.sliderFormHelperText}>
												{errors.experience}
											</FormHelperText>
										)} */}
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
								<FormControl
									margin="dense"
									fullWidth
									error={!isEmpty(errors.job_status) ? true : false}
								>
									<FormLabel>iMMAPer</FormLabel>
									<FormGroup row>
										{immaper_filter.map((immaperFilter) => (
											<FormControlLabel
												classes={{ label: classes.addMarginTop }}
												color="primary"
												key={'immaper_filter' + immaperFilter.value}
												control={
													<Checkbox
														checked={
															immaper_status.indexOf(immaperFilter.value) > -1 ? (
																true
															) : (
																false
															)
														}
														value={immaperFilter.value}
														color="primary"
														name="immaper_status"
														className={classes.noPaddingBottom}
														onChange={(e) => {
															this.props.immaperOnChange(
																e.target.value,
																e.target.checked
															);
														}}
													/>
												}
												label={immaperFilter.label}
											/>
										))}
									</FormGroup>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
								<FormControl
									margin="dense"
									fullWidth
									error={!isEmpty(errors.is_available) ? true : false}
								>
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
															is_available.indexOf(availableFilter.value) > -1 ? (
																true
															) : (
																false
															)
														}
														value={availableFilter.value}
														color="primary"
														name="is_available"
														className={classes.noPaddingBottom}
														onChange={(e) =>
															availableOnChange(e.target.value, e.target.checked)}
													/>
												}
												label={availableFilter.label}
											/>
										))}
									</FormGroup>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
								<SelectField
									label="Country of Residence *"
									options={country_of_residence_lists}
									value={chosen_country_of_residence}
									onChange={(value, e) => this.props.onChange('chosen_country_of_residence', value)}
									placeholder="Select Country of Residence"
									isMulti={false}
									name="chosen_country_of_residence"
									error={errors.chosen_country_of_residence}
									fullWidth={true}
									onClear={() => this.props.onChange('chosen_country_of_residence', '')}
									clearable={true}
									margin="dense"
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
								/>
								</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
									
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
									smallBox={true}
								/>
							</Grid>
						</Grid>
					</CardContent>
					<CardActions>
						<Button
							className={classes.capitalize}
							variant="text"
							color="primary"
							aria-owns={open ? 'fade-menu' : undefined}
							aria-haspopup="true"
							onClick={this.props.resetFilter}
						>
							Reset
						</Button>
						<Button
							className={classes.capitalize}
							variant="contained"
							color="secondary"
							aria-owns={open ? 'fade-menu' : undefined}
							aria-haspopup="true"
							onClick={() => this.props.onChangeList('openDrawer', false)}
						>
							Close
						</Button>
					</CardActions>
				</Card>
				<LanguageModal
					isOpen={languageDialog}
					parameters={languageParameters}
					onClose={() => closeDialog('languageDialog')}
					setParameters={(parameters) => setParameters('chosen_language', parameters, 'languageDialog')}
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
			</Drawer>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChange,
	filterCheckbox,
	searchOnChange,
	selectOnChange,
	immaperOnChange,
	availableOnChange,
	onChangeList,
	setParameters,
	closeDialog,
	getFilter,
	resetFilter
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	openDrawer: state.rosterDashboard.openDrawer,
	experience: state.filter.experience,
	chosen_language: state.filter.chosen_language,
	chosen_degree_level: state.filter.chosen_degree_level,
	chosen_sector: state.filter.chosen_sector,
	chosen_skill: state.filter.chosen_skill,
	chosen_field_of_work: state.filter.chosen_field_of_work,
	chosen_country: state.filter.chosen_country,
	chosen_nationality: state.filter.chosen_nationality,
	chosen_country_of_residence: state.filter.chosen_country_of_residence,
	is_available: state.filter.is_available,
	available_filter: state.filter.available_filter,
	immaper_status: state.filter.immaper_status,
	immaper_filter: state.filter.immaper_filter,

	language_lists: state.filter.language_lists,
	degree_level_lists: state.filter.degree_level_lists,
	sector_lists: state.filter.sector_lists,
	skill_lists: state.filter.skill_lists,
	field_of_work_lists: state.filter.field_of_work_lists,
	country_lists: state.filter.country_lists,
	nationality_lists: state.filter.nationality_lists,
	country_of_residence_lists: state.filter.country_of_residence_lists,

	search_language: state.filter.search_language,
	search_sector: state.filter.search_sector,
	search_skill: state.filter.search_skill,
	search_degree_level: state.filter.search_degree_level,
	search_field_of_work: state.filter.search_field_of_work,
	search_country: state.filter.search_country,
	search_nationality: state.filter.search_nationality,

	languageDialog: state.filter.languageDialog,
	degreeLevelDialog: state.filter.degreeLevelDialog,
	sectorDialog: state.filter.sectorDialog,
	skillDialog: state.filter.skillDialog,
	countryDialog: state.filter.countryDialog,

	languageParameters: state.filter.languageParameters,
	degreeLevelParameters: state.filter.degreeLevelParameters,
	sectorParameters: state.filter.sectorParameters,
	skillParameters: state.filter.skillParameters,
	countryParameters: state.filter.countryParameters,

	errors: state.filter.errors
});

export default connect(mapStateToProps, mapDispatchToProps)(RosterV2Filter);
