import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Save from '@material-ui/icons/Save';
import Search from '@material-ui/icons/Search';
import WysiwygField from '../../../common/formFields/WysiwygField';
import isEmpty from '../../../validations/common/isEmpty';
import { white } from '../../../config/colors';
import { pluck, arrowGenerator } from '../../../utils/helper';

class GroupForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      allUnGroupPermissions: [],
      unGroupPermissions: [],
      permissions: [],
      errors: {},
      keyword: '',
      isEdit: false,
      showLoading: false,
      apiURL: '/api/groups',
      redirectURL: '/dashboard/permissions/groups',
      arrowRef: null
    };
    this.timer = null;

    this.getData = this.getData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getUnGroupPermissions = this.getUnGroupPermissions.bind(this);
    this.checkChange = this.checkChange.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.unSelectPermission = this.unSelectPermission.bind(this);
    this.handleArrowRef = this.handleArrowRef.bind(this);
  }

  componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/groups/' + this.props.match.params.id,
				redirectURL: '/dashboard/groups/' + this.props.match.params.id + '/edit'
			});
		}
	}

  componentDidMount() {
    this.getUnGroupPermissions()
    if (this.state.isEdit) this.getData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword) {
      this.searchChange();
    }
  }

  getUnGroupPermissions() {
    this.props.getAPI('/api/permissions/ungroup')
    .then(res => this.setState({ unGroupPermissions: res.data.data, allUnGroupPermissions: res.data.data }))
    .catch(err => this.setState({ unGroupPermissions: [], allUnGroupPermissions: res.data.data }))
  }

  getData() {
    this.props.getAPI(this.state.apiURL)
    .then(res => {
      this.setState({
        name: res.data.data.name,
        description: isEmpty(res.data.data.description) ? '' : res.data.data.description,
        permissions: res.data.data.permissions }, () => this.isValid())
    })
    .catch(err => this.setState({ name: '', description: '', permissions: [] }))
  }

  isValid() {
    let errors = {}
    if (isEmpty(this.state.name)) errors.name = "Name is required"

    this.setState({ errors })

    return isEmpty(errors)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid())
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.isValid()) {
      const { name, description, isEdit, permissions } = this.state;
      let cleanDesc = description.toString().replace(/(<([^>]+)>)/ig, '');
      let groupData = {
        name,
        description: isEmpty(cleanDesc) ? null : description,
        permissions: pluck(permissions, 'id')
      }

      if (isEdit) groupData["_method"] = "PUT"

      this.setState({ showLoading: true }, () => {
        this.props.postAPI(this.state.apiURL, groupData)
        .then(res => {
          const { status, message } = res.data;
          this.setState({ showLoading: false }, () => {
            this.props.addFlashMessage({
              type: status,
              text: message
            });
            if (isEdit) {
              this.getData()
            } else {
              this.props.history.push(this.state.redirectURL);
            }
          })
        })
      })
    } else {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Validation failed, Please check the form'
      })
    }
  }

  checkChange(id, name, index) {
    let permissions = [...this.state.permissions];
    permissions.push({id, name, index});
    let allUnGroupPermissions = [...this.state.allUnGroupPermissions];
    allUnGroupPermissions = allUnGroupPermissions.filter(permission => permission.id !== id);
    let unGroupPermissions = [...this.state.unGroupPermissions];
    unGroupPermissions = unGroupPermissions.filter(permission => permission.id !== id);
    this.setState({ permissions, allUnGroupPermissions, unGroupPermissions });
  }

  searchChange() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let unGroupPermissions = [...this.state.allUnGroupPermissions].filter(permission => permission.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) !== -1);
      this.setState({unGroupPermissions })
    }, 500)
  }

  unSelectPermission(id, name, index) {
    let permissions = [...this.state.permissions];
    permissions = permissions.filter(permission => permission.id !== id);
    let allUnGroupPermissions = [...this.state.allUnGroupPermissions];
    allUnGroupPermissions.splice(index, 0, {id, name});
    let unGroupPermissions = [...this.state.unGroupPermissions];
    unGroupPermissions.splice(index, 0, {id, name});
    this.setState({ permissions, allUnGroupPermissions, unGroupPermissions });
  }

  handleArrowRef(node) {
    this.setState({ arrowRef: node })
  }

  render() {
    const { classes } = this.props
    const { name, description, errors, isEdit, showLoading, allUnGroupPermissions, unGroupPermissions, permissions, keyword } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Group : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Group'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Group : ' + name
							) : (
								APP_NAME + ' Dashboard > Add Group'
							)
						}
					/>
				</Helmet>
        <Paper className={classes.paper}>
					<Grid container spacing={16}>
            <Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Group : ' + name}
								{!isEdit && 'Add Group'}
							</Typography>
						</Grid>
            <Grid item xs={12}>
							<TextField
								id="name"
								label="Name"
								autoComplete="name"
								autoFocus
								margin="normal"
								required
								fullWidth
								name="name"
								value={name}
								onChange={this.onChange}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
							/>
						</Grid>
            <Grid item xs={12}>
              <WysiwygField
                id="description"
                label="Description"
                margin="dense"
								name="description"
								value={description}
								onChange={this.onChange}
								error={errors.description}
							/>
            </Grid>
            {!isEmpty(permissions) && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel component="legend">Selected Permission(s)</FormLabel>
                  <div style={{ marginTop: '16px' }}>
                    {permissions.map((permission, index) => (
                      <Chip
                        key={`sel-${index}`}
                        label={
                          <React.Fragment>
                            {!isEmpty(permission.description) ? (
                              <Tooltip
                                placement="top"
                                title={
                                  <React.Fragment>
                                    <div className={classes.description} dangerouslySetInnerHTML={{ __html: permission.description }}></div>
                                    <span className={classes.arrow} ref={this.handleArrowRef} />
                                  </React.Fragment>
                                }
                                classes={{ popper: classes.arrowPopper }}
                                PopperProps={{
                                  popperOptions: {
                                    modifiers: {
                                      arrow: {
                                        enabled: Boolean(this.state.arrowRef),
                                        element: this.state.arrowRef,
                                      },
                                    },
                                  },
                                }}
                              >
                                <Typography style={{ color: white }}>{permission.name}</Typography>
                              </Tooltip>
                            ) : (
                              permission.name
                            )}
                          </React.Fragment>
                        }
                        onDelete={() => this.unSelectPermission(permission.id, permission.name, permission.index)}
                        className={classes.chip}
                        color="primary"
                      />
                    ))}
                  </div>
                </FormControl>
              </Grid>
            )}
            {!isEmpty(allUnGroupPermissions) && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel component="legend">Un Group Permission(s)</FormLabel>
                  <FormGroup>
                    <Grid container>
                      <Grid item xs={12}>
                        <TextField
                          id="keyword"
                          label="Search Permission"
                          placeholder="Type your keyword"
                          margin="dense"
                          fullWidth
                          name="keyword"
                          value={keyword}
                          onChange={this.onChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Search />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      {isEmpty(unGroupPermissions) && (
                        <Grid item xs={12}>
                          <Typography>Sorry, can not found the permission</Typography>
                        </Grid>
                      )}
                      {!isEmpty(unGroupPermissions) && (
                        unGroupPermissions.map((permission, index) => {
                          return (
                            <Grid item xs={12} sm={6} lg={3} key={index}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={false}
                                    name="permissions"
                                    color="primary"
                                    onChange={() => this.checkChange(permission.id, permission.name, allUnGroupPermissions.findIndex(el => el.id === permission.id))}
                                    value={permission.name}
                                  />
                                }
                                label={
                                  <React.Fragment>
                                    {!isEmpty(permission.description) ? (
                                      <Tooltip
                                        placement="top"
                                        title={
                                          <React.Fragment>
                                            <div className={classes.description} dangerouslySetInnerHTML={{ __html: permission.description }}></div>
                                            <span className={classes.arrow} ref={this.handleArrowRef} />
                                          </React.Fragment>
                                        }
                                        classes={{ popper: classes.arrowPopper }}
                                        PopperProps={{
                                          popperOptions: {
                                            modifiers: {
                                              arrow: {
                                                enabled: Boolean(this.state.arrowRef),
                                                element: this.state.arrowRef,
                                              },
                                            },
                                          },
                                        }}
                                      >
                                        <Typography>{permission.name}</Typography>
                                      </Tooltip>
                                    ) : (
                                      <Typography>{permission.name}</Typography>
                                    )}
                                  </React.Fragment>
                                }
                              />
                            </Grid>
                          );
                        })
                      )}
                    </Grid>
                  </FormGroup>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<Save /> Save{' '}
								{showLoading && (
									<CircularProgress thickness={5} size={22} className={classes.loading} />
								)}
							</Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    )
  }
}

GroupForm.propTypes = {
  getAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI, postAPI, addFlashMessage
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	},
  chip: { marginBottom: theme.spacing.unit, marginRight: theme.spacing.unit, cursor: "pointer" },
  arrowPopper: arrowGenerator(theme.palette.grey[700]),
  arrow: {
    position: 'absolute',
    fontSize: 6,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    }
  },
  description: { fontSize: (theme.spacing.unit * 2) - 2 }
});

export default withStyles(styles)(connect('', mapDispatchToProps)(GroupForm));
