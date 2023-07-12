import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Search from '@material-ui/icons/Search';
import isEmpty from '../validations/common/isEmpty';

/**
 * Pagination is a component to show pagination in the website.
 *
 * Currently used in: Talent Pool page, Profile Completion Status page, Jobs page, Roster page, and My Applications page.
 *
 * @name Pagination
 * @component
 * @category Common
 *
 */
class Pagination extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      goto: ''
    }
  }

  componentDidMount() {
    if (!isEmpty(this.props.currentPage)) {
      this.setState({ goto: this.props.currentPage})
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPage !== this.props.currentPage) {
      this.setState({ goto: this.props.currentPage})
    }
  }

  render() {
    const { currentPage, lastPage, movePage, classes } = this.props

    let buttons = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        buttons.push(
          <Button
            color="primary"
            size="small"
            className={classes.paginationBtn}
            disabled={currentPage === i ? true : false}
            key={i}
            onClick={() => movePage(i)}
          >
            {i}
          </Button>
        );
      }
    }

    if (lastPage > 5) {
      let startPage = currentPage - 2 < 1 ? 1 : currentPage - 2
      let limitPage = currentPage + 2 > lastPage ? lastPage : currentPage + 2
      let loopData = {
        start: limitPage - startPage < 5 && startPage < 4 && currentPage < 5 ? startPage : limitPage - startPage < 5 && startPage > lastPage - 4 ? lastPage - 4 : startPage,
        last: limitPage - startPage < 5 && startPage < 4 && currentPage < 5 ? startPage + 4 : limitPage
      }
      for (let i = loopData.start; i <= loopData.last; i++) {
        buttons.push(
          <Button
            color="primary"
            size="small"
            className={classes.paginationBtn}
            disabled={currentPage === i ? true : false}
            key={i}
            onClick={() => movePage(i)}
          >
            {i}
          </Button>
        );
      }
    }

    return(
      <Grid container>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            size="small"
            className={classes.paginationBtn}
            disabled={currentPage === 1 ? true : false}
            key={'prev'}
            onClick={() => movePage(1)}
          >
            {'<<'}
          </Button>
          <Button
            color="primary"
            size="small"
            className={classes.paginationBtn}
            disabled={currentPage === 1 ? true : false}
            key={0}
            onClick={() => movePage(currentPage - 1)}
          >
            {'<'}
          </Button>
          {buttons}
          <Button
            color="primary"
            size="small"
            className={classes.paginationBtn}
            disabled={currentPage === lastPage ? true : false}
            key={lastPage + 1}
            onClick={() => movePage(currentPage + 1)}
          >
            {'>'}
          </Button>
          <Button
            color="primary"
            size="small"
            className={classes.paginationBtn}
            disabled={currentPage === lastPage ? true : false}
            key={'last'}
            onClick={() => movePage(lastPage)}
          >
            {'>>'}
          </Button>
        </Grid>
        {lastPage > 5 && (
          <Grid item xs={12} align="center">
            <form className={classes.selectWidth} onSubmit={(e) => { e.preventDefault(); if(!isEmpty(this.state.goto)) {movePage(this.state.goto)}}}>
              <TextField
                id="goto"
                label="Go to:"
                name="goto"
                value={this.state.goto}
                type="number"
                inputProps={{
                  min: 1,
                  max: lastPage
                }}
                placeholder="Go to:"
                onChange={(e) => { this.setState({ goto: e.target.value}) }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" style={{ padding: 4 }}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                fullWidth
              />
            </form>
          </Grid>
        )}
      </Grid>
    )
  }
}

Pagination.propTypes = {
  classes: PropTypes.object.isRequired,
  currentPage: PropTypes.number,
  lastPage: PropTypes.number,
  movePage: PropTypes.func.isRequired,
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paginationBtn: {
		'min-width': theme.spacing.unit * 4
	},
  selectWidth: { width: '120px' }
});

export default withStyles(styles)(Pagination);
