import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import ReactCountryFlag from 'react-country-flag';
import { borderColor, primaryColor, darkText, lightText, white } from '../../../config/colors';
import {
	getRelativeEmployed,
	getRelativeEmployedWithOutShow
} from '../../../redux/actions/profile/relativeInUnActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import RelativesEmployedByPublicInternationalOrgForm from '../../p11/relativesEmployedByPublicInternationalOrg/RelativesEmployedByPublicInternationalOrgForm';
import Alert from '../../../common/Alert';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';

class RelativesEmployedByIMMAP extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: 0,
			alertOpen: false,
			name: ''
		};

		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogEdit = this.dialogEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.handleAllert = this.handleAllert.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getRelativeEmployed(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getRelativeEmployed(this.props.profileID);
		}
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}

	dialogEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '', name: '', remove: false }, () =>
			this.props.getRelativeEmployedWithOutShow(this.props.profileID)
		);
	}
	handleAllert() {
		this.setState({ alertOpen: true });
	}

	handleRemove() {
		this.props
			.deleteAPI('/api/p11-relatives-employed/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.props.profileLastUpdate();
					this.child.clearState();
					this.dialogClose();
					// this.props.getRelativeEmployed(this.props.profileID);
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
		const { relatives_employed, relatives_employed_counts, show } = this.props.relativeEmployed;
		const { openDialog, dataId, remove, alertOpen, name } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Your Relatives Employed by iMMAP
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
							{relatives_employed_counts == 0 || relatives_employed_counts < 1 ? (
								<Typography variant="body1">Sorry, no records found</Typography>
							) : (
								relatives_employed.map((relative) => {
									return (
										<div
											className={editable ? classes.record : classes.recordUneditable}
											key={'RelativeWorkWithiMMAP-' + relative.id}
										>
											{editable ? (
												<IconButton
													onClick={() => this.dialogEdit(relative.id, relative.full_name)}
													className={classes.button}
													aria-label="Edit"
												>
													<Edit fontSize="small" className={classes.iconEdit} />
												</IconButton>
											) : null}
											<Typography variant="subtitle1" className={classes.jobTitle}>
												{relative.full_name}{' '}
												<Tooltip title={relative.country.name}>
													<div className={classes.countryAvatar}>
														<ReactCountryFlag
															code={relative.country.country_code}
															svg
															styleProps={flag}
															className={classes.countryAvatar}
														/>
													</div>
												</Tooltip>
											</Typography>
											<Typography variant="subtitle2" className={classes.job}>
												{relative.job_title}
											</Typography>
											<Typography variant="subtitle2" className={classes.relation}>
												{relative.relationship}
											</Typography>
										</div>
									);
								})
							)}
							{editable ? (
								<div>
									<RelativesEmployedByPublicInternationalOrgForm
										isOpen={openDialog}
										recordId={dataId}
										title={remove ? 'Edit Relative' : 'Add Relative'}
										onClose={this.dialogClose}
										updateList={this.dialogClose}
										getP11={this.dialogClose}
										remove={remove}
										handleRemove={() => this.handleAllert()}
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
										text={'Are you sure to delete your relative with name: ' + name + ' ?'}
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
	getRelativeEmployed,
	getRelativeEmployedWithOutShow,
	deleteAPI,
	addFlashMessage,
	profileLastUpdate
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	p11Countries: state.options.p11Countries,
	relativeEmployed: state.relativeEmployed
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
	duration: {
		color: lightText,
		fontStyle: 'italic'
	},
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	record: {
		paddingBottom: theme.spacing.unit * 2,
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
			color: white
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	jobTitle: {
		fontWeight: 700
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50% !important',
		border: '1px solid ' + lightText,
		verticalAlign: 'middle',
		marginLeft: theme.spacing.unit,
		display: 'inline-block'
	},
	job: {
		color: primaryColor
	},
	relation: {
		fontStyle: 'italic',
		color: lightText
	}
});

const flag = {
	width: '32px',
	height: '32px',
	backgroundSize: '44px 44px'
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RelativesEmployedByIMMAP));
