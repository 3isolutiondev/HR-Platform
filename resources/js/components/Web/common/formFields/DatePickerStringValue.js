import React from 'react';
import PropTypes from 'prop-types';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import isEmpty from '../../validations/common/isEmpty';
import { MuiPickersUtilsProvider, DatePicker, DateTimePicker } from 'material-ui-pickers';

const DatePickerStringValue = ({ label, margin, name, value, usingTime, disablePast, onChange, error }) => {
    const dateOnChange = (date) => {
        let selectedDate = usingTime ? moment(date).format('YYYY-MM-DD HH:mm:ss') : moment(date).format('YYYY-MM-DD');
        onChange({ target: { name: name, value: selectedDate } });
    };

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <FormControl fullWidth margin={margin} error={!isEmpty(error)}>
                <FormLabel>{label}</FormLabel>
                {!usingTime ? (
                    <DatePicker
                        value={new Date(value)}
                        onChange={(date) => dateOnChange(date)}
                        format="DD MMMM YYYY"
                        name={name}
                    />
                ) : (
                        <DateTimePicker
                            disablePast={disablePast}
                            value={isEmpty(value) ? null : new Date(value)}
                            onChange={(date) => dateOnChange(date)}
                            format="DD MMMM YYYY HH:mm:ss"
                            name={name}
                            ampm={false}
                        />
                    )}
                {!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
        </MuiPickersUtilsProvider>
    );
};

DatePickerStringValue.defaultProps = {
    margin: 'normal',
    usingTime: false,
    disablePast: false
};

DatePickerStringValue.propTypes = {
    label: PropTypes.string.isRequired,
    margin: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    usingTime: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
};

export default DatePickerStringValue;
