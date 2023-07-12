import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from '../validations/common/isEmpty';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
    link: {
        'text-decoration': 'none'
    },
    alignRight: {
        float: 'right'
    },
    alignLeft: {
        float: 'left'
    }
});

/**
 * Button component that will running custom function when it's clicked.
 *
 * Currently used in ToR page only
 *
 * Permission: -
 *
 * @component
 * @name Button
 * @category Common
 * @subcategory Button
 * @example
 * return (
 *  <Button
 *    btnText="Add New ToR"
 *    btnStyle="contained"
 *    color="primary"
 *    size="small"
 *    icon={<Add />}
 *    onClick={() => this.handleCheck('/tor/add')}
 *  />
 * )
 *
 */
const Buttons = ({
    btnText,
    btnStyle,
    size,
    color,
    icon,
    classes,
    align,
    fullWidth,
    className,
    removeLocalStorage,
    onClick,
    ...props
}) => {
    return (
        <Button
            variant={btnStyle}
            color={color}
            size={size}
            onClick={() => onClick()}
            className={classNames(
                classes.link,
                align === 'right' ? classes.alignRight : align === 'left' ? classes.alignLeft : null,
                !isEmpty(className) ? className : {}
            )}
            fullWidth={fullWidth ? true : false}
        >
            {icon} {btnText}
        </Button>
    );
};

Buttons.propTypes = {
  /**
   * btnText is a string that will shown inside the button (ex: Add New Job).
   */
  btnText: PropTypes.string.isRequired,
  /**
   * btnStyle is a string that will set the variant of the button based on material-ui v3 (ex: contained).
   * (See the variant prop in: https://v3.material-ui.com/api/button/).
   */
  btnStyle: PropTypes.string.isRequired,
  /**
   * size is a string that will set the size of the button based on material-ui v3 (ex: small).
   * (See the size prop in: https://v3.material-ui.com/api/button/).
   */
  size: PropTypes.string.isRequired,
  /**
   * color is a string that will set the color of the button based on material-ui v3 (ex: primary).
   * (See the color prop in: https://v3.material-ui.com/api/button/).
   */
  color: PropTypes.string,
  /**
   * icon is an icon object based on material-ui icons.
   * (See the SVG Icons part in: https://v3.material-ui.com/style/icons/).
   *
   * Example:
   * import AddIcon from '@material-ui/icons/Add'
   */
  icon: PropTypes.object,
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired,
  /**
   * onClick is a function that will run when the button is clicked
   */
  onClick: PropTypes.func.isRequired
};

export default withStyles(styles)(Buttons);
