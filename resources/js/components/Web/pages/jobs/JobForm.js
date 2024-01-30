/** import React, React Helmet and momentjs */
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import moment from 'moment';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';

/** import configuration value, validation helper, permission checker and text selector */
import isEmpty from '../../validations/common/isEmpty';
import validateJob from '../../validations/job';
import { pluck } from '../../utils/helper';
import { statusData } from '../../config/options';
import { statusDataForm, statusDataFormCloseJob, closeSurgeAlertOptions, testStepOptions } from '../../config/options';
import { white } from '../../config/colors';
import { APP_NAME } from '../../config/general';
import { can } from '../../permissions/can';
import textSelector from '../../utils/textSelector';

/** import custom components */
import Btn from '../../common/Btn';
import DatePickerField from '../../common/formFields/DatePickerField';
import JobCategorySubSection from '../dashboard/HR/jobCategorySubSection/JobCategorySubSection';
import SelectField from '../../common/formFields/SelectField';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import {
  getLanguages,
  getCountries,
  getImmapOffices,
  getImmapEmailAddress,
  getImmapers
} from '../../redux/actions/optionActions';

/**
 * JobForm is a component to show Add and Edit Job page
 *
 * @name JobForm
 * @component
 * @category Page
 * @subcategory Jobs
 *
 */
class JobForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      sub_sections: [],
      status: { value: 0, label: 'Draft' },
      opening_date: moment(new Date()),
      closing_date: moment(new Date()).add(1, 'M'),
      contract_start: moment(new Date()),
      contract_end: moment(new Date()).add(6, 'M'),
      country: '',
      immap_office: '',
      countriesURL: '/api/countries/all',
      tor: '',
      manager: '',
      tors: [],
      managers: [],
      exclude_immaper: [],
      include_cover_letter: 0,
      show_contract: 0,
      show_salary: 0,
      use_test_step: 0,
      test_step_position: { value: 'before', label: 'Before Interview Step' },
      default_section: {
        sub_section: '',
        sub_section_content: '',
        level: 0
      },
      torURL: '/api/tor',
      languages: [],
      languagesURL: '/api/languages/all',
      jobURL: '/api/jobs',
      redirectURL: '/jobs',
      formTitle: 'Add Job',
      isEdit: false,
      errors: {},
      isLoading: false,
      jobStatusClose: false,
      popUpStatus: false,
      changeStatusLoading: false,
      tempJobStatus: false, manager_id:[],
      closeSurgeAlert:  { value: 'filled-by-iMMAP', label: 'Close the Alert (Position filled by 3iSolution)' },
      savedStatus: 0
    };

    this.getLanguages = this.getLanguages.bind(this);
    this.getToRs = this.getToRs.bind(this);
    this.onChange = this.onChange.bind(this);
    this.dateOnChange = this.dateOnChange.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
    this.torOnChange = this.torOnChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateSection = this.updateSection.bind(this);
    this.addSection = this.addSection.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
    this.closeJobConfirmation = this.closeJobConfirmation.bind(this);
    this.getData = this.getData.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    this.props.getCountries();
    this.props.getImmapOffices();
    this.props.getLanguages();
    this.props.getImmapers();

    this.props.getImmapEmailAddress();

    if (typeof this.props.location.tor != 'undefined') {
      this.torOnChange(this.props.location.tor)
    }

    this.getToRs();
    if (typeof this.props.match.params.id !== 'undefined') {
      this.getData();
    }
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   */
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.getData()
    }
  }

  /** getData is a function to set form data */
  getData() {
    if (typeof this.props.match.params.id !== 'undefined') {
      this.setState({
        isEdit: true,
        formTitle: 'Edit Job',
        jobURL: '/api/jobs/' + this.props.match.params.id,
        redirectURL: '/jobs/' + this.props.match.params.id + '/edit'
      }, () => {
        // retrieve the job data
        this.props
          .getAPI(this.state.jobURL)
          .then((res) => {

            let {
              title,
              tor,
              languages,
              status,
              opening_date,
              closing_date,
              country,
              immap_office,
              contract_start,
              contract_end,
              sub_sections,
              exclude_immaper,
              include_cover_letter,
              show_contract,
              show_salary,
              use_test_step,
              test_step_position
            } = res.data.data;

            if (tor.job_standard.under_sbp_program === "yes" && !(can('Set as Admin') || ((can('Add Job') || can('Edit Job')) && can('View SBP Job')))) {
              this.props.history.push('/jobs');
            }

            const exclude_immaper_check = isEmpty(exclude_immaper)
              ? false
              : pluck(JSON.parse(exclude_immaper), 'value').includes(this.props.immap_email);
            if (exclude_immaper_check) {
              this.props.history.push('/jobs');
            } else {
              languages = languages.map((language) => {
                return { value: language.id, label: language.name };
              });

              let emailmanagers = res.data.data.job_manager.map((dd) => {
                this.setState({
                  manager_id : [...this.state.manager_id, dd.id]
                })

                return {
                  value: dd.user_id, label: dd.label, email: dd.email,
                  managers_id: dd.id, name : dd.name, notified:dd.has_been_notified
                };
              });

              this.setState({
                title,
                tor: { value: tor.id,
                      label: tor.title,
                      under_sbp_program: tor.job_standard.under_sbp_program,
                      sbp_recruitment_campaign: tor.job_standard.sbp_recruitment_campaign
                    },
                languages,
                status: statusData[status],
                country: !isEmpty(country) ? { value: country.id, label: country.name } : '',
                immap_office: !isEmpty(immap_office)
                  ? {
                    value: immap_office.id,
                    label: immap_office.country.name + ' - (' + immap_office.city + ')'
                  }
                  : '',
                opening_date: moment(opening_date),
                closing_date: moment(closing_date),
                contract_start: moment(contract_start),
                contract_end: moment(contract_end),
                sub_sections,
                exclude_immaper: JSON.parse(exclude_immaper),
                managers: emailmanagers,
                include_cover_letter,
                show_contract,
                show_salary,
                jobStatusClose: status == 3 ? true : false,
                savedStatus: status,
                use_test_step,
                test_step_position: test_step_position == 'after' ? { value: 'after', label: 'After Interview Step'} : { value: 'before', label: 'Before Interview Step'}
              });

            }
          })
          .catch((err) => {
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while requesting job data'
            });
          });
      })
		} else {
      // reset the form
      this.setState({
        isEdit: false,
        title: '',
        tor: '',
        languages: [],
        status: { value: 0, label: 'Draft' },
        country: '',
        immap_office: '',
        opening_date: moment(new Date()),
        closing_date: moment(new Date()).add(1, 'M'),
        contract_start: moment(new Date()),
        contract_end: moment(new Date()).add(6, 'M'),
        sub_sections: [],
        exclude_immaper: [],
        managers: [],
        include_cover_letter: 0,
        show_contract: 0,
        show_salary: 0,
        jobStatusClose: false,
        jobURL: '/api/jobs',
        redirectURL: '/jobs',
        formTitle: 'Add Job',
        closeSurgeAlert:  { value: 'filled-by-iMMAP', label: 'Close the Alert (Position filled by 3iSolution)' },
        use_test_step: 0,
        test_step_position: { value: 'before', label: 'Before Interview Step' }
      })
    }
  }

  /**
   * getLanguages is a function to list of languages
   */
  getLanguages() {
    this.props
      .getAPI(this.state.languagesURL)
      .then((res) => {
        this.setState({ language_list: res.data.data });
      })
      .catch((err) => { });
  }

  /**
   * getToRs is a function to get list of ToR
   */
  getToRs() {
    this.props
      .getAPI(this.state.torURL + '/all-options')
      .then((res) => {
        this.setState({ tors: res.data.data });
      })
      .catch((err) => { });
  }

  /**
   * onChange is a function to handle change of data in the form
   * @param {Event} e
   */
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
  }

  /**
   * dateOnChange is a function to handle change of date in the form
   * @param {Event} e
   */
  dateOnChange(e) {
    this.setState({ [e.target.name]: moment(e.target.value) }, () => this.isValid());
  }

  /**
   * selectOnChange is a function to handle select field data changes
   * @param {Object} value - {value: test, label: test}
   * @param {Event} e
   */
  selectOnChange(value, e) {
    this.setState({
		[e.name]: value,
		manager_id : []
	}, () => this.isValid());

	if (e.name==='managers') {

		let manager_id_array = [];
		value.map((dd) => {

			if (typeof dd.managers_id !== 'undefined' &&  dd.managers_id !=='') {
				manager_id_array.push(dd.managers_id)
			}

		});
		this.setState({
			manager_id : manager_id_array
		})

	}

  }

  /**
   * updateSection is a function to update sub sections
   * @param {number} level
   * @param {*} sectionData
   * @param {*} section_errors
   */
  updateSection(level, sectionData, section_errors) {
    let { sub_sections, errors } = this.state;
    sub_sections[level] = sectionData;
    if (!isEmpty(section_errors)) {
      errors.sub_sections = 'There is an error from one of the section';
    } else if (!isEmpty(errors.sub_sections) && isEmpty(section_errors)) {
      delete errors.sub_sections;
    }

    this.setState({ sub_sections, errors }, () => this.isValid());
  }

  /**
   * deleteSection is a function to delete sub section
   * @param {number} level
   */
  deleteSection(level) {
    let { sub_sections } = this.state;
    sub_sections.splice(level, 1);
    this.setState({ sub_sections }, () => this.isValid());
  }

  /**
   * torOnChange is a function to handle tor data changes in the form
   * @param {Object} value
   */
  torOnChange(value) {
    this.setState({ tor: value }, () => {
      this.props
        .getAPI(this.state.torURL + '/with-requirements/' + this.state.tor.value)
        .then((res) => {
          const {
            country,
            immap_office,
            contract_start,
            contract_end,
            languages,
            title,
            id,
            sub_sections,
            matching_requirements
          } = res.data.data;
          this.setState({
            country,
            immap_office: !isEmpty(immap_office)
              ? {
                value: immap_office.id,
                label: immap_office.country.name + ' - (' + immap_office.city + ')'
              }
              : '',
            contract_start: moment(contract_start),
            contract_end: moment(contract_end),
            title,
            languages,
            sub_sections,
            matching_requirements
          });
        })
        .catch((err) => { });
    });
  }

  /**
   * onSubmit is a function to submit the form
   * @param {Event} e
   */
  onSubmit(e) {
    e.preventDefault();

    if (this.isValid()) {
      let jobData = {
        tor_id: this.state.tor.value,
        title: this.state.title,
        status: this.state.status.value,
        opening_date: this.state.opening_date.format('YYYY-MM-DD'),
        closing_date: this.state.closing_date.format('YYYY-MM-DD'),
        contract_start: this.state.contract_start.format('YYYY-MM-DD'),
        contract_end: this.state.contract_end.format('YYYY-MM-DD'),
        country_id: !isEmpty(this.state.country) ?  this.state.country.value : '',
        immap_office_id: this.state.immap_office.value,
        languages: pluck(this.state.languages, 'value'),
        sub_sections: this.state.sub_sections,
        contract_length: Math.ceil(this.state.contract_end.diff(this.state.contract_start, 'months', true)),
        manager: this.state.managers,
        exclude_immaper: this.state.exclude_immaper,
        include_cover_letter: this.state.include_cover_letter,
        show_contract: this.state.show_contract,
        show_salary: this.state.show_salary,
        use_test_step: this.state.use_test_step,
        test_step_position: this.state.test_step_position.value
      };

      if (this.state.isEdit) {
        let manager_id_array = [];
        this.state.managers.map((dd) => {

			if (typeof dd.managers_id !== 'undefined' &&  dd.managers_id !=='') {
				manager_id_array.push(dd.managers_id)
			}

		});
		jobData._method = 'PUT';
		jobData.exists_manager_id = manager_id_array;
      }

      this.setState({ isLoading: true }, () => {
        this.props
          .postAPI(this.state.jobURL, jobData)
          .then((res) => {
            let msg = 'Your job has been updated';
            if (!this.state.isEdit) {
              this.props.history.push('/jobs');
              msg = 'Your job has been saved';
            }
            this.props.addFlashMessage({
              type: 'success',
              text: msg
            });
            this.setState({ isLoading: false, savedStatus: jobData.status });
          })
          .catch((err) => {
            this.setState({ isLoading: false }, () => {
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

  /**
   * isValid is a function to check validation of the form
   * @returns {Boolean}
   */
  isValid() {
    const { errors, isValid } = validateJob(this.state);

    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }

    return isValid;
  }

  /**
   * addSection is a function to add sub section in the form
   */
  addSection() {
    let { sub_sections, default_section } = this.state;

    sub_sections.push(default_section);
    this.setState({ sub_sections }, () => this.isValid());
  }

  /**
   * closeJobConfirmation is a function to hide closing job confirmation modal
   * @param {number} jobstatus
   */
  closeJobConfirmation(jobstatus) {
    this.setState({
      tempJobStatus: jobstatus,
      popUpStatus: true
    });
  }

  /**
   * processJobStatusChange is a function to open / close the job
   */
  processJobStatusChange() {
    this.setState({
      changeStatusLoading: true
    })

    let jobData = {
      jobid: this.props.match.params.id,
      jobstatus: this.state.tempJobStatus,
      closeSurgeAlert: this.state.tor.under_sbp_program === "yes" &&  this.state.jobStatusClose == false ? this.state.closeSurgeAlert.value : null
    };

    this.props
      .postAPI('/api/jobs/update-status-job', jobData)
      .then((res) => {
        this.props.addFlashMessage({
          type: 'success',
          text: 'Success'
        });

        this.setState({
          changeStatusLoading: false,
          popUpStatus: false,
          jobStatusClose: this.state.tempJobStatus
        })

      })
      .catch((err) => {
        this.setState({ changeStatusLoading: false }, () => {
          let errMsg = textSelector('error', 'default');
          if (err.response.status === 422) {
            if (err.response.data.errors.noAcceptedApplicant) {
              errMsg = err.response.data.message;
            }
          }
          if (err.response.status === 500) {
            if (err.response.data.errors.mailError) {
              errMsg = err.response.data.message;
            }
          }

          this.props.addFlashMessage({
            type: 'error',
            text: errMsg
          });
        })
      });
  }

  render() {
    const {
      title,
      languages,
      status,
      opening_date,
      closing_date,
      country,
      immap_office,
      contract_start,
      contract_end,
      formTitle,
      errors,
      tors,
      tor,
      managers,
      sub_sections,
      isEdit,
      isLoading,
      exclude_immaper,
      include_cover_letter,
      show_contract,
      show_salary,
      closeSurgeAlert,
      savedStatus,
      use_test_step,
      test_step_position
    } = this.state;
    const { language_list, countries, immap_offices, immap_emails, immapers, classes } = this.props;
	let labelswitch = this.state.jobStatusClose == true ? 'Reopen the Job ?':'Close the Job ?';
	let statusJobOption = this.state.jobStatusClose == true ? statusDataFormCloseJob : statusDataForm;
  let closeSurgeAlertCheck = tor.under_sbp_program === "yes" &&  this.state.jobStatusClose == false;

    const countryLabel = (isEmpty(country)) ? '' : ` - ${country.label}`;

    return (
      <form onSubmit={this.onSubmit}>
        <Helmet>
          <title>
            {isEdit ? APP_NAME + ' - Edit Job > ' + title + countryLabel : APP_NAME + ' - Add Job'}
          </title>
          <meta
            name="description"
            content={isEdit ? APP_NAME + ' Job > ' + title + countryLabel : APP_NAME + ' Add Job'}
          />
        </Helmet>
        <Card>
          <CardContent>
            <Grid container spacing={16} alignItems="flex-end">
              <Grid item xs={12} sm={9}>
                <Typography variant="h4">{formTitle}</Typography>
              </Grid>
			  {
				  isEdit && (
					<Grid item xs={12} sm={3}>
            {savedStatus !== 0 && (
              <FormControl margin="none">
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={this.state.jobStatusClose}
                      onChange={(e) => this.closeJobConfirmation(e.target.checked)}
                      value={this.state.jobStatusClose}
                      color="primary"
                      name="closejob"
                    />
                  }
                  label={labelswitch}
                />
              </FormControl>
            )}

						<Btn
							link="/jobs/create"
							btnText="Add Job"
							btnStyle="contained"
							color="primary"
							size="small"
							icon={<Add />}
							align="right"
						/>

				  </Grid>

				  )
			  }

              <Grid item xs={12}>
                <SelectField
                  label="ToR *"
                  options={tors}
                  value={tor}
                  onChange={this.torOnChange}
                  placeholder="Select ToR"
                  isMulti={false}
                  name="tor"
                  error={errors.tor}
                  required
                  fullWidth={true}
                />
              </Grid>
              {  tor.sbp_recruitment_campaign === "no" &&
              <Grid item xs={12} sm={3}>
                <SelectField
                  label="Country *"
                  options={countries}
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
              }
              { tor.sbp_recruitment_campaign === "no" && tor.under_sbp_program === "no" &&
                <Grid item xs={12} sm={3}>
                  <SelectField
                    label="3iSolution Office *"
                    options={immap_offices}
                    value={immap_office}
                    onChange={this.selectOnChange}
                    placeholder="Select 3iSolution Office"
                    isMulti={false}
                    name="immap_office"
                    error={errors.immap_office}
                    required
                    fullWidth={true}
                  />
                </Grid>
              }
              <Grid item xs={12} sm={3}>
                <SelectField
                  label="Languages *"
                  options={language_list}
                  value={languages}
                  onChange={this.selectOnChange}
                  placeholder="Select language (s)"
                  isMulti
                  name="languages"
                  error={errors.languages}
                  required
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <SelectField
                  label="Status *"
                  options={statusJobOption}
                  value={status}
                  onChange={this.selectOnChange}
                  placeholder="Select status"
                  isMulti={false}
                  name="status"
                  error={errors.status}
                  required
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePickerField
                  label="Opening Date"
                  name="opening_date"
                  value={opening_date}
                  onChange={this.dateOnChange}
                  error={errors.opening_date}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePickerField
                  label="Closing Date"
                  name="closing_date"
                  value={closing_date}
                  onChange={this.dateOnChange}
                  error={errors.closing_date}
                />
              </Grid>
              { tor.sbp_recruitment_campaign === "no" &&
              <>
                <Grid item xs={12} sm={tor.sbp_recruitment_campaign === "no" && tor.under_sbp_program === "no" ? 3 : 4}>
                  <DatePickerField
                    label="Contract Start"
                    name="contract_start"
                    value={contract_start}
                    onChange={this.dateOnChange}
                    error={errors.contract_start}
                  />
                </Grid>

                <Grid item xs={12} sm={tor.sbp_recruitment_campaign === "no" && tor.under_sbp_program === "no" ? 3 : 5}>
                  <DatePickerField
                    label="Contract End"
                    name="contract_end"
                    value={contract_end}
                    onChange={this.dateOnChange}
                    error={errors.contract_end}
                  />
                </Grid>
              </>
               }
              <Grid item sm={12}  xs={12}>
                <TextField
                  required
                  id="title"
                  name="title"
                  label="Job Title"
                  fullWidth
                  autoComplete="title"
                  value={title}
                  onChange={this.onChange}
                  error={!isEmpty(errors.title)}
                  helperText={errors.title}
                  className={classes.align}
                />
              </Grid>
              {tor.under_sbp_program === "no" && tor.sbp_recruitment_campaign === "no" && (
                <>
                  <Grid item xs={12}>
                    <SelectField
                      label="Manager *"
                      options={immap_emails}
                      value={managers}
                      onChange={this.selectOnChange}
                      placeholder="Select Manager"
                      isMulti={true}
                      name="managers"
                      error={errors.managers}
                      required
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <SelectField
                      label="Disable editing/admin rights related to this position for the following 3iSolution members:"
                      options={immapers}
                      value={exclude_immaper}
                      onChange={this.selectOnChange}
                      placeholder=" "
                      name="exclude_immaper"
                      error={errors.exclude_immaper}
                      required
                      isMulti={true}
                      fullWidth={true}
                      margin="none"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl margin="none" error={!isEmpty(errors.include_cover_letter)}>
                      <FormControlLabel
                        className={classes.switch}
                        labelPlacement="start"
                        control={
                          <Switch
                            checked={include_cover_letter === 1 ? true : false}
                            onChange={(e) =>
                              this.setState({ include_cover_letter: e.target.checked ? 1 : 0 })}
                            value={include_cover_letter === 1 ? true : false}
                            color="primary"
                            name="include_cover_letter"
                            classes={{ switchBase: classes.switchBase }}
                          />
                        }
                        label="Include Cover Letter ?"
                      />
                      {!isEmpty(errors.include_cover_letter) && (
                        <FormHelperText>{errors.include_cover_letter}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}
              { tor.sbp_recruitment_campaign === "no" && tor.under_sbp_program === "no" &&
                  <Grid item xs={12} sm={3}>
                    <FormControl margin="none" error={!isEmpty(errors.show_contract)}>
                      <FormControlLabel
                        className={classes.switch}
                        labelPlacement="start"
                        control={
                          <Switch
                            checked={show_contract === 1 ? true : false}
                            onChange={(e) =>
                              this.setState({ show_contract: e.target.checked ? 1 : 0 })}
                            value={show_contract === 1 ? true : false}
                            color="primary"
                            name="show_contract"
                            classes={{ switchBase: classes.switchBase }}
                          />
                        }
                        label="Show Contract Detail ?"
                      />
                      {!isEmpty(errors.show_contract) && (
                        <FormHelperText>{errors.show_contract}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
              }
              { tor.sbp_recruitment_campaign === "no" &&
                <Grid item xs={12} sm={3}>
                  <FormControl margin="none" error={!isEmpty(errors.show_salary)}>
                    <FormControlLabel
                      className={classes.switch}
                      labelPlacement="start"
                      control={
                        <Switch
                          checked={show_salary === 1 ? true : false}
                          onChange={(e) =>
                            this.setState({ show_salary: e.target.checked ? 1 : 0 })}
                          value={show_salary === 1 ? true : false}
                          color="primary"
                          name="show_salary"
                          classes={{ switchBase: classes.switchBase }}
                        />
                      }
                      label="Show Fees ?"
                    />
                    {!isEmpty(errors.show_salary) && (
                      <FormHelperText>{errors.show_salary}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              }
               { tor.sbp_recruitment_campaign === "no" && tor.under_sbp_program === "no" &&
                  <Grid item xs={12} sm={3}>
                    <FormControl margin="none" error={!isEmpty(errors.use_test_step)}>
                      <FormControlLabel
                        className={classes.switch}
                        labelPlacement="start"
                        control={
                          <Switch
                            checked={use_test_step === 1 ? true : false}
                            onChange={(e) =>
                              this.setState({ use_test_step: e.target.checked ? 1 : 0 })}
                            value={use_test_step === 1 ? true : false}
                            color="primary"
                            name="use_test_step"
                            classes={{ switchBase: classes.switchBase }}
                          />
                        }
                        label="Use Test step ?"
                      />
                      {!isEmpty(errors.use_test_step) && (
                        <FormHelperText>{errors.use_test_step}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
              }
              { use_test_step == 1 &&
                <Grid item xs={12}>
                  <SelectField
                    label="Test step *"
                    options={testStepOptions}
                    value={test_step_position}
                    onChange={this.selectOnChange}
                    placeholder="Select Test step position"
                    isMulti={false}
                    name="test_step_position"
                    error={errors.test_step_position}
                    required
                    fullWidth={true}
                  />
                </Grid>
               }
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
                        />
                      );
                    })}
                  {!isEmpty(errors.sub_sections) && (
                    <FormHelperText>{errors.sub_sections}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button disabled={isLoading} type="submit" fullWidth variant="contained" color="primary">
                  {this.state.isEdit ? 'Update' : 'Save'}{' '}
                  {isLoading && (
                    <CircularProgress thickness={5} size={22} className={classes.loading} />
                  )}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Dialog fullWidth={ closeSurgeAlertCheck ? true : false} open={this.state.popUpStatus} onClose={() => {

          this.setState({
            popUpStatus: false
          })
        }}>
          <DialogTitle>{'Confirmation'}</DialogTitle>
          <DialogContent className={closeSurgeAlertCheck && classes.peddingDialog}>
            <DialogContentText id="alert-dialog-description">
              {
                this.state.jobStatusClose == true ? 'Are you sure you want to reopen this job?' :
                  'Are you sure you want to close this job?'
              }
            </DialogContentText>
            { closeSurgeAlertCheck &&
              <>
                <SelectField
                      label="Close surge alert job options *"
                      options={closeSurgeAlertOptions}
                      value={closeSurgeAlert}
                      onChange={this.selectOnChange}
                      placeholder="Select Close Surge Alert Job Option"
                      isMulti={false}
                      name="closeSurgeAlert"
                      required
                      fullWidth={true}
                  />
              </>
           }
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({
                  popUpStatus: false
                })
              }}
              color="secondary"
              variant="contained"
            >
              Cancel
				  	</Button>
              <Button
                onClick={(value, e) => {

                  this.processJobStatusChange();
                }}
                color="primary"
                autoFocus
                variant="contained"
                disabled={this.state.changeStatusLoading }
              >
                Confirm
              {this.state.changeStatusLoading && (
                  <CircularProgress size={22} thickness={5} className={classes.loading} />
                )}
              </Button>
          </DialogActions>
        </Dialog>
      </form>
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
  addFlashMessage,
  getLanguages,
  getCountries,
  getImmapOffices,
  getImmapEmailAddress,
  getImmapers
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  language_list: state.options.languages,
  countries: state.options.countries,
  immap_offices: state.options.immapOffices,
  immap_emails: state.options.immap_emails,
  immapers: state.options.immapers,
  immap_email: !isEmpty(state.auth.user) ? state.auth.user.data.immap_email : ''
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  loading: {
    color: white,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  switch: {
    marginLeft: 0
  },
  switchBase: {
    height: 'auto'
  },
  align : {
    marginBottom: '8px'
  },
  peddingDialog : {
    paddingBottom: '100px'
  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobForm));
