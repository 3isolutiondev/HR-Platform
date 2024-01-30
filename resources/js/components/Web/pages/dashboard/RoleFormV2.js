import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { APP_NAME } from '../../config/general';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Save from '@material-ui/icons/Save';
import Search from '@material-ui/icons/Search';
import isEmpty from '../../validations/common/isEmpty';
import { borderColor, lightBg, red, white } from '../../config/colors';
import { pluck, arrowGenerator } from '../../utils/helper';
import { validate } from '../../validations/role';

class RoleFormV2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      permissions: [],
      groups: [],
      immap_offices: [],
      errors: {},
      isEdit: false,
      apiURL: '/api/roles',
      redirectURL: '/dashboard/roles',
      allImmapOffices: [],
      expand: {},
      unGroupPermissions: [],
      allUnGroupPermissions: [],
      keyword: '',
      checkAllGroup: {},
      showLoading: false,
      arrowRef: null
    }
    this.timer = null;

    this.isValid = this.isValid.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
		this.checkAll = this.checkAll.bind(this);
    this.checkChange = this.checkChange.bind(this);
    this.searchOnChange = this.searchOnChange.bind(this);
    this.expandGroup = this.expandGroup.bind(this);
    this.checkAllGroupChange = this.checkAllGroupChange.bind(this);
    this.getData = this.getData.bind(this);
    this.handleArrowRef = this.handleArrowRef.bind(this);
  }

  componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/roles/' + this.props.match.params.id,
				redirectURL: '/dashboard/roles/' + this.props.match.params.id + '/edit'
			});
		}
	}

  componentDidMount() {
    this.props.getAPI('/api/permissions/ungroup')
    .then(res => this.setState({ unGroupPermissions: res.data.data, allUnGroupPermissions: res.data.data }))
    .catch(err => this.setState({ unGroupPermissions: [], allUnGroupPermissions: res.data.data }))
    this.props.getAPI('/api/groups/with-permissions')
    .then(res => {
      let expand = {};
      res.data.data.map(group => expand[group.id] = true);
      expand.ungroup = true;
      this.setState({ groups: res.data.data, expand });
    })
    .catch(err => this.setState({ groups: [] }))
		this.props.getAPI('/api/immap-offices').then((res) => { this.setState({ allImmapOffices: res.data.data }); }).catch((err) => this.setState({ allImmapOffices: []}) );

		if (this.state.isEdit) {
      this.getData()
		}
	}

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword) {
      this.searchOnChange();
    }
  }

  getData() {
    this.props
      .getAPI(this.state.apiURL)
      .then((res) => {
        const { role } = res.data.data;

        this.setState({
          name: role.name,
          permissions: pluck(role.permissions, 'id'),
          immap_offices: pluck(role.immap_offices, 'id').map((id) => {
            return id.toString();
          })
        }, () => {
          if (!isEmpty(this.state.groups)) {
            let checkAllGroup = {...this.state.checkAllGroup};
            let groups = [...this.state.groups];
            groups.map(group => {
              let groupPermissionCount = group.permissions.length;
              let selectedGroupPermissionCount = group.permissions.filter(permission => this.state.permissions.includes(permission.id)).length;
              if ((groupPermissionCount === selectedGroupPermissionCount) && selectedGroupPermissionCount > 0) {
                checkAllGroup[group.id] = true;
              }
            })
            this.setState({ checkAllGroup }, () => this.isValid())
          }
          if (!isEmpty(this.state.allUnGroupPermissions)) {
            let groupPermissionCount = this.state.allUnGroupPermissions.length;
            let selectedGroupPermissionCount = this.state.allUnGroupPermissions.filter(permission => this.state.permissions.includes(permission.id)).length;
            if ((groupPermissionCount === selectedGroupPermissionCount) && selectedGroupPermissionCount > 0) {
              let checkAllGroup = {...this.state.checkAllGroup}
              checkAllGroup["ungroup"] = true;
              this.setState({ checkAllGroup }, () => this.isValid())
            }
          }
        });
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'There is an error while requesting role data'
        });
      });
  }

  isValid() {
    const { errors, isValid } = validate(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid())
  }

  onSubmit(e) {
    e.preventDefault();

		let roleData = {
			name: this.state.name,
			permissions: this.state.permissions,
			immap_offices: this.state.immap_offices
		};

		if (this.state.isEdit) {
			roleData._method = 'PUT';
		}

		if (this.isValid()) {
			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, roleData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							const { status, message } = res.data;
              this.setState({ showLoading: false }, () => {
                this.props.addFlashMessage({
                  type: status,
                  text: message
                });
                if (this.state.isEdit) {
                  this.getData()
                } else {
                  this.props.history.push(this.state.redirectURL);
                }
              })
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'There is an error while processing the request'
							});
						});
					});
			});
		} else {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Validation failed, Please check the form'
      })
    }
  }

  checkAll(allData, stateTarget, isChecked, dataKey) {
		let data = this.state[allData];

		if (isChecked) {
			this.setState({ [stateTarget]: pluck(data, dataKey).map(String) }, () => {
				this.isValid();
			});
		} else {
			this.setState({ [stateTarget]: [] }, () => {
				this.isValid();
			});
		}
	}

  checkChange(e) {
		let data = [...this.state[e.target.name]];
    let val = e.target.name == "permissions" ? parseInt(e.target.value) : e.target.value
		if (e.target.checked) {
			data.push(val);
		} else {
			let index = data.indexOf(val);
			if (index > -1) {
				data.splice(index, 1);
			}
		}

		this.setState({ [e.target.name]: data }, () => {
			this.isValid();
		});
	}

  searchOnChange() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let unGroupPermissions = [...this.state.allUnGroupPermissions].filter(permission => permission.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) !== -1);
      this.setState({ unGroupPermissions })
    }, 500)
  }

  expandGroup(e, groupId) {
    e.stopPropagation();
    let expand = {...this.state.expand}
    expand[groupId] = expand[groupId] ? false : true;
    this.setState({ expand });
  }

  checkAllGroupChange(e) {
    let permissions = [...this.state.permissions];
    let checkAllGroup = {...this.state.checkAllGroup};
    checkAllGroup[e.target.value] = e.target.checked;

    let groups = [...this.state.groups];
    let group = groups.find(group => group.id.toString() === e.target.value.toString());
    let groupPermissions = e.target.value === "ungroup" ? [...this.state.allUnGroupPermissions] : [...group.permissions];
    groupPermissions = pluck(groupPermissions, "id");

    if (checkAllGroup[e.target.value]) {
      if (!isEmpty(permissions)) {
        permissions = permissions.concat(groupPermissions.filter(groupPermission => !permissions.includes(groupPermission)));
      } else {
        permissions = groupPermissions;
      }
      let expand = {...this.state.expand}
      expand[e.target.value] = true
      this.setState({ permissions, expand, checkAllGroup }, () => this.isValid())
    } else {
      permissions = permissions.filter(permission => !groupPermissions.includes(permission));
      this.setState({ permissions, checkAllGroup }, () => this.isValid())
    }
  }

  handleArrowRef(node) {
    this.setState({ arrowRef: node })
  }

  render() {
    const { classes } = this.props
    const {
      name, groups, permissions, errors, isEdit, allImmapOffices, immap_offices,
      allUnGroupPermissions, unGroupPermissions, keyword, expand, checkAllGroup,
      showLoading
    } = this.state

    return (
      <form onSubmit={this.onSubmit}>
        <Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Role : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Role'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? APP_NAME + ' Dashboard > Edit Role : ' + name : APP_NAME + ' Dashboard > Add Role'
						}
					/>
				</Helmet>
        <Paper className={classes.paper}>
          <Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Role : ' + name}
								{!isEdit && 'Add Role'}
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
            {!isEmpty(groups) && (
              <Grid item xs={12}>
                <FormControl fullWidth error={!isEmpty(errors.permissions)}>
                  <FormLabel component="legend" style={{ marginBottom: 8 }}>Permissions</FormLabel>
                  <FormGroup>
                    <Paper style={{ padding: 8, borderColor: !isEmpty(errors.permissions) ? red : borderColor }}>
                    {groups.map((group, index) => (
                      <div key={`group-${index}`}>
                        <Paper style={{ marginBottom: 8 }}>
                          <Tooltip
                            placement="top"
                            title={
                              !isEmpty(group.description) ? (
                                <React.Fragment>
                                  <div className={classes.description} dangerouslySetInnerHTML={{ __html: group.description }}></div>
                                  <span className={classes.arrow} ref={this.handleArrowRef} />
                                </React.Fragment>
                              ) : (
                                ''
                              )
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
                            <ListItem button className={classes.group}>
                              <FormControlLabel
                                style={{ marginRight: 0 }}
                                control={
                                  <Checkbox
                                    checked={checkAllGroup[group.id] === true ? true : false}
                                    style={{ paddingTop: 0, paddingBottom: 0 }}
                                    name="checkAllGroup"
                                    color="primary"
                                    onChange={this.checkAllGroupChange}
                                    value={group.id.toString()}
                                  />
                                }
                              />
                              <ListItemText style={{ paddingLeft: 0 }} primary={
                                <React.Fragment>
                                  <Typography variant="body1">{group.name}</Typography>
                                </React.Fragment>
                              }
                              ></ListItemText>
                              {expand[group.id] ? (
                                <ExpandLessIcon
                                  onClick={(e) => this.expandGroup(e, group.id)}
                                />
                              ) : (
                                <ExpandMoreIcon
                                  onClick={(e) => this.expandGroup(e, group.id)}
                                />
                              )}
                            </ListItem>
                          </Tooltip>
                        </Paper>
                        {!isEmpty(group.permissions) && (
                          <Collapse in={expand[group.id]} timeout="auto">
                            <Grid container style={{ paddingLeft: 16, paddingRight: 16, marginBottom: 8 }}>
                              {group.permissions.map((permission) => (
                                <Grid item xs={12} sm={6} lg={3} key={`perm-${permission.id}`}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={permissions.indexOf(permission.id) > -1 ? true : false}
                                        name="permissions"
                                        color="primary"
                                        onChange={this.checkChange}
                                        value={permission.id.toString()}
                                      />
                                    }
                                    label={
                                      <React.Fragment>
                                        <Tooltip
                                          placement="top"
                                          title={
                                            !isEmpty(permission.description) ? (
                                              <React.Fragment>
                                                <div className={classes.description} dangerouslySetInnerHTML={{ __html: permission.description }}></div>
                                                <span className={classes.arrow} ref={this.handleArrowRef} />
                                              </React.Fragment>
                                            ) : ''
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
                                      </React.Fragment>
                                    }
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Collapse>
                        )}
                      </div>
                      ))}
                      {!isEmpty(allUnGroupPermissions) && (
                        <div>
                          <Paper>
                            <ListItem button className={classes.group}>
                              <FormControlLabel
                                style={{ marginRight: 0 }}
                                control={
                                  <Checkbox
                                    checked={checkAllGroup["ungroup"] === true ? true : false}
                                    style={{ paddingTop: 0, paddingBottom: 0 }}
                                    name="checkAllGroup"
                                    color="primary"
                                    onChange={this.checkAllGroupChange}
                                    value="ungroup"
                                  />
                                }
                              />
                              <ListItemText style={{ paddingLeft: 0 }} primary="Un Group Permission"></ListItemText>
                              {expand["ungroup"] ? (
                                <ExpandLessIcon
                                  onClick={(e) => this.expandGroup(e, "ungroup")}
                                />
                              ) : (
                                <ExpandMoreIcon
                                  onClick={(e) => this.expandGroup(e, "ungroup")}
                                />
                              )}
                            </ListItem>
                          </Paper>
                          {(!isEmpty(unGroupPermissions) || (isEmpty(unGroupPermissions) && !isEmpty(keyword))) && (
                            <Collapse in={expand["ungroup"]} timeout="auto">
                              <Grid container style={{ paddingLeft: 16, paddingRight: 16, marginBottom: 8 }}>
                                <Grid item xs={12}>
                                  <TextField
                                    id="keyword"
                                    label="Search Un Group Permission"
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
                                {unGroupPermissions.map((permission) => (
                                  <Grid item xs={12} sm={6} lg={3} key={`perm-${permission.id}`}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={permissions.indexOf(permission.id) > -1 ? true : false}
                                          name="permissions"
                                          color="primary"
                                          onChange={this.checkChange}
                                          value={permission.id.toString()}
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
                                ))}
                              </Grid>
                            </Collapse>
                          )}
                        </div>
                      )}
                    </Paper>
                  </FormGroup>
                  {!isEmpty(errors.permissions) && (
                    <FormHelperText>{errors.permissions}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}
						<Grid item xs={12}>
							<FormControl error={!isEmpty(errors.immap_offices)}>
								<FormLabel component="legend">3iSolution Offices</FormLabel>
								<FormGroup>
									<Grid container>
										<Grid item xs={12}>
											<FormControlLabel
												control={
													<Checkbox
														name="allImmapOffices"
														color="primary"
														onChange={(e) =>
															this.checkAll(
																'allImmapOffices',
																'immap_offices',
																e.target.checked,
																'id'
															)}
													/>
												}
												label="All 3iSolution Office"
											/>
										</Grid>
										{allImmapOffices.map((immap_office, index) => {
											return (
												<Grid item xs={12} sm={6} lg={3} key={index}>
													<FormControlLabel
														control={
															<Checkbox
																checked={
																	immap_offices.indexOf(immap_office.id.toString()) >
																	-1 ? (
																		true
																	) : (
																		false
																	)
																}
																name="immap_offices"
																color="primary"
																onChange={this.checkChange}
																value={immap_office.id.toString()}
															/>
														}
														label={immap_office.city + ' - ' + immap_office.country.name}
													/>
												</Grid>
											);
										})}
									</Grid>
								</FormGroup>
								{!isEmpty(errors.immap_offices) && (
									<FormHelperText>{errors.immap_offices}</FormHelperText>
								)}
							</FormControl>
						</Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
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

RoleFormV2.propTypes = {
  classes: PropTypes.object.isRequired,
  getAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
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
  group: { background: lightBg, '&:hover': { background: borderColor } },
  description: { fontSize: (theme.spacing.unit * 2) - 2 }
})

export default withStyles(styles)(connect('', mapDispatchToProps)(RoleFormV2))
