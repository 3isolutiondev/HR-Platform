/** import React, Prop Types, Classnames */
import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';

/** import third party library */
import moment from 'moment';
import ReactCountryFlag from 'react-country-flag';
import Skeleton from 'react-loading-skeleton';

/** import Material UI sryles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Place from '@material-ui/icons/Place';
import Edit from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Email from '@material-ui/icons/Email';
import Star from '@material-ui/icons/Grade';

/** import fontawesome icon */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars } from '@fortawesome/free-solid-svg-icons/faMars';
import { faVenus } from '@fortawesome/free-solid-svg-icons/faVenus';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faSkype } from '@fortawesome/free-brands-svg-icons/faSkype';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getBio } from '../../../redux/actions/profile/bioActions';

/** import logo, permission checker, configuration value and validation helper */
import { borderColor, blueIMMAP, primaryColor, white, lightText, star } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';
import mainLogo from '../../../../../../img/3islogo.png';
import { can } from '../../../permissions/can';

/** import other components needed for this component */
import BioForm from '../../profile/bio/BioForm';
import SectionChooser from './SectionChooser';
import AcceptedRoster from './Roster/AcceptedRoster';

/**
 * BasicBio is a component to show basic biodata in profile page.
 *
 * Biodata: Photo, Full Name, email, country of residence, gender, last login, last profile update,
 * nationalities, roster status, linkedin, skype.
 *
 * @name BasicBio
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class BasicBio extends React.Component {
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

	componentDidUpdate(prevProps) {
		if (
			this.props.profileID !== prevProps.profileID ||
			(this.props.rosterProcessID !== prevProps.rosterProcessID && this.props.profileID == prevProps.profileID)
		) {
			this.props.getBio(this.props.profileID);
		}
	}

  /**
   * handleEdit is a function to open edit data modal
   */
  handleEdit() {
    this.setState({ open: true });
	}

  /**
   * handleClose is a function to close edit data modal
   */
	handleClose() {
		this.setState({ open: false });
	}

	render() {
		const { classes, bio, editable, verified_roster_count, starArchiveData } = this.props;
		const { open } = this.state;
		let {
			photo,
			full_name,
			country_residence,
			gender,
			linkedin_url,
			skype,
			present_nationalities,
			verified_immaper,
			is_immaper,
			email,
			immap_email,
			updated_at,
			last_login_at
		} = bio;

		const FlagContainer = (props) => <div className={classes.countryAvatar}>{props.children}</div>;
		const flag = { width: '32px', height: '32px', backgroundSize: '44px 44px' };

		return (
			<Card className={classes.box}>
				<CardContent className={classes.alignCenter}>
					{editable && (
						<div className={classes.editIcon}>
							<IconButton
								style={{ display: 'inline-block', marginLeft: '8px' }}
								onClick={this.handleEdit}
								className={classes.button}
								aria-label="Delete"
							>
								<Edit fontSize="small" className={classes.iconAdd} />
							</IconButton>
						</div>
					)}
					<div className={classes.namePhoto}>
						{photo ? (
							<Avatar src={photo} className={classes.avatar} alt={full_name} />
						) : (
							<Skeleton circle={true} height={150} width={150} />
						)}
						{full_name ? (
							<Typography variant="h2" color="primary" className={classes.fullName}>
								{starArchiveData.starred_user === 'yes' && can('See Completed Profiles') && (<Star className={classes.star} />)} {full_name}
							</Typography>
						) : (
							<Skeleton />
						)}
						{email ? (
							<Link variant="subtitle1" className={classes.email} href={'mailto:' + email}>
								<Email fontSize="small" className={classes.iconEmail} /> {email}
							</Link>
						) : (
							<Skeleton />
						)}
            {country_residence.labels ?
              country_residence.labels == 'need-country-residence' ? (
                <Typography variant="subtitle1" color="primary" className={classes.label}>Kindly please fill your Country of Residence</Typography>
              ) : (
                <Typography variant="subtitle1" color="secondary" className={classes.label}>
                  <span className={classes.addMarginRight}>
                    <Place fontSize="small" className={classes.icon} />
                    {country_residence.label}
                  </span>
                  {(gender === 1 || gender === 0) && <span className={classes.addMarginRight}>|</span>}
                  {gender === 1 && (
                    <span>
                      <FontAwesomeIcon
                        icon={faMars}
                        size="lg"
                        className={classname(classes.icon, classes.faIcon)}
                      />
                      Male
                    </span>
                  )}
                  {gender === 0 && (
                    <span>
                      <FontAwesomeIcon
                        icon={faVenus}
                        size="lg"
                        className={classname(classes.icon, classes.faIcon)}
                      />
                      Female
                    </span>
                  )}
                </Typography>
						) : (
							<Skeleton />
						)}
						{!isEmpty(last_login_at) && (
							<Typography variant="subtitle2" color="secondary" className={classes.lastUpdate}>
								Last login : {moment(last_login_at).format('DD MMMM YYYY')}
							</Typography>
						)}
						{isEmpty(updated_at) ? (
							<Skeleton />
						) : (
							<Typography variant="subtitle2" color="secondary" className={classes.lastUpdate}>
								Last profile update : {moment(updated_at).format('DD MMMM YYYY')}
							</Typography>
						)}
						{editable && (
							<div>
								<SectionChooser />
							</div>
						)}
					</div>
					{(verified_immaper === 1 || verified_immaper === '1') &&
					(is_immaper === 1 || is_immaper === '1') && (
						<div className={classname(classes.namePhoto, classes.immaperBox)}>
							{immap_email ? (
								<Typography variant="h6" color="primary">
									<img src={mainLogo} alt="immap career" className={classes.imgLogo} /> iMMAPer
								</Typography>
							) : (
								<Skeleton />
							)}
							{immap_email ? (
								<Link variant="subtitle1" className={classes.email} href={'mailto:' + immap_email}>
									<Email fontSize="small" className={classes.iconEmail} /> {immap_email}
								</Link>
							) : (
								<Skeleton />
							)}
						</div>
					)}
					{verified_roster_count > 0 && (
						<div className={classname(classes.namePhoto, classes.rosterBox)}>
							<AcceptedRoster />
						</div>
					)}
					<div className={classes.namePhoto}>
						{present_nationalities ? (
							<div>
								<Typography color="secondary" variant="h6" className={classes.addMarginBottom}>
									Nationalities:
								</Typography>
								{present_nationalities.map((country) => {
									return (
										<Tooltip key={country.value} title={country.label}>
                      {!isEmpty(country.country_code) ? (
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
                          color="primary"
                          className={classname(
                            classes.chip,
                            classes.addMarginRight,
                            classes.capitalize,
                            classes.label
                          )}
                        />
                      ) : (<div></div>)}
										</Tooltip>
									);
								})}
							</div>
						) : (
							<Skeleton count={2} />
						)}
					</div>
					<div className={classes.otherBio}>
						<div className={classes.infoRow}>
							<Typography variant="subtitle1" color="secondary">
								<FontAwesomeIcon
									icon={faLinkedin}
									size="lg"
									className={classname(classes.icon, classes.linkedin)}
								/>
								{!isEmpty(linkedin_url) ? (
									<div className={classes.urlContainer}>
										<a href={`${linkedin_url}`} target="_blank" className={classes.linkedinLink}>
											{linkedin_url.length > 36 ? (
												linkedin_url.substring(0, 33) + '...'
											) : (
												linkedin_url
											)}
										</a>
									</div>
								) : (
									<div className={classes.urlContainer}>
										<span className={classes.linkedinLink}>No Linkedin Profile</span>
									</div>
								)}
							</Typography>
						</div>
						<div className={classes.infoRow}>
							<Typography variant="subtitle1" color="primary" className={classes.skypeColor}>
								<FontAwesomeIcon
									icon={faSkype}
									size="lg"
									className={classname(classes.icon, classes.skype, classes.skypeColor)}
								/>
								{!isEmpty(skype) ? (
									<div className={classes.urlContainer}>{skype}</div>
								) : (
									<div className={classes.urlContainer}>
										<span>No Skype</span>
									</div>
								)}
							</Typography>
						</div>
					</div>
				</CardContent>
				{editable && <BioForm open={open} handleClose={this.handleClose} profileID={this.props.profileID} />}
			</Card>
		);
	}
}

BasicBio.propTypes = {
  /**
   * getBio is a prop to call redux action to get basic bio data.
   */
	getBio: PropTypes.func.isRequired,
  /**
   * profileID is a prop containing profile id, if it's a number will show other people profile, otherwise it will show the logged in user profile.
   */
  profileID: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string // empty string
  ]),
  /**
   * rosterProcessID is a prop containing roster process id.
   */
  rosterProcessID: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([''])
  ]),
  /**
   * classes is an prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	bio: state.bio,
	rosterProcessID: state.profileRosterProcess.rosterProcessID,
	verified_roster_count: state.profileRosterProcess.verified_roster_count
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getBio
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	urlContainer: {
		width: 'calc(100% - 44px)',
		overflow: 'hidden',
		display: 'inline-block',
		verticalAlign: 'bottom'
	},
	capitalize: {
		'text-transform': 'capitalize'
	},
	alignCenter: {
		padding: '0 !important',
		position: 'relative'
	},
	namePhoto: {
		padding: theme.spacing.unit * 4,
		borderBottom: '1px solid ' + borderColor,
		textAlign: 'center'
	},
	avatar: {
		width: 150,
		height: 150,
		margin: '0 auto'
	},
	fullName: {
		marginTop: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit,
		fontWeight: 400,
		fontSize: '1.5rem'
	},
	icon: {
		display: 'inline-block',
		'vertical-align': 'text-bottom',
		'margin-right': '.15em'
	},
	otherBio: {
		paddingTop: theme.spacing.unit * 4,
		paddingBottom: theme.spacing.unit * 4,
		paddingLeft: theme.spacing.unit * 5,
		paddingRight: theme.spacing.unit * 5
	},
	infoRow: {
		marginBottom: '1.25em',
		'&:last-child': {
			marginBottom: 0
		}
	},
	linkedin: {
		color: '#0e76a8',
		'font-size': '2em',
		marginRight: '.5em'
	},
	linkedinLink: {
		color: '#0e76a8',
		'line-height': '1.5',
		'vertical-align': '0.225em'
	},
	skype: {
		'font-size': '2em',
		'vertical-align': '-0.3em !important',
		marginRight: '.5em'
	},
	skypeColor: {
		color: '#00AFF0'
	},
	gender: {
		fontSize: '2.22em',
		marginRight: '.5em'
	},
	addMarginRight: {
		marginRight: '.5em'
	},
	faIcon: {
		marginRight: '.25em'
	},
	label: {
		maxWidth: '100%',
		'& > span': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inline !important'
		}
	},
	chip: {
		backgroundColor: '#e6e7e8',
		color: '#4c4c4c'
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50%'
	},
	editIcon: {
		position: 'absolute',
		right: theme.spacing.unit / 2,
		top: theme.spacing.unit
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: primaryColor
		},
		'&:hover $iconAdd': {
			color: white
		},
		top: -5
	},
	iconAdd: {
		color: primaryColor
	},
	addMarginBottom: {
		marginBottom: '1em'
	},
	imgLogo: {
		display: 'inline-block',
		'vertical-align': 'middle',
		padding: '0.25em',
		height: '2.5em'
	},
	immaperBox: {
		padding: theme.spacing.unit * 2 + 'px ' + theme.spacing.unit * 4 + 'px'
	},
	email: {
		color: blueIMMAP,
		marginLeft: theme.spacing.unit / 2
	},
	iconEmail: {
		display: 'inline-block',
		verticalAlign: 'text-top',
		marginRight: theme.spacing.unit / 2
	},
	box: {
		marginBottom: theme.spacing.unit * 2
	},
	rosterBox: {
		paddingLeft: 0,
		paddingRight: 0,
		paddingTop: theme.spacing.unit * 3,
		paddingBottom: theme.spacing.unit * 3
	},
	lastUpdate: {
		fontStyle: 'italic',
		color: lightText,
		marginTop: theme.spacing.unit
	},
  star: { color: star, display: 'inline-flex', verticalAlign: 'bottom' }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BasicBio));
