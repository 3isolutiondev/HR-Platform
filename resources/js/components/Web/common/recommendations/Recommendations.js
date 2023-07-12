import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Send from '@material-ui/icons/Send';
import { blueIMMAP, white, blueIMMAPHover } from '../../config/colors';
import { allCheckOnChange, openCloseProfile, checkChange } from '../../redux/actions/common/RecommendationActions';
import isEmpty from '../../validations/common/isEmpty';
import RecommendationCard from './RecommendationCard';
import ProfileModal from '../ProfileModal';
import Pagination from '../Pagination';

import Close from "@material-ui/icons/Close";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
	sendInvitation,
  } from "../../../Web/redux/actions/jobs/jobRecommendationActions";

class Recommendations extends Component {

	constructor(props) {
		super(props);

		this.state = {
		  isLoading: false,
		  open_confirmation: false,
		  new_step: '',
		  id: '',
		  profile_name: '',
		  selectedProfileId: null
		};

		this.sendInvitation = this.sendInvitation.bind(this);
		this.openConfirmation = this.openConfirmation.bind(this);
		this.closeConfirmation = this.closeConfirmation.bind(this);
  }

	openConfirmation() {
		this.setState({ open_confirmation: true });
	}

	closeConfirmation() {
		this.setState({ open_confirmation: false, new_step: '', id: '', selectedProfileId: null });
    }

	async sendInvitation(profile_ids, job_id) {
		 this.setState({ isLoading: true }, async () => {
			await this.props.sendInvitation(job_id, profile_ids);
			this.setState({ isLoading: false, open_confirmation: false, selectedProfileId: null });
		  });
	}

	render() {
const  {
	allCheck,
	allCheckOnChange,
	profileIds,
	classes,
	canSendInvitation,
	sendInvitation,
	checkChange,
	profiles,
	errors,
	openProfile,
	selected_profile_id,
	openCloseProfile,
	job_id,
	loadingData,
	title,
  current_page,
  last_page,
  changePage,
  firstApiCall
} = this.props
const {isLoading, selectedProfileId} = this.state;

	return (
		<Grid container spacing={8}>
			{canSendInvitation && (
				<Grid item xs={12}>
					<Grid container>
						<Grid item xs={12}>
              {profiles.length > 0 && !loadingData && (
                <div>
                  <Checkbox
                    checked={allCheck}
                    className={classes.checkBox}
                    color="primary"
                    onChange={() => allCheckOnChange()}
                  />
                  <Button
                    variant="contained"
                    className={classname(classes.sendInvitation, classes.blueIMMAP)}
                    onClick={this.openConfirmation}
                  >
                    Send Invitation <Send fontSize="small" className={classes.addSmallMarginLeft} /> {' '}
                    {isLoading && <CircularProgress className={classes.loading} size={22} thickness={5} />}
                  </Button>
                </div>
              )}
			<Dialog open={this.state.open_confirmation} onClose={this.closeConfirmation}>
				<DialogTitle>{'Confirmation'}</DialogTitle>
				<DialogContent>

					<DialogContentText id="alert-dialog-description">
							{`Are you sure you want to invite ${this.state.profile_name} to apply for ${title} position`}
					</DialogContentText>

				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="secondary" onClick={this.closeConfirmation}>
						<Close fontSize="small" /> Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						className={classes.blueIMMAP}
						onClick={() => this.sendInvitation(this.state.selectedProfileId || profileIds, job_id)}
						disabled={isLoading}
					>
              			Confirm
						{isLoading ? (
							<CircularProgress
							thickness={5}
							size={22}
							className={classes.loading}
							/>
						) : (
							<Send fontSize="small" className={classes.addMarginLeft} />
						)}
            </Button>
          </DialogActions>
				</Dialog>
							{!isEmpty(errors) && (
								<Grid item xs={12}>
									<Typography variant="subtitle1" color="error" className={classes.errorProfileIds}>
										{errors.profileIds}
									</Typography>
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>
			)}
			< Grid item xs={12}>
				{(loadingData || firstApiCall) ? (
          <CircularProgress
            color="primary"
            size={24}
            thickness={5}
            className={classes.loadingData}
            disableShrink
          />
        ) : (profiles.length > 0) ? (
            profiles.map((profile, index) => {
              return (
                <RecommendationCard
                  key={profile.id + '-' + index}
                  profileId={profile.id}
                  name={profile.user.full_name}
                  checkChange={() => {
                    checkChange(profile.id);
                  }}
                  isLoading = {selectedProfileId && selectedProfileId.includes(profile.id) && isLoading}
                  sendInvitation={() => {this.setState({selectedProfileId: [profile.id], open_confirmation: true, profile_name: profile.user.full_name })}}
                  canSendInvitation={canSendInvitation}
                />
              );
            })
          ) : (
            <Typography variant="subtitle1" color="primary" className={classes.noProfile}>No Awesome Profile Found!</Typography>
          )}
			</Grid>
      {(profiles.length > 0 && !loadingData && !isEmpty(current_page)) && (
        <Grid item xs={12}>
          <Pagination
            currentPage={current_page}
            lastPage={last_page}
            movePage={(page) => changePage(page)}
            onClick={(e, page) => changePage(page)}
          />
        </Grid>
      )}
			<ProfileModal
				isOpen={openProfile}
				profileId={selected_profile_id}
				onClose={openCloseProfile}
			/>
		</Grid >
	);
};
}

Recommendations.propTypes = {
  classes: PropTypes.object.isRequired,
  allCheck: PropTypes.bool.isRequired,
  profiles: PropTypes.array.isRequired,
  profileIds: PropTypes.array.isRequired,
  canSendInvitation: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadingData: PropTypes.bool.isRequired,
  firstApiCall: PropTypes.bool.isRequired,
  errors: PropTypes.object,
  openProfile: PropTypes.bool.isRequired,
  selected_profile_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  job_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,

  allCheckOnChange: PropTypes.func.isRequired,
	openCloseProfile: PropTypes.func.isRequired,
	checkChange: PropTypes.func.isRequired,
	sendInvitation: PropTypes.func.isRequired,

  current_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  last_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePage: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	allCheckOnChange,
	openCloseProfile,
	checkChange,
	sendInvitation
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	allCheck: state.recommendations.allCheck,
	profiles: state.recommendations.profiles,
	profileIds: state.recommendations.profileIds,
	canSendInvitation: state.recommendations.canSendInvitation,
	isLoading: state.recommendations.isLoading,
	loadingData: state.recommendations.loadingData,
	firstApiCall: state.recommendations.firstApiCall,
	errors: state.recommendations.errors,
	openProfile: state.recommendations.openProfile,
	selected_profile_id: state.recommendations.selected_profile_id,
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	checkBox: {
		'margin-left': '4px',
		'margin-bottom': '-12px',
		cursor: 'pointer',
		[theme.breakpoints.only('xs')]: {
			'margin-left': '-16px'
		}
	},
	sendInvitation: {
		'margin-left': '0px',
		'margin-bottom': '-12px'
	},
	blueIMMAP: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	loadingData: {
		margin: theme.spacing.unit * 2 + 'px auto',
		display: 'block'
	},
  noProfile: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center'
  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Recommendations));


