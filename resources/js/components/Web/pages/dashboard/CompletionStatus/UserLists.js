import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import UserCard from './UserCard';
import Pagination from '../../../common/Pagination';
import isEmpty from '../../../validations/common/isEmpty';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const UserLists = ({ Users, classes, loadingJob, paginate }) => {
  if(loadingJob) {
    return (
      <div style={{display:'flex', paddingLeft:'40%'}}>
        <Typography style={{color:'#043C6E'}}>
          Loading Awesome Users...
        </Typography>
        <CircularProgress thickness={5} size={22} className={classes.loading} />
      </div>
    )
  }

  if (!isEmpty(Users)) {
    if (!isEmpty(Users.data)) {
      return (
        <div>
          {Users.data.map((data, index) => {
              return (
                <UserCard
                  key={index}
                  id={'user-' + index}
                  user={data}
                />
              );
          })}
          {paginate && (
            <Pagination
              currentPage={Users.current_page}
              lastPage={Users.last_page}
              totalPage={Users.total}
              movePage={paginate}
              onClick={(e, offset) => paginate(offset)}
            />
          )}
        </div>

      )
    }
  }

  return (
    <Typography variant="h6" component="h6">
      Sorry, no profile found
    </Typography>
  )
}

UserLists.propTypes = {
  Users: PropTypes.object,
  classes: PropTypes.object.isRequired,
  loadingJob: PropTypes.bool.isRequired,
  paginate: PropTypes.func.isRequired
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit
  },
});

export default withStyles(styles)(UserLists);
