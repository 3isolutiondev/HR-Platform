/** import React and Prop Types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import third party library */
import ReactCountryFlag from 'react-country-flag';

/** import Material UI styles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import PhoneIphone from '@material-ui/icons/PhoneIphone';
import Email from '@material-ui/icons/Email';

/** import React redux and it's actions */
import { connect } from 'react-redux';
import { getReferences } from '../../../redux/actions/profile/referencesActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { deleteAPI } from '../../../redux/actions/apiActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';

/** import other components needed for this component */
import ReferenceForm from '../../p11/references/ReferenceForm';
import Alert from '../../../common/Alert';

/** import configuration value and validation helper */
import { lightText, primaryColor, borderColor, blueIMMAP } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

/**
 * Reference is a component to show Reference data in profile page.
 *
 * @name Reference
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class Reference extends Component {
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
		this.dialogEdit = this.dialogEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
	}

	componentDidMount() {
		this.props.getReferences(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getReferences(this.props.profileID);
		}
	}

  /**
   * dialogOpen is a function to open Reference Form Modal in create mode
   */
	dialogOpen() {
		this.setState({ openDialog: true });
	}

  /**
   * dialogEdit is a function to open Reference Form Modal in edit mode
   */
	dialogEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

  /**
   * dialogClose is a function to close Reference Form Modal
   */
	dialogClose() {
		this.setState({ openDialog: false, dataId: '', remove: false }, () =>
			this.props.getReferences(this.props.profileID)
		);
	}

  /**
   * checkBeforeRemove is a function to show delete confirmation before deleting reference data
   */
	checkBeforeRemove() {
		if (this.props.references.references_counts > 1) {
			this.setState({ alertOpen: true });
		}
	}

  /**
   * handleRemove is a function to delete reference data
   */
	handleRemove() {
		this.props
			.deleteAPI('/api/p11-references/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false }, () => {
					this.props.profileLastUpdate();
					this.dialogClose();
					// this.props.getReferences(this.props.profileID);
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
		const { openDialog, remove, dataId, name, alertOpen } = this.state;
		const { references, references_counts, show } = this.props.references;
		const { classes, p11Countries, editable } = this.props;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
							References List
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
							{references_counts == 0 || references_counts < 1 ? (
								<Typography variant="body1">Sorry, no records found</Typography>
							) : (
								references.map((reference) => (
									<div
										className={editable ? classes.record : classes.recordUneditable}
										key={'reference-' + reference.id}
									>
										{editable ? (
											<IconButton
												onClick={() => this.dialogEdit(reference.id, reference.full_name)}
												className={classes.button}
												aria-label="Edit"
											>
												<Edit fontSize="small" className={classes.iconEdit} />
											</IconButton>
										) : null}
										<Typography variant="subtitle1" className={classes.jobTitle}>
											{reference.full_name + ' '}
											<Tooltip title={reference.country.name}>
												<div className={classes.countryAvatar}>
                          {!isEmpty(reference.country) ? !isEmpty(reference.country.country_code) && (
                            <ReactCountryFlag
                              code={reference.country.country_code}
                              svg
                              styleProps={flag}
                              className={classes.countryAvatar}
                            />
                          ) : null}
												</div>
											</Tooltip>
										</Typography>

										{!isEmpty(reference.email) ? (
											<Link
												variant="subtitle1"
												className={classes.email}
												href={'mailto:' + reference.email}
											>
												<Email fontSize="small" className={classes.icon} /> {reference.email}
											</Link>
										) : null}

										{!isEmpty(reference.phone) ? (
											<Typography className={classes.phone} variant="subtitle1">
												<PhoneIphone fontSize="small" className={classes.icon} />
												{reference.phone}
											</Typography>
										) : null}
										<div>
											{!isEmpty(reference.job_position) ? (
												<Typography variant="subtitle1" className={classes.jobPosition}>
													{reference.job_position + ', '}
												</Typography>
											) : null}
											{!isEmpty(reference.organization) ? (
												<Typography variant="subtitle1" className={classes.organization}>
													{reference.organization}
												</Typography>
											) : null}
										</div>
									</div>
								))
							)}
							{editable ? (
								<div>
									<ReferenceForm
										isOpen={openDialog}
										recordId={dataId}
										onClose={this.dialogClose}
										remove={remove}
										title={remove ? 'Edit Reference' : 'Add Reference'}
										handleRemove={() => this.checkBeforeRemove()}
										countries={p11Countries}
										updateList={this.dialogClose}
										getP11={this.dialogClose}
										resetData={openDialog}
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
										text={'Are you sure to delete your reference with name ' + name + ' ?'}
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

Reference.propTypes = {
  /**
   * getReferences is a prop to call redux action to get all references data related to it's profile.
   */
  getReferences: PropTypes.func.isRequired,
  /**
   * deleteAPI is a prop to call redux action to delete data based on url parameter.
   */
	deleteAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
	addFlashMessage: PropTypes.func.isRequired,
  /**
   * profileLastUpdate is a prop to call redux action to update last update timestamp.
   */
	profileLastUpdate: PropTypes.func.isRequired,
  /**
   * references is a prop containing all references data related to it's profile.
   */
  references: PropTypes.object.isRequired,
  /**
   * p11Countries is a prop containing list of countries.
   */
  p11Countries: PropTypes.array.isRequired,
  /**
   * profileID is a prop containing profile id, if it's a number will show other people profile, otherwise it will show the logged in user profile.
   */
  profileID: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string // empty string
  ]),
  /**
   * classes is an prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getReferences,
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
	references: state.references,
	p11Countries: state.options.p11Countries
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
	duration: {
		color: lightText,
		fontStyle: 'italic'
		// marginBottom: theme.spacing.unit * 2 - theme.spacing.unit / 2
		// text
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
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
		// float: 'right',
		position: 'absolute',
		right: theme.spacing.unit * -1,
		top: theme.spacing.unit * -1,
		'&:hover': {
			backgroundColor: '#be2126'
		},
		// '&:hover $iconAdd': {
		// 	color: 'white'
		// },
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
	email: {
		color: blueIMMAP
	},
	phone: {
		color: lightText
	},
	organization: {
		color: primaryColor,
		display: 'inline-block'
	},
	jobPosition: {
		color: primaryColor,
		display: 'inline-block',
		fontStyle: 'italic',
		marginRight: theme.spacing.unit / 2
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
	icon: {
		display: 'inline-block',
		verticalAlign: 'text-top',
		marginRight: theme.spacing.unit / 2
	}
});

const flag = {
	width: '32px',
	height: '32px',
	backgroundSize: '44px 44px'
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Reference));
