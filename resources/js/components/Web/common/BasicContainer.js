import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		marginLeft: 0
	}
});

/**
 * Component act as a container to wrap the component defined in the routes.js. Currently being used yg P11Route.js
 *
 * It can be used for other purpose.
 *
 * Permission: -
 *
 * @component
 * @name BasicContainer
 * @category Common
 * @subcategory Container
 * @example
 * return (
 *  <BasicContainer>
 *    <Component {...props} />
 *  </BasicContainer>
 * )
 *
 */
class BasicContainer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes } = this.props;

		return <main className={classNames(classes.content)}>{this.props.children}</main>;
	}
}

BasicContainer.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired,
  /**
   * children is Component that rendered inside this component an act like it's child
   */
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]).isRequired,
  /**
   * openSidebar is boolean value to show left navigation. In this case the value come from redux
   */
  openSidebar: PropTypes.bool.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	openSidebar: state.web.openSidebar
});

export default withStyles(styles)(connect(mapStateToProps)(BasicContainer));
