import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import CloudDownload from '@material-ui/icons/CloudDownload';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import PublicationForm from '../p11/publications/PublicationForm';
import { getPublications, getPublicationsWithOutShow } from '../../redux/actions/profile/publicationActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { deleteAPI } from '../../redux/actions/apiActions';
import Alert from '../../common/Alert';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addMarginBottom: {
		'margin-bottom': '.5em',
		'&:hover $iconEdit': {
			color: '#043C6E'
		}
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#043C6E'
		},
		'&:hover $iconAdd': {
			color: 'white'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	iconAdd: {
		color: '#043C6E'
	},
	break: {
		marginBottom: '20px'
	}
});

class Publications extends Component {
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
			.deleteAPI('/api/p11-publications/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.dialogClose();
					// this.props.getPublications(this.props.profileID);
					// this.child.clearState();
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
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Publications
									</Typography>
								</Grid>
								{editable ? (
									<Grid item xs={1} sm={4} md={3} lg={1} xl={1}>
										<IconButton
											onClick={this.dialogOpen}
											className={classes.button}
											aria-label="Delete"
										>
											<Add fontSize="small" className={classes.iconAdd} />
										</IconButton>
									</Grid>
								) : null}
							</Grid>
							<br />
							{publications_counts == 0 || publications_counts < 1 ? (
								<Typography variant="body1">Sorry, no matching records found</Typography>
							) : (
								publications.map((publication) => {
									return (
										<Grid
											container
											spacing={8}
											key={publication.id}
											className={classes.addMarginBottom}
										>
											<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
												<Typography variant="h6">{publication.title}</Typography>
											</Grid>
											{editable ? (
												<Grid item xs={1} sm={4} md={3} lg={1} xl={1}>
													<IconButton
														onClick={() =>
															this.dialogOpenEdit(publication.id, publication.title)}
														className={classes.button}
														aria-label="Delete"
													>
														<Edit fontSize="small" className={classes.iconEdit} />
													</IconButton>
												</Grid>
											) : null}
											<Grid item xs={12} sm={3}>
												<Typography variant="subtitle2">Title</Typography>
											</Grid>
											<Grid item xs={12} sm={9}>
												<Typography variant="body2">{publication.title}</Typography>
											</Grid>
											<Grid item xs={12} sm={3}>
												<Typography variant="subtitle2">Year</Typography>
											</Grid>
											<Grid item xs={12} sm={9}>
												<Typography variant="body2">
													{moment(publication.year).format('YYYY')}
												</Typography>
											</Grid>
											{publication.url ? (
												<Grid item xs={12} sm={3}>
													<Typography variant="subtitle2">Url</Typography>
												</Grid>
											) : null}
											{publication.url ? (
												<Grid item xs={12} sm={9}>
													<Typography variant="body2">{publication.url}</Typography>
												</Grid>
											) : null}
											{publication.publication_file ? (
												<Grid item xs={12} sm={3}>
													<Typography variant="subtitle2">File</Typography>
												</Grid>
											) : null}
											{publication.publication_file ? (
												<Grid item xs={12} sm={9}>
													<Typography variant="body2">
														<Button
															size="small"
															variant="contained"
															color="primary"
															href={publication.publication_file.url}
														>
															<CloudDownload className={classes.addSmallMarginRight} />{' '}
															Download
														</Button>{' '}
														{publication.publication_file.file_name}
													</Typography>
												</Grid>
											) : null}
										</Grid>
									);
								})
							)}
						</CardContent>
					</Card>
				) : null}
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
							handleRemove={() => this.checkBeforeRemove()}
							onRef={(ref) => (this.child = ref)}
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
							text={'Are you sure to delete your publication with title ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				) : null}
			</div>
		);
	}
}
Publications.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getPublications: PropTypes.func.isRequired,
	getPublicationsWithOutShow: PropTypes.func.isRequired
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
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getPublications,
	getPublicationsWithOutShow,
	addFlashMessage,
	deleteAPI
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Publications));
