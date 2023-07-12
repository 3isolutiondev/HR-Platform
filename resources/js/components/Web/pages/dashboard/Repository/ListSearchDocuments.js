import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import { getAPI, deleteAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

import Alert from '../../../common/Alert';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import FormControl from '@material-ui/core/FormControl';

import { primaryColor,
	primaryColorHover, white, red, redHover, purple,
	purpleHover } from '../../../config/colors';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import FileCopy from '@material-ui/icons/FileCopy';
import CloudDownload from '@material-ui/icons/CloudDownload';
import ShareIcon from '@material-ui/icons/Share';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import CircleBtn from '../../../common/CircleBtn';

import { getPDF, downloadDocument } from '../../../redux/actions/common/PDFViewerActions';
import PDFViewer from '../../../common/pdf-viewer/PDFViewer';

import ShareForm from './ShareForm';
import isEmpty from '../../../validations/common/isEmpty'

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
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	addMarginBottom: {
		'margin-bottom': '.5em'
	},
	noStyleInList: {
		'list-style-type': 'none !important'
	},
	primaryColor: {
		color: primaryColor
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
	pdf: {
		'background-color': primaryColor,
		color: white,
		'&:hover': {
			'background-color': primaryColorHover
		}
	},
	fontAwesome: {
		width: '1.1em !important'
	},
	red: {
		'background-color': red,
		color: white,
		'&:hover': {
			'background-color': redHover
		}
	},
	purple: {
		'background-color': purple,
		color: white,
		'&:hover': {
			'background-color': purpleHover
		}
	}
});

class ListSearchDocuments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			repo_category: [],
			documentID: '',
			parentid: '',
			deleteId: '',
      deleteName: '',
			openDialog: false,
			alertOpen: false,
			apiRepository: '/api/repository/'
		};

		this.handleClose = this.handleClose.bind(this);
		this.deleteDocument = this.deleteDocument.bind(this);
	}

	handleClose(aa) {
		this.setState({ openDialog: aa });
	}

	deleteDocument() {
		this.props
			.deleteAPI(this.state.apiRepository + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});

				this.setState({
					alertOpen: false
				});
        this.props.search('reload')
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	render() {
		const { classes, showShare, showEditCategory, showDeleteCategory } = this.props;

		return (
			<div>
				<List disablePadding>
					{this.props.repo_category.map((sheet, i) => {
						let docName =
							sheet.category_type == 2 ?
                '(HR, ' + sheet.full_category
								: sheet.category_type == 3 ?
                '(Security, ' + sheet.full_category
								: sheet.category_type == 4 ?
                '(Communications, ' + sheet.full_category
								: sheet.category_type == 5 ?
                '(IT, ' + sheet.full_category
                :'(Finance, ' + sheet.full_category;
						if (sheet.category_status == 0) {
							docName = docName + ' - Draft) - ' + sheet.name;
						} else {
							docName = docName + ') - ' + sheet.name;
						}

						if (sheet.status == 1) {
							docName = docName + ' - Draft';
						}

						return (
							<ListItem button key={sheet.id} style={{ paddingLeft: 40 }}>
                {' '}
								<FileCopy />
								<ListItemText key={sheet.id} primary={docName} />
								<ListItemSecondaryAction className={classes.btnGroup}>
                  {!isEmpty(sheet.media) ? (
                    sheet.media.mime_type === 'application/pdf' && (
                      <CircleBtn
                          color={classes.red}
                          size="small"
                          onClick={() => this.props.getPDF('/api/repository/pdf/'+sheet.id)}
                          icon={<FontAwesomeIcon icon={faFilePdf} size="lg" className={classes.fontAwesome} />}
                      />
                    )
                  ) : null}
                  <FormControl>
                    <CircleBtn
						onClick={() => this.props.downloadDocument('/api/repository/pdf/' + sheet.id)}
                        color={classes.red}
                        size="small"
                        icon={<CloudDownload />}
                      />
                  </FormControl>
                  {showShare &&
                    sheet.status == 2 &&
                    sheet.category_status == 1 && (
                      <CircleBtn
                        color={classes.red}
                        size="small"
                        icon={<ShareIcon />}
                        onClick={() => {
                          this.setState({
                            openDialog: true,
                            documentID: sheet.id
                          });
                        }}
                      />
                  )}
                  {showEditCategory && (
                    <CircleBtn
                      link={'/policy-repository/edit/' + sheet.id}
                      color={classes.purple}
                      size="small"
                      icon={<Edit />}
                    />
                  )}
                  {showDeleteCategory && (
                    <CircleBtn
                      color={classes.red}
                      size="small"
                      icon={<Delete />}
                      onClick={() => {
                        this.setState({
                          deleteId: sheet.id,
                          deleteName: sheet.name,
                          alertOpen: true
                        });
                      }}
                    />
                  )}
								</ListItemSecondaryAction>
							</ListItem>
						);
					})}
				</List>

				<PDFViewer />

				<ShareForm
					isOpen={this.state.openDialog}
					documentID={this.state.documentID}
					onClose={this.handleClose}
				/>

				<Alert
					isOpen={this.state.alertOpen}
					onClose={() => {
						this.setState({ alertOpen: false });
					}}
					onAgree={() => {
						this.deleteDocument();
					}}
					title="Delete Warning"
					text={`Are you sure to delete document ${this.state.deleteName}?`}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

ListSearchDocuments.defaultProps = {
  showShare: false,
  showEditCategory: false,
  showDeleteCategory: false
}

ListSearchDocuments.propTypes = {
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getPDF: PropTypes.func.isRequired,
  showShare: PropTypes.bool.isRequired,
  showEditCategory: PropTypes.bool.isRequired,
  showDeleteCategory: PropTypes.bool.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	deleteAPI,
	addFlashMessage,
	getPDF,
	downloadDocument
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  showShare: state.policy.showShare,
  showEditCategory: state.policy.showEditCategory,
  showDeleteCategory: state.policy.showDeleteCategory
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ListSearchDocuments));
