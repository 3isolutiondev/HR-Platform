import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import { getLanguage } from '../../redux/actions/profile/languageActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { deleteAPI } from '../../redux/actions/apiActions';
import LanguageForm from '../p11/languages/LanguageForm';
import Alert from '../../common/Alert';
import isEmpty from '../../validations/common/isEmpty';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	tableContainer: {
		width: '100%',
		overflowX: 'auto'
	},
	table: {
		minWidth: 500
	},
	alignCenter: {
		'text-align': 'center'
	},
	alignRight: {
		'text-align': 'right'
	},
	tableRow: {
		'&:hover $iconEdit': {
			color: '#be2126'
		}
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#be2126'
		},
		'&:hover $iconAdd': {
			color: 'white'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#be2126'
	},
	iconEdit: {
		color: 'transparent'
	},
	break: {
		marginBottom: '20px'
	}
});

class Languages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: '',
			alertOpen: false,
			name: '',
			isMotherTongue: 0
		};
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getLanguage(this.props.profileID);
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogOpenEdit(id, name, isMotherTongue) {
		this.setState({ dataId: id, name, isMotherTongue, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', isMotherTongue: 0, remove: false }, () =>
			this.props.getLanguage(this.props.profileID)
		);
	}
	checkBeforeRemove() {
		if (this.state.isMotherTongue === 1) {
			this.props.addFlashMessage({
				type: 'error',
				text: `Mother tongue can't remove`
			});
		} else {
			if (this.props.language.languages_counts > 1) {
				this.setState({ alertOpen: true });
			}
		}
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-languages/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false }, () => {
					this.dialogClose();
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
		let { languages, languages_counts, show } = this.props.language;
		let { classes, editable } = this.props;
		let { openDialog, remove, dataId, alertOpen, name } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Languages
									</Typography>
								</Grid>
								{(editable &&
								languages.length == languages_counts) ? (
									<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
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
							<div className={classes.tableContainer}>
								{languages_counts == 0 || languages_counts < 1 ? (
									<Typography variant="body1">Sorry, no matching records found</Typography>
								) : (
									<Table padding="none" className={classes.table}>
										<TableHead>
											<TableRow>
												<TableCell rowSpan={2} className={classes.alignCenter}>
													Languages
												</TableCell>
												<TableCell rowSpan={2} className={classes.alignCenter}>
													Language Abilities
												</TableCell>
												<TableCell rowSpan={2} className={classes.alignCenter}>
													Mother Tongue
												</TableCell>
												{editable ? (
													<TableCell rowSpan={2} className={classes.alignRight}>
														Actions
													</TableCell>
												) : null}
											</TableRow>
										</TableHead>
										<TableBody>
											{languages.map((language) => (
												<TableRow className={classes.tableRow} key={language.id}>
													<TableCell className={classes.alignCenter}>
														{!isEmpty(language.language.name) ? language.language.name : ''}
													</TableCell>
													<TableCell className={classes.alignCenter}>
														{!isEmpty(language.language_level) ? !isEmpty(
															language.language_level.name
														) ? (
															language.language_level.name
														) : (
															''
														) : (
															''
														)}
													</TableCell>
													<TableCell className={classes.alignCenter}>
														{language.is_mother_tongue === 1 ? (
															<Check fontSize="small" />
														) : (
															''
														)}
													</TableCell>
													{editable ? (
														<TableCell className={classes.alignCenter}>
															<IconButton
																className={classes.button}
																aria-label="Delete"
																onClick={() =>
																	this.dialogOpenEdit(
																		language.id,
																		language.language.name,
																		language.is_mother_tongue
																	)}
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</TableCell>
													) : null}
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</div>
						</CardContent>
					</Card>
				) : null}
				{editable ? (
					<div>
						<LanguageForm
							isOpen={openDialog}
							recordId={dataId}
							title={remove ? 'Edit Language' : 'Add Language'}
							languages={this.props.languages}
							onClose={this.dialogClose}
							updateList={this.dialogClose}
							getP11={this.dialogClose}
							handleRemove={() => this.checkBeforeRemove()}
							remove={remove}
							p11Languages={languages}
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
							text={'Are you sure to delete your language with name : ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
				) : null}
			</div>
		);
	}
}

Languages.propTypes = {
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getLanguage: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	language: state.language,
	languages: state.options.languages
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getLanguage,
	addFlashMessage,
	deleteAPI
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Languages));
