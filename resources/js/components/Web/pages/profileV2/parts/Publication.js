import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import CloudDownload from '@material-ui/icons/CloudDownload';
import PublicationForm from '../../p11/publications/PublicationForm';
import { getPublications, getPublicationsWithOutShow } from '../../../redux/actions/profile/publicationActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import Alert from '../../../common/Alert';
import { primaryColor, borderColor, lightText } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

class Publication extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: '',
			alertOpen: false,
			name: ''
		};

		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getPublications(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getPublications(this.props.profileID);
		}
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getPublicationsWithOutShow(this.props.profileID)
		);
	}
	checkBeforeRemove() {
		if (this.props.publication.publications_counts > 1) {
			this.setState({ alertOpen: true });
		}
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/profile-publication-destroy/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.props.profileLastUpdate();
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.child.clearState();
					this.dialogClose();
					// this.props.getPublications(this.props.profileID);
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	render() {
		const { classes, editable } = this.props;
		const { publications, publications_counts, show } = this.props.publication;
		const { openDialog, remove, dataId, alertOpen, name } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography color="primary" variant="subtitle1" className={classes.titleSection}>
								Publications
							</Typography>
							<div className={classes.divider} />
							{editable ? (
								<IconButton
									onClick={this.dialogOpen}
									className={classes.addButton}
									aria-label="Add"
									color="primary"
								>
									<Add fontSize="small" />
								</IconButton>
							) : null}
							{publications_counts == 0 || publications_counts < 1 ? (
								<Typography variant="body1">Sorry, no records found</Typography>
							) : (
								publications.map((publication) => {
									return (
										<div
											className={editable ? classes.record : classes.recordUneditable}
											key={'publication-' + publication.id}
										>
											{editable ? (
												<IconButton
													onClick={() =>
														this.dialogOpenEdit(publication.id, publication.title)}
													className={classes.button}
													aria-label="Edit"
												>
													<Edit fontSize="small" className={classes.iconEdit} />
												</IconButton>
											) : null}
											<Typography variant="subtitle1" className={classes.jobTitle}>
												{publication.title}
												<Typography
													variant="subtitle1"
													className={classes.durationDivider}
													component="p"
												>
													|
												</Typography>
												<Typography
													variant="subtitle1"
													className={classes.duration}
													component="p"
												>
													{moment(publication.year).format('YYYY')}
												</Typography>
												{!isEmpty(publication.publication_file) ? (
													<Tooltip title="Download Publication">
														<Fab
															size="small"
															variant="extended"
															color="primary"
															href={publication.publication_file.url}
															target="_blank"
															className={classes.download}
														>
															<CloudDownload className={classes.downloadIcon} />
															Publication
														</Fab>
													</Tooltip>
												) : null}
											</Typography>

											{!isEmpty(publication.url) ? (
												<Link href={publication.url} target="_blank" color="primary" variant="subtitle2">
													{publication.url}
												</Link>
											) : null}
										</div>
									);
								})
							)}
							{editable ? (
								<div>
									<PublicationForm
										isOpen={openDialog}
										recordId={dataId}
										onClose={this.dialogClose}
										remove={remove}
										updateList={this.dialogClose}
										getP11={this.dialogClose}
										title={remove ? 'Edit Publication' : 'Add Publication'}
										handleRemove={() => this.handleRemove()}
										onRef={(ref) => (this.child = ref)}
										getProfileLastUpdate={true}
									/>
									<Alert
										isOpen={alertOpen}
										onClose={() => {
											this.setState({ alertOpen: false });
										}}
										onAgree={() => {
											this.handleRemove();
										}}
										title="Delete Warning"
										text={'Are you sure to delete your publication : ' + name + ' ?'}
										closeText="Cancel"
										AgreeText="Yes"
									/>
								</div>
							) : null}
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getPublications,
	getPublicationsWithOutShow,
	addFlashMessage,
	deleteAPI,
	profileLastUpdate
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	publication: state.publication
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	box: {
		marginBottom: theme.spacing.unit * 2
	},
	card: {
		position: 'relative'
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
	},
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	record: {
		paddingBottom: theme.spacing.unit * 2,
		// borderBottom: '1px solid ' + borderColor,
		marginBottom: theme.spacing.unit * 2,
		position: 'relative',
		'&:hover $iconEdit': {
			color: primaryColor
		},
		'&:nth-last-child(2)': {
			marginBottom: 0,
			paddingBottom: 0
		}
	},
	recordUneditable: {
		paddingBottom: theme.spacing.unit * 2,
		// borderBottom: '1px solid ' + borderColor,
		marginBottom: theme.spacing.unit * 2,
		position: 'relative',
		'&:hover $iconEdit': {
			color: primaryColor
		},
		'&:nth-last-child(1)': {
			marginBottom: 0,
			paddingBottom: 0
		}
	},
	button: {
		position: 'absolute',
		right: theme.spacing.unit * -1,
		top: theme.spacing.unit * -1,
		'&:hover': {
			backgroundColor: primaryColor
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	jobTitle: {
		fontWeight: 700
	},
	lightText: {
		color: lightText
	},
	download: {
		width: theme.spacing.unit * 4 + 2,
		height: theme.spacing.unit * 4 + 2,
		minHeight: theme.spacing.unit * 4 + 2,
		border: '1px solid ' + primaryColor
	},
	downloadIcon: {
		fontSize: theme.spacing.unit * 3 - 2,
		marginRight: theme.spacing.unit
	},
	duration: {
		color: lightText,
		fontStyle: 'italic',
		display: 'inline-block',
		marginRight: theme.spacing.unit
		// marginBottom: theme.spacing.unit * 2 - theme.spacing.unit / 2
		// text
	},
	durationDivider: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		display: 'inline-block',
		color: lightText
		// fontS
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Publication));
