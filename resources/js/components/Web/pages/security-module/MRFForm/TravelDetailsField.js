import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import isEmpty from '../../../validations/common/isEmpty'
import TravelDetailSingle from './TravelDetailSingle'
import Typography from '@material-ui/core/Typography'
import { red, redRed, redGreen, redBlue } from '../../../config/colors'

class TravelDetailsField extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange(travel_detail) {
    this.props.onChange(travel_detail)
  }

  render() {
    const { classes, value, addTravelDetail, deleteTravelDetail, moveup, movedown, error, title, disabled, multiVehicle, transportationType, vehicleCheck, showTravelDetails, securityMeasure } = this.props

    return (
      <div className={classes.addMarginBottom}>
        <Typography color="primary" variant="subtitle1" className={!isEmpty(error) ? classes.titleError : classes.title}>{title}</Typography>
        {!isEmpty(value) &&
          value.map((travelDetail, index) => (
            <TravelDetailSingle
              key={'travel-detail-' + index}
              value={travelDetail}
              travelDetailIndex={index}
              deleteTravelDetail={deleteTravelDetail}
              movedown={movedown}
              moveup={moveup}
              onChange={this.onChange}
              isLast={(value.length - 1) == index ? true : false}
              isFirst={0 == index ? true : false}
              disabled={disabled}
              multiVehicle={multiVehicle}
              error={error}
              transportationType={transportationType}
              vehicleCheck={vehicleCheck}
              showTravelDetails={showTravelDetails}
              securityMeasure= {securityMeasure}
            />
          ))
        }
        {(!disabled && (multiVehicle || securityMeasure == 'use-of-hire-car')) && (
          <Button variant="contained" color="primary" onClick={addTravelDetail} disabled={disabled}>
            <AddIcon /> {securityMeasure == 'use-of-hire-car' ? 'Additional Car Hire Company' : 'Add New Vehicle'} 
          </Button>
        )}
        {!isEmpty(error) && (
          <Typography variant="body2" className={classes.error}>{error}</Typography>
        )}
      </div>
    )
  }
}

TravelDetailSingle.defaultProps = {
  disabled: false,
  multiVehicle: false
}

TravelDetailsField.propTypes = {
  value: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  addTravelDetail: PropTypes.func.isRequired,
  deleteTravelDetail: PropTypes.func.isRequired,
  moveup: PropTypes.func.isRequired,
  movedown: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  multiVehicle: PropTypes.bool
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  error: {
    color: red,
    padding: theme.spacing.unit + 'px ' + (theme.spacing.unit * 2) + 'px',
    border: '1px solid' + red,
    borderRadius: theme.spacing.unit / 2,
    background: 'rgba(' + redRed + ', ' + redGreen + ', ' + redBlue + ', 0.08)',
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  title: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  titleError: {
    color: red
  },
  addMarginBottom: {
    marginBottom: theme.spacing.unit
  }
})

export default withStyles(styles)(TravelDetailsField)
