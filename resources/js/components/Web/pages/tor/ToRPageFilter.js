/** import React, classname and react input range */
import React, { Component } from 'react';
import classname from 'classnames';
import InputRange from 'react-input-range';

/** import Materiaul UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';

/** import react redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { getImmapOffices } from '../../redux/actions/optionActions';
import {
  getTorCountry,
  onChange,
  resetFilter,
  filterArray,
  isFilterIsReset
} from '../../redux/actions/tor/torPageFiterAction'

/** import css, configuration value, permission checker and validation helper */
import 'react-input-range/lib/css/index.css';
import { primaryColor } from '../../config/colors';
import '../jobs/job.css';
import { can } from '../../permissions/can';
import isEmpty from '../../validations/common/isEmpty';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  addMarginTop: {
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
  sliderColor: {
    background: primaryColor
  },
  filterTitle: {
    'padding-bottom': 0
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

/**
 * ToRPageFilter is a component to show filter in ToR page
 *
 * @name ToRPageFilter
 * @component
 * @category Page
 * @subcategory ToR
 *
 */
class ToRPageFilter extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    if (!isEmpty(this.props.user)) {
      if (can('Add ToR') || can('Edit ToR') || can('Delete ToR')) {
        this.props.getImmapOffices();
      }
    }
    this.props.getTorCountry()
  }

  /**
   * onChange is a function to change data of search box in the filter
   * @param {Event} e
   */
  onChange(e) {
    this.props.setLoadingToR(true);
    this.props.onChange(e.target.name, e.target.value)
    this.props.isFilterIsReset(true, false)
  }

  render() {
    const { classes, immap_offices, torPageFilter, user, sbpTab, alertTab  } = this.props;
    const {
      search,
      contract_length,
      choosen_country,
      choosen_immap_office,
      countries,
      errors
    } = torPageFilter;

    return (
      <Card>
        <CardHeader
          title="Filter"
          className={classes.filterTitle}
          action={
            <Typography
              variant="body1"
              color="primary"
              className={classes.resetBtn}
              onClick={() => {
                this.props.setLoadingToR(true);
                this.props.resetFilter()
                this.props.reseter()
              }}
            >
              Reset
			</Typography>
          }
        />
        <CardContent>
          <div>
            <TextField
              id="search"
              name="search"
              label="Search"
              fullWidth
              value={search}
              onChange={this.onChange}
              error={!isEmpty(errors.search)}
              helperText={errors.search}
              autoFocus={false}
            />
              { sbpTab != 'yes' &&
              <>
                <FormControl margin="normal" fullWidth error={!isEmpty(errors.contract_length) ? true : false}>
                    <FormLabel className={classes.sliderLabel}>Contract Length (Month)</FormLabel>
                      <div>
                        <InputRange
                          className={classname(classes.addPaddingBottom, classes.sliderColor)}
                          maxValue={24}
                          minValue={0}
                          value={contract_length}
                          onChange={(contract_length) => {
                            this.props.isFilterIsReset(true, false)
                            this.props.setLoadingToR(true);
                            this.props.onChange("contract_length", contract_length);
                          }}
                        />
                      </div>
                      {!isEmpty(errors.contract_length) && (
                        <FormHelperText className={classes.sliderFormHelperText}>
                          {errors.contract_length}
                        </FormHelperText>
                      )}
                </FormControl>

                <FormControl
                margin="normal"
                className={classes.countryFormControl}
                fullWidth
                error={!isEmpty(errors.choosen_country) ? true : false}
              >
                <FormLabel>Country</FormLabel>
                <FormGroup>
                  {countries.length > 0 &&
                    countries.map((country) => {
                      return (
                        <FormControlLabel
                          classes={{ label: classes.addMarginTop }}
                          color="primary"
                          key={country.id}
                          control={
                            <Checkbox
                              checked={
                                choosen_country.indexOf(country.id.toString()) > -1 ? (
                                  true
                                ) : (
                                    false
                                  )
                              }
                              value={country.id.toString()}
                              color="primary"
                              name="choosen_country"
                              className={classes.noPaddingBottom}
                              onChange={(e) => {
                                this.props.setLoadingToR(true);
                                this.props.filterArray(e.target.name, e.target.value);
                              }}
                            />
                          }
                          label={country.name}
                        />
                      );
                    })}
                </FormGroup>
                {!isEmpty(errors.choosen_country) && (
                  <FormHelperText>{errors.choosen_country}</FormHelperText>
                )}
                </FormControl>
                {((can('Add ToR') || can('Edit ToR') || can('Delete ToR')) && user.isIMMAPER && alertTab == 'no') && (
                  <FormControl
                    margin="normal"
                    fullWidth
                    error={!isEmpty(errors.choosen_immap_office) ? true : false}
                  >
                    <FormLabel>3iSolution Office</FormLabel>
                    <FormGroup>
                      {(!isEmpty(immap_offices) && immap_offices.length) &&
                        immap_offices.length > 0 &&
                        immap_offices.map((immap_office) => {
                          return (
                            <FormControlLabel
                              classes={{ label: classes.addMarginTop }}
                              color="primary"
                              key={immap_office.value}
                              control={
                                <Checkbox
                                  checked={
                                    choosen_immap_office.indexOf(
                                      immap_office.value.toString()
                                    ) > -1 ? (
                                        true
                                      ) : (
                                        false
                                      )
                                  }
                                  value={immap_office.value.toString()}
                                  color="primary"
                                  name="choosen_immap_office"
                                  className={classes.noPaddingBottom}
                                  onChange={(e) => {
                                    this.props.setLoadingToR(true);
                                    this.props.filterArray(e.target.name, e.target.value);
                                  }}
                                />
                              }
                              label={immap_office.label}
                            />
                          );
                        })}
                    </FormGroup>
                    {!isEmpty(errors.choosen_immap_office) && (
                      <FormHelperText>{errors.choosen_immap_office}</FormHelperText>
                    )}
                  </FormControl>
                )}
              </>
             }
          </div>
        </CardContent>
      </Card>
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
  getImmapOffices,
  getTorCountry,
  onChange,
  resetFilter,
  filterArray,
  isFilterIsReset
};


/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStatetoProps = (state) => ({
  immap_offices: state.options.immapOffices,
  user: state.auth.user,
  torPageFilter: state.torPageFilter
});

export default withStyles(styles)(connect(mapStatetoProps, mapDispatchToProps)(ToRPageFilter));
