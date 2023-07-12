import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import FolderIcon from '@material-ui/icons/Folder';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { getPDF, downloadDocument } from '../../../../redux/actions/common/PDFViewerActions';
import { getAPI } from '../../../../redux/actions/apiActions';
import {
  setSharePolicyId, setToggleShareDialog,
  setDeletePolicyId, setToggleDeletePolicyDialog,
  setEditCategory, setToggleEditCategoryDialog,
  setDeleteCategoryId, setToggleDeleteCategoryDialog,
  setReloadPolicyByCategory } from '../../../../redux/actions/policy/policyActions';
import { can } from '../../../../permissions/can';
import { red, redHover, white, primaryColor, purple, purpleHover } from '../../../../config/colors';
import isEmpty from '../../../../validations/common/isEmpty';
import CircleBtn from '../../../../common/CircleBtn';

class Branch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      documents: [],
      isLoading: false,
      firstLoad: true
    }

    this.expandCategory = this.expandCategory.bind(this);
    this.reloadDocument = this.reloadDocument.bind(this);
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.reloadPolicyByCategory !== this.props.reloadPolicyByCategory) && !isEmpty(this.props.reloadPolicyByCategory)) {
      if (this.props.reloadPolicyByCategory == this.props.category.id) {
        this.reloadDocument(this.props.reloadPolicyByCategory);
        this.props.setReloadPolicyByCategory();
      }
    }
  }

  expandCategory(id) {
    this.setState({ open : this.state.open ? false : true, isLoading: true, firstLoad: false }, () => {
      this.props.expandCategory(id);
      if (this.state.open) {
        this.reloadDocument(id);
      }
    })
  }

  reloadDocument(categoryId) {
    if (!isEmpty(categoryId) && !isEmpty(this.props.repoType)) {
      this.props.getAPI('/api/repository/' + categoryId + '/' + this.props.repoType)
      .then(res => {
        this.setState({ documents: res.data.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ documents: [], isLoading: false });
      })
    }
  }

  render() {
    const { documents, isLoading, firstLoad, open } = this.state;
    const { classes, category, showShare, showEditCategory, showDeleteCategory } = this.props;
    const downloadableMimeTypes = ['application/pdf' ]
    return (
      <div key={'paper-repocat-' +category.id} style={{ marginBottom: 8 }} >
        <Paper>
          <ListItem button key={'repocat-' +category.id}>
            <ListItemIcon style={{ marginRight: 8 }}><FolderIcon /></ListItemIcon>
            <ListItemText style={{ paddingLeft: 8 }} primary={category.status == 0 ? category.name + ' - Draft' : category.name}></ListItemText>

            {showEditCategory && (
              <ListItemIcon>
                <CreateIcon
                  onClick={async (e) => {
                    e.stopPropagation();
                    await this.props.setEditCategory(category);
                    this.props.setToggleEditCategoryDialog();
                  }}
                />
              </ListItemIcon>
            )}
            {showDeleteCategory && (
              <ListItemIcon>
                <DeleteIcon
                  onClick={async (e) => {
                    e.stopPropagation();
                    await this.props.setDeleteCategoryId(category.id, category.name)
                    this.props.setToggleDeleteCategoryDialog();
                  }}
                />
              </ListItemIcon>
            )}

            {open ? (
              <ExpandLessIcon
                onClick={(e) => {
                  e.stopPropagation();
                  this.expandCategory(category.id);
                }}
              />
            ) : (
              <ExpandMoreIcon
                onClick={(e) => {
                  e.stopPropagation();
                  this.expandCategory(category.id);
                }}
              />
            )}
          </ListItem>
        </Paper>
        <Collapse in={open} timeout="auto" unmountOnExit style={{ display: 'block', marginTop: isEmpty(documents) ? 0 : 8, marginLeft: 24}}>
          <List component="div" disablePadding key={category.id}>
            { open ? (
              (firstLoad || isLoading) && open ? (
                <Typography align="center" variant="subtitle1">Getting categories and documents...</Typography>
              ) : (
                isEmpty(documents) && isEmpty(category.children) ? (
                  <Typography align="center" variant="subtitle1">No documents were found in this category.</Typography>
                ) : (
                  documents.map(doc => {
                    const policyName = doc.status == 1 ? doc.name + ' - Draft' : doc.name
                    const canDownload = isEmpty(doc.media) || (!downloadableMimeTypes.includes(doc.media.mime_type) || doc.can_be_downloaded === 1)
  
                    
                    return (
                      <ListItem button key={doc.id}>
                        <ListItemIcon style={{ marginRight: 8 }}><FileCopyIcon /></ListItemIcon>
                        <ListItemText style={{ paddingLeft: 8 }} primary={policyName}></ListItemText>
                        <ListItemSecondaryAction className={classes.btnGroup}>
                          { !isEmpty(doc.media) ? (
                            doc.media.mime_type === "application/pdf" && (
                              <CircleBtn
                                color={classes.red}
                                size="small"
                                onClick={() => this.props.getPDF('/api/repository/pdf/' + doc.id, canDownload)}
                                icon={
                                  <FontAwesomeIcon
                                    icon={faFilePdf}
                                    size="lg"
                                    className={classes.fontAwesome}
                                  />
                                }
                              />
                            )
                          ) : null}
                          {canDownload && 
                            <CircleBtn onClick={() => this.props.downloadDocument('/api/repository/pdf/' + doc.id)} color={classes.red} size="small" icon={<CloudDownloadIcon />} />
                          }
                          {showShare && ((category.status == 1 || category.status == '1') && (doc.status == 2 || doc.status == '2')) && (
                            <CircleBtn color={classes.red} size="small" icon={<ShareIcon />} onClick={async () => {
                              await this.props.setSharePolicyId(doc.id)
                              this.props.setToggleShareDialog()
                            }}/>
                          )}
                          {showEditCategory && (
                            <CircleBtn link={'/policy-repository/edit/' + doc.id} color={classes.purple} size="small" icon={<EditIcon />} />
                          )}
                          {showDeleteCategory && (
                            <CircleBtn color={classes.red} size="small" icon={<DeleteIcon />} onClick={async () => {
                                await this.props.setDeletePolicyId(doc.id, policyName, category.id)
                                this.props.setToggleDeletePolicyDialog()
                              }}
                            />
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  })
                )
              )

            ) : null}
          </List>
        </Collapse>
      </div>
    )
  }
}

Branch.defaultProps = {
  showShare: false,
  showEditCategory: false,
  showDeleteCategory: false
}

Branch.propTypes = {
  getAPI: PropTypes.func.isRequired,
  getPDF: PropTypes.func.isRequired,
  expandCategory: PropTypes.func.isRequired,
  setSharePolicyId: PropTypes.func.isRequired,
  setToggleShareDialog: PropTypes.func.isRequired,
  setDeletePolicyId: PropTypes.func.isRequired,
  setToggleDeletePolicyDialog: PropTypes.func.isRequired,
  setReloadPolicyByCategory: PropTypes.func.isRequired,
  setEditCategory: PropTypes.func.isRequired,
  setToggleEditCategoryDialog: PropTypes.func.isRequired,
  setDeleteCategoryId: PropTypes.func.isRequired,
  setToggleDeleteCategoryDialog: PropTypes.func.isRequired,
  repoType: PropTypes.oneOf(['1','2','3','4','5',1,2,3,4,5]).isRequired,
  showShare: PropTypes.bool.isRequired,
  showEditCategory: PropTypes.bool.isRequired,
  showDeleteCategory: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  reloadPolicyByCategory: PropTypes.oneOfType([PropTypes.oneOf(['']), PropTypes.number])
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  getPDF,
  setSharePolicyId,
  setToggleShareDialog,
  setDeletePolicyId,
  setToggleDeletePolicyDialog,
  setReloadPolicyByCategory,
  setEditCategory,
  setToggleEditCategoryDialog,
  setDeleteCategoryId,
  setToggleDeleteCategoryDialog,
  downloadDocument
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  showShare: state.policy.showShare,
  showEditCategory: state.policy.showEditCategory,
  showDeleteCategory: state.policy.showDeleteCategory,
  reloadPolicyByCategory: state.policy.reloadPolicyByCategory
})

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	red: {
		'background-color': red,
		color: white,
		'&:hover': {
			'background-color': redHover
		}
	},
	btnGroup: {
		[theme.breakpoints.down('sm')]: {
			display: 'block',
			position: 'relative',
			textAlign: 'left',
			marginTop: theme.spacing.unit * -1,
			marginLeft: '30px',
			right: 0,
			top: 0,
			transform: 'none'
		}
	},
	fontAwesome: {
		width: '1.1em !important'
	},
  redCircle: {
    textDecoration: 'none',
    color: primaryColor,
    fontSize: '0.5rem',
    verticalAlign: 'top',
    display: 'inline-block'
  },
	purple: {
		'background-color': purple,
		color: white,
		'&:hover': {
			'background-color': purpleHover
		}
	}
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Branch))
