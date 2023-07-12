import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Search from '@material-ui/icons/Search';
import isEmpty from '../../validations/common/isEmpty';

const SearchField = ({
  id, label, name, margin, keyword, placeholder, onKeywordChange, value, options,
  loadingText, searchLoading, onSelect, onDelete, optionSelectedProperty, notFoundText,
  classes, required, error, isImmperProperty, secondProperty, thirdProperty, profileProperty, requestContractProperty
}) => (
  <div style={{ position: 'relative' }}>
    <TextField
      id={id}
      label={label}
      name={name}
      margin={margin}
      value={keyword}
      placeholder={!isEmpty(value) && isEmpty(keyword) ? '' : placeholder}
      fullWidth
      onChange={onKeywordChange}
      required={required}
      error={!isEmpty(error)}
      helperText={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton style={{ padding: 4 }}>
              <Search />
            </IconButton>
          </InputAdornment>
        ),
        startAdornment: (
          <InputAdornment position="start" className={classes.chip}>
            {!isEmpty(value) && (
              <Chip
                label={value}
                color="primary"
                onDelete={() => onDelete()}
              />
            )}
          </InputAdornment>
        )
      }}
    />
    {searchLoading && (
      <Paper elevation={0} className={!isEmpty(error) ? classname(classes.paper, classes.fixMarginTop) : classes.paper}>
        <Typography component="div" variant="body1" color="primary" className={classes.textPadding}>
          {loadingText} <span><CircularProgress color="primary" size={20} thickness={5} style={{ marginLeft: 8, display: 'inline-block', verticalAlign: 'middle' }} /></span>
        </Typography>
      </Paper>
    )}
    {!searchLoading && !isEmpty(keyword) && isEmpty(options) && (
      <Paper elevation={0} className={!isEmpty(error) ? classname(classes.paper, classes.fixMarginTop) : classes.paper}>
        <Typography variant="body1" className={classes.textPadding}>{notFoundText}</Typography>
      </Paper>
    )}
    {!searchLoading && !isEmpty(keyword) && !isEmpty(options) && (
      <Paper elevation={0} className={!isEmpty(error) ? classname(classes.paper, classes.fixMarginTop) : classes.paper}>
        <List>
          {options.map((item, index) => (
            name == 'user' ?
              <ListItem key={`line_manager-${index}`} button onClick={() => onSelect(item)} disabled={`${item[isImmperProperty]}` == 1 || `${item['profile']['interview_request_contract'].length}` > 0 ? true : false} >
                {`${item[isImmperProperty]}` == 0  ? 
                <ListItemText>{`${ item[profileProperty][requestContractProperty].length > 0 ? item[thirdProperty] : item[optionSelectedProperty]}`}</ListItemText>
                : 
                  <ListItemText>{`${item[secondProperty]}`}</ListItemText>
                }
              
              </ListItem>
            :
              <ListItem key={`line_manager-${index}`} button onClick={() => onSelect(item)}>
                <ListItemText>{`${item[optionSelectedProperty]}`}</ListItemText>
              </ListItem>
          ))}
        </List>
      </Paper>
    )}
  </div>
)

SearchField.defaultProps = {
  margin: 'normal',
  placeholder: 'Search',
  options: [],
  loadingText: 'Loading',
  searchLoading: false,
  notFoundText: 'Sorry, data not found',
  required: false,
  error: '',
  isImmperProperty: false,
  secondProperty: '',
  thirdProperty: '',
  profileProperty: '',
  requestContractProperty: ''
}

SearchField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  keyword: PropTypes.string,
  placeholder: PropTypes.string,
  onKeywordChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  loadingText: PropTypes.string.isRequired,
  searchLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  optionSelectedProperty: PropTypes.string.isRequired,
  notFoundText: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  chip: { marginTop: theme.spacing.unit, marginBottom: theme.spacing.unit / 2, height: theme.spacing.unit * 4 },
  paper: {position: 'absolute', width: '100%', zIndex: 99},
  textPadding: { padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`},
  fixMarginTop: { marginTop: -20 }
})

export default withStyles(styles)(SearchField)
