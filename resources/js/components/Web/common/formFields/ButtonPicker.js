import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import isEmpty from '../../validations/common/isEmpty'
import { red, redRed, redGreen, redBlue } from '../../config/colors'

// Button Picker, options shown using Button
const ButtonPicker = ({ classes, options, name, title, value, error, onChange, disabled }) => (
  <Grid container spacing={16}>
    <Grid item xs={12}><Typography color="primary" variant="subtitle1" className={!isEmpty(error) ? classes.titleError : classes.title}>{title}</Typography></Grid>
    <Grid item xs={12}>
      {(!isEmpty(options) && typeof options !== 'undefined') && (
        options.map((option) => (
          <Button
            key={'picker-' + name + '-' + option.value}
            variant={option.value === value ? "contained" : "outlined"}
            className={classes.width}
            color={option.value === value ? "primary" : "default"}
            onClick={() => onChange(option.value)}
            disabled={disabled}
          >
            {option.label}
          </Button>
        ))
      )}
    </Grid>
    {!isEmpty(error) && (
      <Grid item xs={12}>
        <Typography variant="body2" className={classes.error}>{error}</Typography>
      </Grid>
    )}
  </Grid>
)

ButtonPicker.defaultProps = {
  options: [],
  value: '',
  disabled: false,
  error: ''
}

ButtonPicker.propTypes = {
  classes: PropTypes.object.isRequired,
  options: PropTypes.array,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string

}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  title: { color: 'rgba(0,0,0,0.54)' },
  titleError: { color: red },
  btnSelected: { backgroundColor: 'rgba(0,0,0,0.08)' },
  error: {
    color: red,
    padding: theme.spacing.unit + 'px ' + (theme.spacing.unit * 2) + 'px',
    border: '1px solid' + red,
    borderRadius: theme.spacing.unit / 2,
    background: 'rgba(' + redRed + ', ' + redGreen + ', ' + redBlue + ', 0.08)',
    marginBottom: theme.spacing.unit * 2
  },
  width: { marginRight: theme.spacing.unit, minWidth: theme.spacing.unit * 15, marginBottom: theme.spacing.unit }
})

export default withStyles(styles)(ButtonPicker)
