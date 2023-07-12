/** import React, classnames and react redux */
import React, { Component } from 'react';
import classname from 'classnames';
import { connect } from 'react-redux';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

/** import custom components needed for this component */
import UserView from '../UserView';
import ProfileModal from '../../../common/ProfileModal';

/** import permission checker and configuration value */
import { can } from '../../../permissions/can';
import {
	red,
	blueIMMAP,
	white,
	primaryColorRed,
	primaryColorBlue,
	primaryColorGreen,
	primaryColor,
	recommendationColor,
	recommendationHoverColor,
	borderColor,
	lightText,
	primaryColorHover
} from '../../../config/colors';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	addMarginRight: {
		'margin-right': '0.5em'
	},
	addSmallMarginRight: {
		'margin-right': '0.25em'
	},
	addMarginBottom: {
		'margin-bottom': '0.5em'
	},
	cardMarginBottom: {
		'margin-bottom': '1em'
	},
	lightGrey: {
		borderBottom: '1px solid ' + borderColor

	},
	red: {
		'background-color': red,
		color: white
	},
	blueIMMAP: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {

			'background-color': '#005A9B'
		}
	},
	languageChip: {
		'background-color': blueIMMAP,
		color: white
	},
	green: {
		'background-color': recommendationColor,
		color: white,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
	},
	noTextDecoration: {
		'text-decoration': 'none',

		paddingRight: theme.spacing.unit
	},
	cardPadding: {
		padding: '8px 16px !important',
		[theme.breakpoints.down('sm')]: {
			display: 'block'
		}
	},
	jobTitle: {
		color: primaryColor,
		fontWeight: 700,
		[theme.breakpoints.down('sm')]: {
			marginBottom: theme.spacing.unit
		}
	},
	greenBtn: {
		background: primaryColor,
		color: white,
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		marginBottom: 0,
		'&:hover': {
			background: primaryColorHover
		},
		[theme.breakpoints.down('sm')]: {
			marginBottom: theme.spacing.unit
		}
	},
	cardAction: {
		verticalAlign: 'middle',
		margin: 0,
		[theme.breakpoints.down('sm')]: {
			display: 'block',
			flex: 'none'
		}
	},
	headerContent: {
		[theme.breakpoints.down('sm')]: {
			display: 'block',
			flex: 'none'
		}
	},
	noApplicant: {
		color: lightText,
	},
	separate: {
		borderBottom: '1px solid ' + borderColor,
		padding: '8px 16px !important',
		display:'flex',
  		justifyContent: "space-between"
	},
	textCenter: {
		textAlign: 'center'
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
	},
	chip: {
		background: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)',

		color: primaryColor,
		[theme.breakpoints.down('sm')]: {
			width: 'max-content',
			display: 'flex',
			margin: '0 auto ' + theme.spacing.unit + 'px auto'
		},
		[theme.breakpoints.up('md')]: {
			marginRight: theme.spacing.unit / 2
		}
	},
	fontAwesome: {
		[theme.breakpoints.down('sm')]: {
			display: 'block',

			margin: '0 auto ' + theme.spacing.unit + 'px auto'
		}
	},
	stepperContainer: {
		width: '100%',
		overflow: 'auto'
	  },
	stepper: {
		padding: theme.spacing.unit * 3 + 'px -2px'
	},
});

/**
 * step labels
 * @ignore
 * @type {array}
 * @default
 */
const steps = [
	'Step 1',
	'Step 2',
	'Step 3',
	'Step 4',
	'Step 5',
	'Step 6',
	'Step 7',
	'Step 8'
  ];

/**
 * UserCard is a component to show user data in Profile Status data
 *
 * @name UserCard
 * @component
 * @category Page
 * @subcategory Profile Status
 *
 */
class UserCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			age: 0,
			openProfile: false,
      openUser: false,
			changeStatusLoading: false,
			errors: {}
		};

		this.openCloseProfile = this.openCloseProfile.bind(this);
    this.openCloseUser = this.openCloseUser.bind(this);
	}

  /**
   * openCloseProfile is a function to open or close profile modal
   */
	openCloseProfile() {
		const { openProfile } = this.state;
		if (openProfile) {
			this.setState({ openProfile: false });
		} else {
			this.setState({ openProfile: true });
		}
	}

  /**
   * openCloseUser is a function to open or close user modal
   */
  openCloseUser() {
    this.setState({ openUser: this.state.openUser ? false : true, userId: this.props.user.id })
  }

	render() {
		const { classes, user } = this.props;
		const p11Status = JSON.parse(user.p11Status);
    let completedStepCount = 0;
    Object.values(p11Status).forEach(step => {
      if (step == 1) {
        completedStepCount = completedStepCount + 1;
      }
    });

    let name = user.full_name;
    if (can('Set as Admin') && user.archived_user === "yes") {
      name = `${name} [Archived]`;
    }

		return (
			<Card className={classname(classes.noRadius, classes.cardMarginBottom)}>
        <CardContent className={classes.cardPadding}>
          <Grid container spacing={8}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              classes={{ 'align-items-xs-center': 'text-align:space-between' }}
            >
              <Grid container spacing={8} style={{justifyContent:'space-between'}}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle1" component="label" color="primary">
                    Email
                  </Typography>
                  <Typography variant="body2" component="div">
                    { user.email }
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle1" component="label" color="primary">
                    Full Name
                  </Typography>
                  <Typography variant="body2" component="div">
                    { name }
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                  <Typography variant="subtitle1" component="label" color="primary">
                    Roles
                  </Typography>
                  <Typography variant="body2" component="div">
                  { user.role }
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                  <Typography variant="subtitle1" component="label" color="primary">
                    Status
                  </Typography>
                  <Typography variant="body2" component="div">
                    { user.status }
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                  <Typography variant="subtitle1" component="label" color="primary">
                    Registration Date
                  </Typography>
                  <Typography variant="body2" component="div">
                    { new Date(user.registrationDate).toLocaleDateString() }
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={10}>
                  <div style={{ overflow: 'auto' }}>
                    <Stepper activeStep={0} alternativeLabel nonLinear className={classes.stepper}>
                      {steps.map((label, index) => {
                        const props = {};
                        return (
                          <Step key={label} {...props}>
                            <StepButton
                              completed={p11Status['form' + (index + 1)] == 1}
                            >
                            {label}
                            </StepButton>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} classes={classes.btnContainer}>
                  <Button
                    size="small"
                    style={{ marginTop: '20px' }}
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={user.p11Completed == 1 ? () => this.openCloseProfile() : () => this.openCloseUser()}
                    className={classes.addSmallMarginRight}
                  >
                    <RemoveRedEye
                      fontSize="small"
                      className={classes.addSmallMarginRight}
                    />{' '}
                    View Profile
                  </Button>
                </Grid>
                <ProfileModal
                  isOpen={this.state.openProfile}
                  profileId={user.profile_id}
                  onClose={this.openCloseProfile}
                />
              </Grid>
            </Grid>
            <Dialog open={this.state.openUser} onClose={this.openCloseUser} maxWidth="xl">
              <DialogContent>
                <UserView
                  match={{params: {id: this.props.user.id}}}
                  forModal={true}
                />
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="primary" onClick={this.openCloseUser}>Close</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </CardContent>
      </Card>
		)
	}
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	currentUser: state.auth.user
});

export default withStyles(styles)(connect(mapStateToProps, null)(UserCard));
