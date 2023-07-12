import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import isEmpty from '../../../validations/common/isEmpty'
import ItinerarySingle from './ItinerarySingle'
import Typography from '@material-ui/core/Typography'
import { red, redRed, redGreen, redBlue, primaryColor } from '../../../config/colors'

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
    const { classes, value, addConnection, deleteConnection, title, error, moveArray, disabled, travelType, status, checkInConfirmation, editFlightNumber, showCheckInBtn, isSecurity, isSbpMember  } = this.props

    return (
      <div className={classes.addMarginBottom}>
        <Typography color="primary" variant="subtitle1" className={!isEmpty(error) ? classes.titleError : disabled ? classes.disabledTitle : classes.title}>{title}</Typography>
        {!isEmpty(value) &&
          value.map((connection, index) => (
            <ItinerarySingle
              key={'itinerary-' + index}
              value={connection}
              itineraryIndex={index}
              deleteConnection={deleteConnection}
              onChange={this.onChange}
              isLast={(value.length - 1) == index ? true : false}
              isFirst={0 == index ? true : false}
              moveArray={moveArray}
              disabled={disabled}
              travelType={travelType}
              legCount={value.length}
              checkOutOfBoundMultiLocation={this.checkOutOfBoundMultiLocation}
              editFlightNumber={editFlightNumber}
              status={status}
              checkInConfirmation={checkInConfirmation}
              showCheckInBtn={showCheckInBtn}
              isSecurity={isSecurity}
              isSbpMember={isSbpMember}
            />
          ))
        }
        {!isEmpty(error) && (
          <Typography variant="body2" className={classes.error}>{error}</Typography>
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
  moveArray: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  addConnection: PropTypes.func.isRequired,
  deleteConnection: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  travelType: PropTypes.oneOf(['one-way-trip', 'round-trip', 'multi-location'])
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
    color: primaryColor
  },
  titleError: {
    color: red
  },
  disabledTitle: {
    color: 'rgba(0,0,0,0.54)'
  },
  addMarginBottom: {
    marginBottom: theme.spacing.unit
  }
})

export default withStyles(styles)(ItineraryField)
