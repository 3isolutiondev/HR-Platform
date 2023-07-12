import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import Place from '@material-ui/icons/Place';
// import CalendarToday from '@material-ui/icons/CalendarToday';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars } from '@fortawesome/free-solid-svg-icons/faMars';
import { faVenus } from '@fortawesome/free-solid-svg-icons/faVenus';
// import { faRing } from '@fortawesome/free-solid-svg-icons/faRing';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faSkype } from '@fortawesome/free-brands-svg-icons/faSkype';
// import moment from 'moment';
import ReactCountryFlag from 'react-country-flag';
import IconButton from '@material-ui/core/IconButton';
import { lighterGrey } from '../../config/colors';
import { getBio } from '../../redux/actions/profile/bioActions';
import BioForm from './bio/BioForm';
import isEmpty from '../../validations/common/isEmpty';
import DropDownListMenu from './DropDownListMenu';

// import BioSkeleton from './Skeleton/BioSkeleton';

class Bio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
		this.handleEdit = this.handleEdit.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount() {
		this.props.getBio(this.props.profileID);
	}
	handleEdit() {
		this.setState({ open: true });
	}
	handleClose() {
		this.setState({ open: false });
	}

	render() {
		const { classes, editable, width } = this.props;
		const { open } = this.state;
		const {
			photo,
			full_name,
			// permanent_city,
			// permanent_country,
			// place_of_birth,
			// birth_date,
			gender,
			// marital_status,
			country_residence,
			present_nationalities,
			linkedin_url,
			// become_roster,
			skype
		} = this.props.bio;

		const FlagContainer = (props) => <div className={classes.countryAvatar}>{props.children}</div>;
		const flag = { width: '32px', height: '32px', backgroundSize: '44px 44px' };

		return (
			<div>
				{/* <BioSkeleton classes={classes} /> */}
				<Card className={classes.card}>
					<div className={classes.avatarContainer}>
						<Avatar src={photo} className={classes.avatar} alt={full_name} />
					</div>
					<div className={classes.details}>
						<CardContent>
							<Grid container className={classes.addBorderBottom}>
								<Grid item xs={12} sm={12} md={8} lg={9} xl={10}>
									<Typography
										variant="h4"
										className={
											width == 'sm' || width == 'xs' ? (
												classname(
													classes.addMarginBottom,
													classes.capitalize,
													classes.centerText
												)
											) : (
												classname(classes.addMarginBottom, classes.capitalize)
											)
										}
									>
										{full_name}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
									<div className={classes.editNViewSection}>
										{editable && (
											<IconButton
												style={{ display: 'inline-block', marginLeft: '8px' }}
												onClick={this.handleEdit}
												className={classes.button}
												aria-label="Delete"
											>
												<Edit fontSize="small" className={classes.iconAdd} />
											</IconButton>
										)}
										{editable && <DropDownListMenu />}
									</div>
								</Grid>
								{/* {editable && (
									<Grid item lg={1} xs={1} sm={1} md={1} xl={1}>
										<IconButton
											onClick={this.handleEdit}
											className={classes.button}
											aria-label="Delete"
										>
											<Edit fontSize="small" className={classes.iconAdd} />
										</IconButton>
									</Grid>
								)} */}
							</Grid>
							<Grid container>
								<Grid item xs={12} md={6} lg={4} xl={3}>
									<Typography variant="subtitle1">Country of Residence :</Typography>
									<Typography variant="subtitle1" color="primary">
										<Place fontSize="small" className={classes.icon} />
										{country_residence.label}
									</Typography>
								</Grid>
								{/* <Grid item xs={12} md={6} lg={4} xl={3}>
									<Typography variant="subtitle1">Birthday :</Typography>
									<Typography variant="subtitle1" color="primary">
										<CalendarToday fontSize="small" className={classes.icon} />
										{place_of_birth}, {moment(birth_date).format('DD MMMM YYYY ')}({moment().diff(birth_date, 'years')}{' '}
										Years)
									</Typography>
								</Grid> */}
								<Grid item xs={12} md={6} lg={4} xl={3}>
									<Typography variant="subtitle1">Gender :</Typography>
									<Typography variant="subtitle1" color="primary">
										<div>
											{gender === 1 ? (
												<div>
													<FontAwesomeIcon icon={faMars} size="lg" className={classes.icon} />
													Male
												</div>
											) : (
												<div>
													<FontAwesomeIcon
														icon={faVenus}
														size="lg"
														className={classes.icon}
													/>
													Female
												</div>
											)}
										</div>
									</Typography>
								</Grid>
								{/* <Grid item xs={12} md={6} lg={4} xl={3}>
									<Typography variant="subtitle1">Marital Status :</Typography>
									<Typography variant="subtitle1" color="primary" className={classes.capitalize}>
										<FontAwesomeIcon icon={faRing} size="lg" className={classes.icon} />
										{marital_status}
									</Typography>
								</Grid> */}
								<Grid item xs={12} md={6} lg={4} xl={3}>
									<Typography variant="subtitle1">Linkedin :</Typography>
									<Typography variant="subtitle1" color="primary" className={classes.capitalize}>
										<FontAwesomeIcon
											icon={faLinkedin}
											size="lg"
											className={classname(classes.icon, classes.linkedin)}
										/>
										{!isEmpty(linkedin_url) ? (
											<a href={`${linkedin_url}`} className={classes.linkedinLink}>
												Visit Linkedin Profile
											</a>
										) : (
											<span className={classes.linkedinLink}>No Linkedin Profile</span>
										)}
									</Typography>
								</Grid>
								<Grid item xs={12} md={6} lg={4} xl={3}>
									<Typography variant="subtitle1">Skype :</Typography>
									<Typography
										variant="subtitle1"
										color="primary"
										className={classname(classes.capitalize, classes.skypeColor)}
									>
										<FontAwesomeIcon
											icon={faSkype}
											size="lg"
											className={classname(classes.icon, classes.skype, classes.skypeColor)}
										/>
										{!isEmpty(skype) ? skype : <span>No Skype</span>}
									</Typography>
								</Grid>
								{/* <Grid item xs={12} md={6} lg={6} xl={6}> */}
								<Grid item xs={12}>
									<Typography variant="subtitle1">Nationality (ies) :</Typography>
									{present_nationalities && (
										<div>
											{present_nationalities.map((country) => {
												return (
													<Tooltip key={country.value} title={country.label}>
														<Chip
															avatar={
																<FlagContainer>
																	<ReactCountryFlag
																		code={country.country_code}
																		svg
																		styleProps={flag}
																	/>
																</FlagContainer>
															}
															label={country.label}
															// onDelete={handleDelete}
															color="primary"
															className={classname(
																classes.addMarginRight,
																classes.capitalize,
																classes.label
															)}
														/>
													</Tooltip>
												);
											})}
										</div>
									)}
								</Grid>
							</Grid>
						</CardContent>
					</div>
				</Card>
				{editable && <BioForm open={open} handleClose={this.handleClose} profileID={this.props.profileID} />}
			</div>
		);
	}
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	bio: state.bio
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getBio
};
Bio.propTypes = {
	getBio: PropTypes.func.isRequired
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	addBorderBottom: {
		'border-bottom': '1px solid ' + lighterGrey,
		'padding-bottom': '.25em'
	},
	addMarginBottom: {
		'margin-bottom': '.25em'
	},
	addMarginRight: {
		'margin-right': '.25em'
	},
	avatar: {
		width: 200,
		height: 200,
		margin: '0 auto'
	},
	avatarContainer: {
		padding: '24px'
	},
	card: {
		display: 'flex',
		[theme.breakpoints.down('sm')]: {
			display: 'block'
		}
	},
	details: {
		display: 'flex',
		flexDirection: 'column',
		'flex-grow': 1
	},
	icon: {
		display: 'inline-block',
		'vertical-align': 'text-bottom',
		'margin-right': '.25em'
	},
	capitalize: {
		'text-transform': 'capitalize'
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50%'
	},
	floatRight: {
		float: 'right'
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#be2126'
		},
		'&:hover $iconAdd': {
			color: 'white'
		},
		top: -5
	},
	iconAdd: {
		color: '#be2126'
	},
	linkedin: {
		color: '#0e76a8',
		'font-size': '2.22em'
	},
	linkedinLink: {
		color: '#0e76a8',
		'line-height': '1.5',
		'vertical-align': '0.225em'
	},
	skype: {
		// color: '#00AFF0 !important',
		'font-size': '2em',
		'vertical-align': '-0.3em !important'
	},
	skypeColor: {
		color: '#00AFF0'
	},
	nested: {
		paddingLeft: theme.spacing.unit * 4
	},
	editNViewSection: {
		width: '238px',
		float: 'right',
		[theme.breakpoints.down('sm')]: {
			float: 'none',
			margin: '0 auto'
		},
		[theme.breakpoints.down('xs')]: {
			float: 'none',
			margin: '0 auto'
		}
	},
	centerText: {
		'text-align': 'center'
	},
	label: {
		maxWidth: '100%',
		'& > span': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inline !important'
		}
	}
});
export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Bio)));
