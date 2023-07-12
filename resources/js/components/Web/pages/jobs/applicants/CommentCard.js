import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { primaryColor, lightText } from '../../../config/colors';


const CommentCard = ({ comment, parentId, commentBy, commentId, depth, classes, currentUserId, commentById,
  onEditClick, onDeleteClick, onReplyClick, updatedAt, createdAt }) => {
  const readableDate = moment.utc(createdAt).local().format("DD/MM/YY hh:mm");
  return (
    <div key={`comm-id-${parentId}-${commentId}`} style={{
      marginLeft: depth * 24,
      marginBottom: 16,
      marginTop: parentId == 0 ? 4 : 0,
      paddingTop: parentId == 0 ? 16 : 0,
      borderTop: parentId == 0 ? `1px solid ${primaryColor}` :'none' }
    }>
      <Typography variant="subtitle1" style={{ fontWeight: 700, color: primaryColor }}>{commentBy} <span className={classes.readableDate}>{updatedAt !== createdAt && '(Edited) '}{readableDate}</span></Typography>
      <Typography variant="body2"> {comment}</Typography>
      {commentById !== null && (currentUserId !== commentById) && (
        <div>
          <button className={classes.actionBtn} onClick={onReplyClick}>Reply</button>
        </div>
      )}
      {commentById !== null && (currentUserId === commentById) && (
        <div>
          <button className={classes.actionBtn} onClick={onEditClick}>Edit</button>
          <button className={classes.actionBtn} onClick={onDeleteClick}>Delete</button>
        </div>
      )}
    </div>
  )
}

CommentCard.propTypes = {
  classes: PropTypes.object.isRequired,
  comment: PropTypes.string.isRequired,
  parentId: PropTypes.number.isRequired,
  commentBy: PropTypes.string.isRequired,
  commentById: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onReplyClick: PropTypes.func.isRequired,
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  actionBtn: {
    color: lightText,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginTop: 8,
    paddingLeft: 0,
    paddingRight: 8,
    '&:hover': { textDecoration: 'underline', color: primaryColor },
    '&:focus': { outline: 'none', textDecoration: 'underline', color: primaryColor}
  },
  readableDate: { color: lightText, fontWeight: 400, marginLeft: theme.spacing.unit, fontSize: '0.875rem'}
})

export default withStyles(styles)(CommentCard);
