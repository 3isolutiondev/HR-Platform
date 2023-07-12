import React, { Component } from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import SelectField from '../../common/formFields/SelectField';
import FilterCheckbox from '../../common/FilterCheckbox';
import LanguageModal from '../../common/HR/modal/LanguageModal';
import DegreeLevelModal from '../../common/HR/modal/DegreeLevelModal';
import SectorModal from '../../common/HR/modal/SectorModal';
import SkillModal from '../../common/HR/modal/SkillModal';
import CountryModal from '../../common/HR/modal/CountryModal';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import { primaryColor } from '../../config/colors';
import {
  onChange,
  resetFilter,
  immaperOnChange,
  availableOnChange,
  selectOnChange,
  searchOnChange,
  filterCheckbox,
  setParameters,
  getFilter,
  genderOnChange
} from '../../redux/actions/allprofiles/AllProfilesFilterActions';

import '../../common/HR/job.css';
import isEmpty from '../../validations/common/isEmpty';
import { pluck } from '../../utils/helper';

class AllProfilesFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen_language: [],
      chosen_sector: [],
      chosen_skill: [],
      chosen_country: [],
      chosen_degree_level: [],
    }
    this.timeout = 0;
    this.handleSearch = this.handleSearch.bind(this);
    this.filterCheckbox = this.filterCheckbox.bind(this);
    this.setParameters = this.setParameters.bind(this);
  }

  componentDidMount() {
    this.props.getFilter();
    this.setState({
      chosen_language: this.props.chosen_language,
      chosen_sector: this.props.chosen_sector,
      chosen_skill: this.props.chosen_skill,
      chosen_country: this.props.chosen_country,
      chosen_degree_level: this.props.chosen_degree_level
    })
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.chosen_language) !== JSON.stringify(this.props.chosen_language)) {
      this.setState({ chosen_language: this.props.chosen_language })
    }
    if (JSON.stringify(prevProps.chosen_sector) !== JSON.stringify(this.props.chosen_sector)) {
      this.setState({ chosen_sector: this.props.chosen_sector })
    }
    if (JSON.stringify(prevProps.chosen_skill) !== JSON.stringify(this.props.chosen_skill)) {
      this.setState({ chosen_skill: this.props.chosen_skill })
    }
    if (JSON.stringify(prevProps.chosen_country) !== JSON.stringify(this.props.chosen_country)) {
      this.setState({ chosen_country: this.props.chosen_country })
    }
    if (JSON.stringify(prevProps.chosen_degree_level) !== JSON.stringify(this.props.chosen_degree_level)) {
      this.setState({ chosen_degree_level: this.props.chosen_degree_level })
    }
  }

  handleSearch(e) {
    this.props.onChange(e.target.name, e.target.value);
    let value = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.onChange('searchTemp', value);
    }, 500);
  }

  filterCheckbox(name, value, variableIsOpen, isChecked, parameterVariable, usingDialog) {
    if (!usingDialog) {
      this.props.filterCheckbox(name, value, variableIsOpen, isChecked, parameterVariable, usingDialog);
    } else {
      let filterData = [...this.props[name]];
      let filterDataId = pluck(filterData, 'id');
      let dataIndex = filterDataId.indexOf(value);

      if (dataIndex < 0 && isChecked && usingDialog) {
        let paramValue = {...this.props[parameterVariable]};
        paramValue.id = value;
        filterData.push(paramValue);
        this.props.onChange(variableIsOpen, this.props[variableIsOpen] ? false : true );
        this.props.onChange(parameterVariable, paramValue);
      } else {
        dataIndex > -1 && filterData.splice(dataIndex, 1);
        this.props.onChange(name, filterData)
      }
      return this.setState({ [name]: filterData });
    }
  }

  setParameters(variable_name, parameters, variableIsOpen) {
    let chosen_data = [...this.state[variable_name]];
    let arrIds = pluck(chosen_data, 'id');

    if (arrIds.length > 0) {
      let arrIndex = arrIds.indexOf(parameters.id);
      if (arrIndex > -1) {
        chosen_data[arrIndex] = parameters;

        this.props.onChange(variable_name, chosen_data);
        this.setState({ [variable_name]: [] });
        return this.props.onChange(variableIsOpen, false);
      }
    }
  }


  render() {
    let {
      search,
      experience,
      immaper_filter,
      immaper_status,
      gender_filter,
      select_gender,
      available_filter,
      is_available,
      show_starred_only,

      country_of_residence_lists,
      chosen_country_of_residence,

      nationality_lists,
      chosen_nationality,
      search_nationality,

      language_lists,
      search_language,
      languageDialog,
      languageParameters,

      degree_level_lists,
      search_degree_level,
      degreeLevelDialog,
      degreeLevelParameters,

      sector_lists,
      search_sector,
      sectorDialog,
      sectorParameters,

      skill_lists,
      search_skill,
      skillDialog,
      skillParameters,

      field_of_work_lists,
      chosen_field_of_work,
      search_field_of_work,

      country_lists,
      search_country,
      countryDialog,
      countryParameters,

      errors,
      classes,

      onChange,
      immaperOnChange,
      genderOnChange,
      availableOnChange,
      selectOnChange,
      searchOnChange
    } = this.props;


    const { chosen_language, chosen_sector, chosen_skill, chosen_country, chosen_degree_level } = this.state;

    const { filterCheckbox, setParameters } = this;

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
              onClick={this.props.resetFilter}
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
              value={search}
              onChange={(e) => this.handleSearch(e)}
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
            <FormControl margin="normal" fullWidth error={!isEmpty(errors.show_starred_only) ? true : false}>
              <FormGroup>
                <FormControlLabel
                  classes={{ label: classes.addMarginTop }}
                  color="primary"
                  control={
                    <Checkbox
                      checked={ show_starred_only === 'yes' ? true : false }
                      color="primary"
                      name="show_starred_only"
                      className={classes.noPaddingBottom}
                      onChange={(e) => onChange('show_starred_only', e.target.checked ? "yes" : "no")}
                    />
                  }
                  label="Show Starred Only"
                />
              </FormGroup>
            </FormControl>
            <FormControl margin="normal" fullWidth error={!isEmpty(errors.job_status) ? true : false}>
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
              onClose={() => {
                setParameters('chosen_language', languageParameters, 'languageDialog')
              }}
              setParameters={(parameters) =>
                setParameters('chosen_language', parameters, 'languageDialog')}
                />
            <DegreeLevelModal
              isOpen={degreeLevelDialog}
              parameters={degreeLevelParameters}
              onClose={() => {
                setParameters('chosen_degree_level', degreeLevelParameters, 'degreeLevelDialog')
              }}
              setParameters={(parameters) =>
                setParameters('chosen_degree_level', parameters, 'degreeLevelDialog')}
            />
            <SectorModal
              isOpen={sectorDialog}
              parameters={sectorParameters}
              onClose={() => {
                setParameters('chosen_sector', sectorParameters, 'sectorDialog')
              }}
              setParameters={(parameters) => setParameters('chosen_sector', parameters, 'sectorDialog')}
            />
            <SkillModal
              isOpen={skillDialog}
              parameters={skillParameters}
              onClose={() => {
                setParameters('chosen_skill', skillParameters, 'skillDialog')
              }}
              setParameters={(parameters) => setParameters('chosen_skill', parameters, 'skillDialog')}
            />
            <CountryModal
              isOpen={countryDialog}
              parameters={countryParameters}
              onClose={() => {
                setParameters('chosen_country', countryParameters, 'countryDialog')
              }}
              setParameters={(parameters) => setParameters('chosen_country', parameters, 'countryDialog')}
            />{' '}
          </form>
        </CardContent>
      </Card>
    );
  }
}

AllProfilesFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  immaperOnChange: PropTypes.func.isRequired,
  availableOnChange: PropTypes.func.isRequired,
  selectOnChange: PropTypes.func.isRequired,
  searchOnChange: PropTypes.func.isRequired,
  filterCheckbox: PropTypes.func.isRequired,
  setParameters: PropTypes.func.isRequired,
  getFilter: PropTypes.func.isRequired,
  genderOnChange: PropTypes.func.isRequired,


  search: PropTypes.string.isRequired,
  experience: PropTypes.number.isRequired,
  immaper_filter: PropTypes.array.isRequired,
  gender_filter: PropTypes.array.isRequired,
  select_gender: PropTypes.array.isRequired,
  immaper_status: PropTypes.array.isRequired,
  available_filter: PropTypes.array.isRequired,
  is_available: PropTypes.array.isRequired,
  show_starred_only: PropTypes.oneOf(['yes', 'no']).isRequired,

  country_of_residence_lists: PropTypes.array.isRequired,
  chosen_country_of_residence: PropTypes.oneOfType([PropTypes.oneOf(['']), PropTypes.object]).isRequired,

  nationality_lists: PropTypes.array.isRequired,
  chosen_nationality: PropTypes.array.isRequired,
  search_nationality: PropTypes.string.isRequired,

  language_lists: PropTypes.array.isRequired,
  chosen_language: PropTypes.array.isRequired,
  search_language: PropTypes.string.isRequired,
  languageDialog: PropTypes.bool.isRequired,
  languageParameters: PropTypes.object.isRequired,

  degree_level_lists: PropTypes.array.isRequired,
  chosen_degree_level: PropTypes.array.isRequired,
  search_degree_level: PropTypes.string.isRequired,
  degreeLevelDialog: PropTypes.bool.isRequired,
  degreeLevelParameters: PropTypes.object.isRequired,

  sector_lists: PropTypes.array.isRequired,
  chosen_sector: PropTypes.array.isRequired,
  search_sector: PropTypes.string.isRequired,
  sectorDialog: PropTypes.bool.isRequired,
  sectorParameters: PropTypes.object.isRequired,

  skill_lists: PropTypes.array.isRequired,
  chosen_skill: PropTypes.array.isRequired,
  search_skill: PropTypes.string.isRequired,
  skillDialog: PropTypes.bool.isRequired,
  skillParameters: PropTypes.object.isRequired,

  field_of_work_lists: PropTypes.array.isRequired,
  chosen_field_of_work: PropTypes.array.isRequired,
  search_field_of_work: PropTypes.string.isRequired,

  country_lists: PropTypes.array.isRequired,
  chosen_country: PropTypes.array.isRequired,
  search_country: PropTypes.string.isRequired,
  countryDialog: PropTypes.bool.isRequired,
  countryParameters: PropTypes.object.isRequired,

  errors: PropTypes.object.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  onChange,
  resetFilter,
  immaperOnChange,
  availableOnChange,
  selectOnChange,
  searchOnChange,
  filterCheckbox,
  setParameters,
  getFilter,
  genderOnChange
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  search: state.allProfilesFilter.search,
  experience: state.allProfilesFilter.experience,
  immaper_filter: state.allProfilesFilter.immaper_filter,
  immaper_status: state.allProfilesFilter.immaper_status,
  gender_filter: state.allProfilesFilter.gender_filter,
  select_gender: state.allProfilesFilter.select_gender,
  available_filter: state.allProfilesFilter.available_filter,
  is_available: state.allProfilesFilter.is_available,
  show_starred_only: state.allProfilesFilter.show_starred_only,

  country_of_residence_lists: state.options.p11Countries,
  chosen_country_of_residence: state.allProfilesFilter.chosen_country_of_residence,

  nationality_lists: state.allProfilesFilter.nationality_lists,
  chosen_nationality: state.allProfilesFilter.chosen_nationality,
  search_nationality: state.allProfilesFilter.search_nationality,

  language_lists: state.allProfilesFilter.language_lists,
  chosen_language: state.allProfilesFilter.chosen_language,
  search_language: state.allProfilesFilter.search_language,
  languageDialog: state.allProfilesFilter.languageDialog,
  languageParameters: state.allProfilesFilter.languageParameters,

  degree_level_lists: state.allProfilesFilter.degree_level_lists,
  chosen_degree_level: state.allProfilesFilter.chosen_degree_level,
  search_degree_level: state.allProfilesFilter.search_degree_level,
  degreeLevelDialog: state.allProfilesFilter.degreeLevelDialog,
  degreeLevelParameters: state.allProfilesFilter.degreeLevelParameters,

  sector_lists: state.allProfilesFilter.sector_lists,
  chosen_sector: state.allProfilesFilter.chosen_sector,
  search_sector: state.allProfilesFilter.search_sector,
  sectorDialog: state.allProfilesFilter.sectorDialog,
  sectorParameters: state.allProfilesFilter.sectorParameters,

  skill_lists: state.allProfilesFilter.skill_lists,
  chosen_skill: state.allProfilesFilter.chosen_skill,
  search_skill: state.allProfilesFilter.search_skill,
  skillDialog: state.allProfilesFilter.skillDialog,
  skillParameters: state.allProfilesFilter.skillParameters,

  field_of_work_lists: state.allProfilesFilter.field_of_work_lists,
  chosen_field_of_work: state.allProfilesFilter.chosen_field_of_work,
  search_field_of_work: state.allProfilesFilter.search_field_of_work,

  country_lists: state.allProfilesFilter.country_lists,
  chosen_country: state.allProfilesFilter.chosen_country,
  search_country: state.allProfilesFilter.search_country,
  countryDialog: state.allProfilesFilter.countryDialog,
  countryParameters: state.allProfilesFilter.countryParameters,

  errors: state.allProfilesFilter.errors
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AllProfilesFilter));
