import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { getAPI, postAPI } from "../redux/actions/apiActions";
import { addFlashMessage } from "../redux/actions/webActions";
import { white } from "../config/colors";
import { acceptedDocFiles } from "../config/general";
import DropzoneFileField from "../common/formFields/DropzoneFileField";
import AuthLogo from "../common/AuthLogo";

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  verifiedBox: {
    marginTop: theme.spacing.unit * 9,
    display: "inline-block",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    width: "50%",
  },
  verifiedContainer: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: "100vh",
    width: "100vw",
  },
  loading: {
    "margin-left": theme.spacing.unit * 2,
    "margin-right": theme.spacing.unit * 2,
    color: white,
  },
});

class ReferenceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploaded: false,
      referenceId: props.computedMatch.params.reference_id,
      profileRosterId: props.computedMatch.params.profile_roster_id,
      job_user_id: props.computedMatch.params.job_user_id,
      loading: true,
      roster: '',
      applicant: ''
    };
  }

  componentDidMount() {
    let url = '';
    if (this.state.profileRosterId) {
    this.props.postAPI('/api/p11-verify-reference', {
      profile_roster_id: this.state.profileRosterId,
      reference_id: this.state.referenceId,
      code: new URLSearchParams(this.props.location.search).get("ref")
    }).then(res => {
      this.setState({loading: false, applicant: res.data.data.profile.user.full_name, roster: res.data.data.roster_process.name});
    }).catch(err => {
      window.location.assign('/');
    })
    } else {
      this.props.postAPI('/api/job-p11-verify-reference', {
        job_user_id: this.state.job_user_id,
        reference_id: this.state.referenceId,
        code: new URLSearchParams(this.props.location.search).get("ref")
      }).then(res => {
        this.setState({loading: false, applicant: res.data.data.user.full_name, job: res.data.data.job.title, profile_id: res.data.data.user.profile.id});
      }).catch(err => {
        window.location.assign('/');
      })
    }

  }

  render() {
    let { message, isLoading, showResend } = this.state;
    const { classes } = this.props;
    let additionalElements = {reference_history_id: this.state.referenceId, profile_roster_id: this.state.profileRosterId};
    if(this.state.job_user_id) additionalElements = {job_user_id: this.state.job_user_id, reference_history_id: this.state.referenceId, profile_id: this.state.profile_id};
    return (
      <main className={classes.verifiedContainer}>
        {(this.state.isUploaded || this.state.loading) && (
            <Paper className={classes.verifiedBox}>
                <Typography variant="h5">{this.state.loading ? "LOADING...": "Thank you for your participation, your file has been submitted"}</Typography>
                <br />
            </Paper>
        )}
        {!(this.state.isUploaded || this.state.loading) && (
          <div>
            <AuthLogo />
            <Typography variant="body1">Please upload your reference check for {this.state.applicant} as a candidate for {this.state.roster || this.state.job} member</Typography>
            <DropzoneFileField
                name="file1"
                label=""
                onUpload={(name, data) => {this.setState({isUploaded: true})}}
                onDelete={(name, apiUrl, data, deleteId) =>{}}
                collectionName={'reference_heck' + 'user_1'}
                apiURL={this.state.job_user_id ? '/api/job-p11-update-reference-file' : '/api/p11-update-reference-file'}
                deleteAPIURL={'/api/files/delete'}
                isUpdate={false}
                filesLimit={1}
                acceptedFiles={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'officedocument.wordprocessingml.document']}
                gallery_files={[]}
                fullWidth={false}
                beforeUploadText={'You may only submit your file once, are you sure you want to continue?'}
                showBeforeUploadAlert={true}
                additionalElements={additionalElements}
            />
          </div>
        )}
      </main>
    );
  }
}

ReferenceForm.propTypes = {
  getAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  addFlashMessage,
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(ReferenceForm)
);
