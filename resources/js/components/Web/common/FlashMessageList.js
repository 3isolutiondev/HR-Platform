import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FlashMessage from './FlashMessage'
import { deleteFlashMessage } from '../redux/actions/webActions'

/**
 * FlashMessageList component for showing all notification messages.
 *
 * @name FlashMessageList
 * @component
 * @category Common
 * @example
 * return (
 *  <FlashMessageList />
 * )
 *
 */
class FlashMessageList extends Component {
  render() {
    const messages = this.props.messages.map(message =>
      <FlashMessage key={message.id} message={message} deleteFlashMessage={this.props.deleteFlashMessage}/>
    )
    return(
      <div id="flash-messages">
        {messages}
      </div>
    )
  }
}

FlashMessageList.propTypes = {
  /**
   * messages is an array of object containing notification message
   */
  messages: PropTypes.array.isRequired,
  /**
   * deleteFlashMessage is a function to delete notification message based on message id
   */
  deleteFlashMessage: PropTypes.func.isRequired
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = state => ({
  messages: state.web.flashMessage
})

export default connect(mapStateToProps, {deleteFlashMessage})(FlashMessageList)
