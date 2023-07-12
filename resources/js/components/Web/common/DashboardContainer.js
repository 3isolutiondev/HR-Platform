import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { drawerWidth } from '../config/web'

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }
})

/**
 * Component act as a container to wrap the component defined in the routes.js. Currently being used yg NormalRoute.js and PermissionRoute.js.
 *
 * Permission: -
 *
 * @component
 * @name DashboardContainer
 * @category Common
 * @subcategory Container
 * @example
 * return (
 *  <DashboardContainer>
 *    <Component {...props} />
 *  </DashboardContainer>
 * )
 *
 */
class DashboardContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { classes, openSidebar } = this.props

    return(
      <main
          className={classNames(classes.content, {
            [classes.contentShift]: openSidebar,
          })}
        >
        {this.props.children}
      </main>
    )
  }
}

DashboardContainer.propTypes = {
  /**
   * openSidebar is a boolean value to show or hide left menu navigation
   */
  openSidebar: PropTypes.bool.isRequired,
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = state => ({
  openSidebar: state.web.openSidebar
})

export default withStyles(styles)(connect(mapStateToProps)(DashboardContainer))
