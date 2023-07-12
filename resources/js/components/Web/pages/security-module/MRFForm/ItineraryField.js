import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import isEmpty from '../../../validations/common/isEmpty'
import ItinerarySingle from './ItinerarySingle'
import Typography from '@material-ui/core/Typography'
import { red, redRed, redGreen, redBlue } from '../../../config/colors'

class ItineraryField extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this);
    this.checkOutOfBoundMultiLocation = this.checkOutOfBoundMultiLocation.bind(this);
  }

  onChange(itinerary) {
    this.props.onChange(itinerary)
  }

  checkOutOfBoundMultiLocation() {
    let check = this.props.value.filter(leg => {
      if (leg.outbound_trip_final_destination == 1) {
        return leg;
      }
    });

    return check.length > 0 ? true : false;
  }

  render() {
    const { classes, value, addConnection, deleteConnection, moveup, movedown, error, title, disabled, travelType, transportationType, allTravellingTypes, status, checkInConfirmation, editFlightNumber, allTravellingTypesWithFlight, showCheckInBtn, airAndGroundError, isSbpMember, isSecurity } = this.props

    return (
      <div className={classes.addMarginBottom}>
        <Typography color="primary" variant="subtitle1" className={!isEmpty(error) ? classes.titleError : classes.title}>{title}</Typography>
        {!isEmpty(value) &&
          value.map((connection, index) => (
            <ItinerarySingle
              key={'itinerary-' + index}
              value={connection}
              itineraryIndex={index}
              deleteConnection={deleteConnection}
              movedown={movedown} moveup={moveup}
              onChange={this.onChange}
              isLast={(value.length - 1) == index ? true : false}
              isFirst={0 == index ? true : false}
              isSecond={1 == index ? true : false}
              disabled={disabled}
              travelType={travelType}
              transportationType={transportationType}
              allTravellingTypes={allTravellingTypes}
              legCount={value.length}
              checkOutOfBoundMultiLocation={this.checkOutOfBoundMultiLocation}
              editFlightNumber={editFlightNumber}
              status={status}
              checkInConfirmation={checkInConfirmation}
              allTravellingTypesWithFlight={allTravellingTypesWithFlight}
              showCheckInBtn={showCheckInBtn}
              isSbpMember={isSbpMember}
              isSecurity={isSecurity}
            />
          ))
        }
        {!isEmpty(error) && (
          <Typography variant="body2" className={classes.error}>{error}</Typography>
        )}
         {!isEmpty(airAndGroundError) && (
          <Typography variant="body2" className={classes.error}>{airAndGroundError}</Typography>
        )}
        {(!disabled && travelType == "multi-location") && (
          <Button variant="contained" color="primary" onClick={addConnection} disabled={disabled}>
            <AddIcon /> Add Connection
          </Button>
        )}
      </div>
    )
  }
}

ItineraryField.defaultProps = {
  disabled: false,
  travelType: 'one-way-trip'
}

ItineraryField.propTypes = {
  value: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  addConnection: PropTypes.func.isRequired,
  deleteConnection: PropTypes.func.isRequired,
  moveup: PropTypes.func.isRequired,
  movedown: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  hasRoundTrip: PropTypes.bool,
  transportationType: PropTypes.oneOf(['', 'air-travel', 'ground-travel', 'air-and-ground-travel']),
  travelType: PropTypes.oneOf(['', 'one-way-trip', 'round-trip', 'multi-location']),
  allTravellingTypes: PropTypes.array.isRequired
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
    marginBottom: theme.spacing.unit * 2
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

export default withStyles(styles)(ItineraryField)
