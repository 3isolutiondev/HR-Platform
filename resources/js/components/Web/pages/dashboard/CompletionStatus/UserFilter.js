import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import isEmpty from '../../../validations/common/isEmpty';

import {
  resetFilter,
  filterUserArray,
} from '../../../redux/actions/completionstatus/userFilterActions';

import 'react-input-range/lib/css/index.css';
import { primaryColor } from '../../../config/colors';

import Typography from '@material-ui/core/Typography';

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

class UserFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      steps :[
        { key:'step1', value:'1', label:'Step 1'},
        { key:'step2', value:'2', label:'Step 2'},
        { key:'step3', value:'3', label:'Step 3'},
        { key:'step4', value:'4', label:'Step 4'},
        { key:'step5', value:'5', label:'Step 5'},
        { key:'step6', value:'6', label:'Step 6'},
        { key:'step7', value:'7', label:'Step 7'},
        { key:'step8', value:'8', label:'Step 8'},
        { key:'step9', value:'9', label:'Step 9'},
        { key:'step10', value:'10', label:'Step 10'},
        { key:'step11', value:'11', label:'Step 11'},
      ],
      status: [
        { key: 'not-submitted', value: 'Not Submitted', label: 'Not Submitted' },
        { key: 'active', value: 'Active', label: 'Active' },
        { key: 'inactive', value: 'Inactive', label: 'Inactive' },
        { key: 'hidden', value: 'Hidden', label: 'Hidden' },
      ]
    }

    this.renderSelectedValue = this.renderSelectedValue.bind(this);
  }

  renderSelectedValue(selected, allOptions) {
    let selectedText = '';
    if (!isEmpty(selected)) {
      allOptions.map(step => {
        if (selected.some(value => value === step.value)) {
          selectedText = isEmpty(selectedText) ? `${step.label} ` : `${selectedText}, ${step.label}`
        }
      })
    }

    return selectedText;
  }

  render() {
		const { classes, userFilterStatus, isMobile } = this.props;
		const { steps, status, roles } = userFilterStatus;

    return (
      <Card style={isMobile ? {border: 0} : {}}>
        <CardHeader
          title="Filter"
          className={classes.filterTitle}
          action={
            <Typography
              variant="body1"
              color="primary"
              className={classes.resetBtn}
              onClick={() => {
                  this.props.resetKeyword();
                	this.props.resetFilter();
                  this.props.reset()
              }}
            >
              Reset
						</Typography>
          }
        />
        <CardContent>
          <div>
            <FormControl margin="normal" fullWidth>
              <FormLabel>Steps</FormLabel>
              <Select
                id="mutiple-checkbox-for-steps"
                multiple
                value={steps}
                input={<Input />}
                renderValue={(selected) => this.renderSelectedValue(selected, this.state.steps)}
              >
                {	this.state.steps.map(data=> {
                  return <MenuItem key={data.key} value={data.value}>
                    <Checkbox 	name="steps"
                      color="primary"
                      className={classes.noPaddingBottom}
                      onChange={(e) => {
                          this.props.filterUserArray(e.target.name, e.target.value);
                      }}
                      checked={steps.indexOf(data.value) > -1 ? true : false}
                      value={data.value} />
                    <ListItemText primary={`Step ${data.value}`}  />
                  </MenuItem>
                })}
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl margin="normal" fullWidth>
              <FormLabel>Status</FormLabel>
              <Select
                id="mutiple-checkbox-for-status"
                multiple
                value={status}
                input={<Input />}
                renderValue={(selected) => this.renderSelectedValue(selected, this.state.status)}
              >
                {	this.state.status.map(statusData => {
                  return <MenuItem key={statusData.key} value={statusData.value}>
                    <Checkbox 	name="status"
                      color="primary"
                      className={classes.noPaddingBottom}
                      onChange={(e) => {
                          this.props.filterUserArray(e.target.name, e.target.value);
                      }}
                      checked={status.indexOf(statusData.value) > -1 ? true : false}
                      value={statusData.value} />
                    <ListItemText primary={statusData.value}  />
                  </MenuItem>
                })}
              </Select>
            </FormControl>
          </div>

          <div>
            <FormControl margin="normal" fullWidth>
              <FormLabel>Roles</FormLabel>
              <Select
                id="mutiple-checkbox-for-roles"
                multiple
                value={roles}
                input={<Input />}
                renderValue={(selected) => this.renderSelectedValue(selected, this.props.roles.map(x => ({value: x.id.toString(), label: x.name})))}
              >
                {	this.props.roles.map(roleData => {
                  return <MenuItem key={roleData.id}  value={roleData.id.toString()}>
                    <Checkbox 	name="roles"
                      color="primary"
                      className={classes.noPaddingBottom}
                      onChange={(e) => {
                          this.props.filterUserArray(e.target.name, e.target.value);
                      }}
                      checked={roles.indexOf(roleData.id.toString()) > -1 ? true : false}
                      value={roleData.id.toString()} />
                    <ListItemText primary={roleData.name}  />
                  </MenuItem>
                })}
              </Select>
            </FormControl>
          </div>
        </CardContent>
      </Card>
    );
  }
}

UserFilter.defaultProps = {
  isMobile: false,
  roles: []
}

UserFilter.propTypes = {
  resetKeyword: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  filterUserArray: PropTypes.func.isRequired,
  userFilterStatus: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
  roles: PropTypes.array
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  resetFilter,
  filterUserArray
};

const mapStatetoProps = (state) => ({
  userFilterStatus: state.userFilterStatus
});

export default withStyles(styles)(connect(mapStatetoProps, mapDispatchToProps)(UserFilter));
