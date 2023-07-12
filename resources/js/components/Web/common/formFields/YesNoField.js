/** import React and PropTypes */
import React from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

/** import validation helper */
import isEmpty from '../../validations/common/isEmpty';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
  displayBlock: {
    display: 'block'
  },
  normal: {}
});

/**
 * YesNoField component: Show yes and no radio options, with yes return 1 and no return 0
 *
 * @name YesNoField
 * @component
 * @category Common
 * @subcategory Form Field
 */
const YesNoField = (props) => {
  let label = <FormLabel>{props.label}</FormLabel>;

  if (props.bold) {
    let lengthBold = props.bold.length;
    if (props.label.indexOf(props.bold) !== -1) {
      let index1 = props.label.indexOf(props.bold);
      let index2 = props.label.indexOf(props.bold) + lengthBold;
      let firstText = props.label.slice(0, index1);
      let lastText = props.label.slice(index2);
      label = (
        <FormLabel>
          {firstText} <b>{props.bold}</b>
          {lastText}
        </FormLabel>
      );
    }
  }

  return (
    <FormControl margin={!isEmpty(props.margin) ? props.margin : 'normal'} error={!isEmpty(props.error)} disabled={props.disabled} className={isEmpty(props.className) ? props.classes.normal : props.className} style={props.forTravelDetail ? { marginTop: '-16px' } : {}}>
      {label}
      <RadioGroup
        aria-label={props.ariaLabel}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        className={props.classes.displayBlock}
      >
        <FormControlLabel value="1" control={<Radio />} label="Yes" disabled={props.disabled} />
        <FormControlLabel value="0" control={<Radio />} label="No" disabled={props.disabled} />
      </RadioGroup>
      {!isEmpty(props.error) && <FormHelperText>{props.error}</FormHelperText>}
    </FormControl>
  );
};

YesNoField.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired,
  /**
   * label is a prop containing field label
   */
  label: PropTypes.string.isRequired,
  /**
   * name is a prop containing field name
   */
  name: PropTypes.string.isRequired,
  /**
   * ariaLable is a prop containing field ariaLabel
   */
  ariaLabel: PropTypes.string,
  /**
   * value is a prop containing field value
   */
  value: PropTypes.string.isRequired,
  /**
   * onChange is a prop function to set field value
   */
  onChange: PropTypes.func.isRequired,
  /**
   * error is a prop containing error text
   */
  error: PropTypes.string
};

export default withStyles(styles)(YesNoField);
