import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import CircularProgress from "@material-ui/core/CircularProgress";
import Close from "@material-ui/icons/Close";
import Send from "@material-ui/icons/Send";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SelectField from "../../common/formFields/SelectField";
import {
  getJobOpening,
  sendInvitation,
  getRosterProcess,
} from "../../redux/actions/allprofiles/AllProfilesActions";
import { blueIMMAP, blueIMMAPHover, white } from "../../config/colors";
import isEmpty from '../../validations/common/isEmpty';


class SingleInvite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invitation_type: "0",
      chosen_job: "",
      chosen_roster: "",
      isLoading: false,
      open_confirmation: false,
			new_step: '',
      id: '',
      job_title: '',
      roster_title: ''
    };

    this.sendInvitation = this.sendInvitation.bind(this);
    this.openConfirmation = this.openConfirmation.bind(this);
		this.closeConfirmation = this.closeConfirmation.bind(this);
  }

  componentDidMount() {
    this.props.getJobOpening();
    this.props.getRosterProcess();
  }

	openConfirmation() {
		this.setState({ open_confirmation: true });
	}

	closeConfirmation() {
		this.setState({ open_confirmation: false, new_step: '', id: '' });
  }

  sendInvitation() {
    const { invitation_type, chosen_job, chosen_roster } = this.state;
    const { profile_id } = this.props;

    if (invitation_type === "0") {
      this.setState({ isLoading: true }, async () => {
        await this.props.sendInvitation(
          profile_id,
          invitation_type,
          chosen_job
        );
        this.setState({ isLoading: false, open_confirmation: false });
      });
    }

    if (invitation_type === "1") {
      this.setState({ isLoading: true }, async () => {
        await this.props.sendInvitation(
          profile_id,
          invitation_type,
          chosen_roster
        );
        this.setState({ isLoading: false, open_confirmation: false  });
      });
    }
  }

  render() {
    const {
      isOpen,
      profile_name,
      job_openings,
      roster_process,
      onClose,
      classes,
    } = this.props;
    const { invitation_type, isLoading, job_title, roster_title, chosen_job, chosen_roster } = this.state;

    return (
      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={isOpen} onClose={onClose}
          style={{display:'flex',alignItems:'center',justifyContent:'center'}}
      >
        <div  className={classes.paper}>
            <Typography variant="h6" id="modal-title" className={classes.marginBottom}>
              Send Invitation for : {profile_name}
            </Typography>

            <Grid container spacing={16}>
             <Grid item xs={12}>
               <FormLabel>Invitation Type</FormLabel>
               <RadioGroup
                className={classes.displayBlock}
                value={invitation_type}
                onChange={(e) =>
                  this.setState({
                    invitation_type: e.target.value,
                  })
                }
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Job Invitation"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Roster Invitation"
                />
              </RadioGroup>
            </Grid>
            {invitation_type === "0" && (
              <Grid item xs={12}>
                <SelectField
                  label="Select Job Opening *"
                  margin="none"
                  options={job_openings}
                  placeholder="Choose Job Opening"
                  isMulti={false}
                  name="job"
                  fullWidth
                  onChange={(e) =>
                    this.setState({
                      chosen_job: e.value,
                      job_title: e.label
                    })
                  }
                  required
                  autoFocus
                  error={invitation_type === '0' && isEmpty(chosen_job) ? "Please select job opening" : ''}
                />
              </Grid>
            )}
            {invitation_type === "1" && (
              <Grid item xs={12}>
                <SelectField
                  label="Select Roster Process *"
                  margin="none"
                  options={roster_process ? roster_process.filter(r => r.under_sbp_program === 'yes') : []}
                  placeholder="Choose Roster Process"
                  isMulti={false}
                  name="roster_process"
                  fullWidth
                  onChange={(e) =>
                    this.setState({
                      chosen_roster: e.value,
                      roster_title: e.label
                    })
                  }
                  required
                  autoFocus
                  error={invitation_type === '1' && isEmpty(chosen_roster) ? "Please select roster process" : ''}
                />
              </Grid>
            )}
          </Grid>

        <Grid item xs={12} className={classes.buttons}>
            <Button variant="contained" color="secondary" onClick={onClose}>
             {/* // check the close  */}
              <Close fontSize="small" /> Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.blueIMMAP}
              onClick={this.openConfirmation}
              disabled={
                ((invitation_type === '0' && isEmpty(chosen_job)) ||
                (invitation_type === '1' && isEmpty(chosen_roster))) ? true : false
              }
            >
              Send
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
            <Dialog open={this.state.open_confirmation} onClose={this.closeConfirmation}>
					<DialogTitle>{'Confirmation'}</DialogTitle>
					<DialogContent>

						<DialogContentText id="alert-dialog-description">
              {invitation_type === '0' ? `Are you sure you want to invite ${profile_name} to apply for ${job_title} position` :
               invitation_type === '1' ? `Are you sure you want to invite ${profile_name} to apply for ${roster_title} position` : '' }
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
              onClick={this.sendInvitation}
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
        </Grid>
        </div>
      </Modal>
    );
  }
}

SingleInvite.propTypes = {
  classes: PropTypes.object.isRequired,
  getJobOpening: PropTypes.func.isRequired,
  getRosterProcess: PropTypes.func.isRequired,
  sendInvitation: PropTypes.func.isRequired,
  job_openings: PropTypes.array.isRequired,
  roster_process: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  // It can be number in string format
  profile_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  profile_name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getJobOpening,
  getRosterProcess,
  sendInvitation,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  job_openings: state.allProfiles.job_openings,
  roster_process: state.allProfiles.roster_process,
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  displayBlock: {
    display: "block",
  },
  blueIMMAP: {
    background: blueIMMAP,
    "&:hover": {
      background: blueIMMAPHover,
    },
    marginLeft: theme.spacing.unit * 1
  },
  addMarginLeft: {
    marginLeft: theme.spacing.unit,
  },
  dialogContent: {
    minHeight: theme.spacing.unit * 30,
  },
  loading: {
    color: white,
    marginLeft: theme.spacing.unit,
  },
  paper: {
    position: 'absolute',
    width: '90%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    margin:'auto'
  },
  marginBottom:{
    marginBottom: theme.spacing.unit * 2
  },
  buttons:{
    marginTop: theme.spacing.unit * 4,
    display:'flex',
    justifyContent:'flex-end'
  }
});


export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleInvite)
);
