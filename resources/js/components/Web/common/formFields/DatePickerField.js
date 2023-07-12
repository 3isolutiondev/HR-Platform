import React from 'react';
import PropTypes from 'prop-types';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import "moment/locale/en-au";
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import isEmpty from '../../validations/common/isEmpty';
import { MuiPickersUtilsProvider, DatePicker, DateTimePicker } from 'material-ui-pickers';


// Pick Date or DateTime
const DatePickerField = ({ label, margin, name, value, usingTime, disablePast, onChange, error, disabled, clearable, usingSecond }) => {
  const dateOnChange = (date) => {
    let selectedDate = usingTime ? usingSecond ? moment(date).format('YYYY-MM-DD HH:mm:ss') : moment(date).format('YYYY-MM-DD HH:mm') : moment(date).format('YYYY-MM-DD');

    onChange({ target: { name: name, value: selectedDate } });
  };

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
      <FormControl fullWidth margin={margin} error={!isEmpty(error)}>
        <FormLabel>{label}</FormLabel>
        {!usingTime ? (
          <DatePicker
            value={isEmpty(value) ? null : new Date(value)}
            onChange={(date) => dateOnChange(date)}
            format="DD MMMM YYYY"
            name={name}
            disabled={disabled}
            clearable={clearable}
          />
        ) : (
            <DateTimePicker
              disablePast={disablePast}
              value={isEmpty(value) ? null : new Date(value)}
              onChange={(date) => dateOnChange(date)}
              format={usingSecond ? "DD MMMM YYYY HH:mm:ss" : "DD MMMM YYYY HH:mm"}
              name={name}
              ampm={false}
              disabled={disabled}
              clearable={clearable}
            />
          )}
        {!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </MuiPickersUtilsProvider>
  );
};

DatePickerField.defaultProps = {
  margin: 'normal',
  usingTime: false,
  disablePast: false,
  clearable: false,
  error: '',
  disabled: false,
  usingSecond: true
};

DatePickerField.propTypes = {
  label: PropTypes.string.isRequired,
  margin: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  usingTime: PropTypes.bool.isRequired,
  usingSecond: PropTypes.bool.isRequired,
  disablePast: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  clearable: PropTypes.bool
};

export default DatePickerField;
