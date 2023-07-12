import React from 'react';
import PropTypes from 'prop-types';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import isEmpty from '../../validations/common/isEmpty';
import { MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';

// Pick Time
const TimePickerField = ({ label, margin, name, value, onChange, error, disabled, clearable }) => {
  const timeOnChange = (time) => {
    let selectedTime = moment(time, 'HH:mm').format('HH:mm');
    onChange({ target: { name: name, value: selectedTime } });
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <FormControl fullWidth margin={margin} error={!isEmpty(error)}>
        <FormLabel>{label}</FormLabel>
          <TimePicker
            value={isEmpty(value) ? null : moment(value, 'HH:mm')}
            onChange={(date) => timeOnChange(date)}
            ampm={false}
            name={name}
            disabled={disabled}
            clearable={clearable}
          />
        {!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </MuiPickersUtilsProvider>
  );
};

TimePickerField.defaultProps = {
  margin: 'normal',
  clearable: false,
  error: '',
  disabled: false
};

TimePickerField.propTypes = {
  label: PropTypes.string.isRequired,
  margin: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  clearable: PropTypes.bool
};

export default TimePickerField;
