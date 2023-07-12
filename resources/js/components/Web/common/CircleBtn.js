import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from '../validations/common/isEmpty';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	btn: {
		margin: 4,
		color: 'white'
	}
});

/**
 * Circle shape button component that redirect user to other page or running a custom function when it's clicked.
 *
 * This button will act like a Link component from react-router-dom.
 *
 * Permission: -
 *
 * @component
 * @name CircleBtn
 * @category Common
 * @subcategory Button
 * @example
 * return (
 *  <CircleBtn
 *    link={"/dashboard/countries/" + data.id + "/edit"}
 *    color={classes.purple}
 *    size="small"
 *    icon={<Edit />}
 *  />
 * )
 * @example
 * return (
 *  <CircleBtn
 *    color={classes.red}
 *    size="small"
 *    icon={<Delete />}
 *    onClick={() => {
 *      this.setState({
 *        deleteId: data.id,
 *        name: data.name,
 *        alertOpen: true,
 *      });
 *  }}
 * />
 * )
 */
const CircleBtn = ({ link, size, color, icon, classes, onClick, openNewTab, disabled, tooltipText }) => {
	const TheLink = (props) => <Link to={link} {...props} />;

  let CircleBtnComponent = () => (
    <Fab size={size} className={classes.btn + ' ' + color} onClick={onClick} disabled={disabled}>
      {icon}
    </Fab>
  )

  if (link) {
    if (openNewTab) {
      CircleBtnComponent = () => (
        <Fab size={size} className={classes.btn + ' ' + color} href={link} target="_blank" disabled={disabled}>
          {icon}
        </Fab>
      )
    } else {
      CircleBtnComponent = () => (
        <Fab size={size} component={TheLink} className={classes.btn + ' ' + color} disabled={disabled}>
          {icon}
        </Fab>
      );
    }
  }

  if (!isEmpty(tooltipText)) {
    return (
      <Tooltip title={tooltipText}>
        <span>
          <CircleBtnComponent/>
        </span>
      </Tooltip>
    )
  }

  return <CircleBtnComponent/>


};

CircleBtn.defaultProps = {
  openNewTab: false,
  disabled: false,
  tooltipText: ''
}

CircleBtn.propTypes = {
  /**
   * link is a string containing the route url (example: /jobs).
   */
  link: PropTypes.string,
  /**
   * size is a string that will set the size of the button based on material-ui v3 (ex: small).
   * (See the size prop in: https://v3.material-ui.com/api/button/).
   */
	size: PropTypes.string.isRequired,
  /**
   * color is an object or string that containing style of the component. It's using withStyles features from material ui v3 from parent component.
   *
   * PropTypes.oneOfType([PropTypes.object, PropTypes.string]).
   *
   * Example:
   *  red: {
   *    "background-color": red,
   *    color: white,
   *    "&:hover": {
   *      color: secondaryColor,
   *    }
   *  }
   */
	color: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * icon is an icon object based on material-ui icons.
   * (See the SVG Icons part in: https://v3.material-ui.com/style/icons/).
   *
   * Example:
   * import AddIcon from '@material-ui/icons/Add'
   */
  icon: PropTypes.object.isRequired,
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired,
  /**
   * onClick is a function that will run when the button is clicked
   */
  onClick: PropTypes.func,
  /**
   * openNewTab is a boolean value to open the link in the new tab / in the same window
   */
  openNewTab: PropTypes.bool.isRequired,
  /**
   * disabled is a boolean value to disabled or enabled the button
   */
  disabled: PropTypes.bool.isRequired,
  /**
   * tooltipText is a text for the tooltip, if tooltipText is empty it will not show the
   */
   tooltipText: PropTypes.string.isRequired,
};

export default withStyles(styles)(CircleBtn);
