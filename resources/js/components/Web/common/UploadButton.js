import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownload from '@material-ui/icons/CloudDownload';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import isEmpty from '../validations/common/isEmpty';
import { serverErrorMessage, addFlashMessage } from '../redux/actions/webActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import FileDownload from 'js-file-download';
import { white } from '../config/colors';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	formControl: {
		margin: theme.spacing.unit * 2
	},

	paper: {
		position: 'absolute',
		width: theme.spacing.unit * 50,
		backgroundColor: '#ffffff',
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: 'none'
	},
	addMarginTop: {
		'margin-top': '1em'
	},
	cardContent: {
		padding: '8px',
		'&:last-child': {
			'padding-bottom': '8px'
		}
	},
	card: {
		overflow: 'visible'
	},
	right: {
		textAlign: 'right',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'left'
		}
	},
	minWidth: {
		minWidth: theme.spacing.unit * 50
	},
  downloadLoading: {
    color: white,
    marginLeft: theme.spacing.unit / 2,
    height: (theme.spacing.unit * 2) + 4,
    width: (theme.spacing.unit * 2) + 4
  }
});

class UploadButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			nameFIle: '',
			file: {},
			data: {
				media_id: null,
				file_name: '',
				user_interview_email: '',
				user_interview_id: null,
				user_interview_name: '',
				id: null
			},
      downloadLoading: false
		};
		this.showModal = this.showModal.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
    this.downloadScore = this.downloadScore.bind(this);
	}
	componentDidMount() {
		const { data, user_interview_files } = this.props;
		let find_user = user_interview_files.filter((element) => (element.user_interview_email == data.value || element.user_interview_email == data.email));

		let temp = {
			user_interview_email: !isEmpty(data.value) ? data.value : data.email,
			user_interview_id: data.id,
			user_interview_name: data.label,
			media_id: !isEmpty(find_user) ? find_user[0].media_id : null,
			file_name: !isEmpty(find_user) ? find_user[0].file_name : '',
			id: !isEmpty(find_user) ? find_user[0].id : null
		};
		this.setState({ data: temp });
	}

	componentDidUpdate(prevProps) {
		const prev_user_interview_files = JSON.stringify(prevProps.user_interview_files);
		const current_user_interview_files = JSON.stringify(this.props.user_interview_files);
		if (prev_user_interview_files != current_user_interview_files) {
			const { data, user_interview_files } = this.props;
      let find_user = user_interview_files.filter((element) => (element.user_interview_email == data.value || element.user_interview_email == data.email));
			let temp = {
				user_interview_email: !isEmpty(data.value) ? data.value : data.email,
				user_interview_id: data.id,
				user_interview_name: data.label,
				media_id: !isEmpty(find_user) ? find_user[0].media_id : null,
				file_name: !isEmpty(find_user) ? find_user[0].file_name : '',
				id: !isEmpty(find_user) ? find_user[0].id : null
			};
			this.setState({ data: temp });
		}
	}
	showModal(e) {
		this.setState({ open: true });
		const files = event.target.files;
		if (e.target.files && e.target.files.length > 0) {
			this.setState({ nameFIle: files[0].name, file: files[0] });
		}
	}
	handleClose() {
		this.setState({ open: false, loading: false });
	}

	handleUpload() {
		const { vipot } = this.props;
		const { data } = this.state;

		let form = {
			type: !isEmpty(data.media_id) ? 'update' : 'post',
			file: this.state.file,
			user_id: vipot.user_id,
			job_id: vipot.job_id,
			job_user_id: vipot.id
		};
		this.setState({ open: !this.state.open });
		this.props.handleUpload(form, data.id);
	}

  /**
   * Download Interview Score File
   */
  downloadScore(jobInterviewFileId, jobId, mediaId, fileName) {
    this.setState({ downloadLoading: true })
    return axios
      .get(`/api/jobs/${jobId}/interview-score/download`, { params: {jobInterviewFileId, mediaId}, responseType: 'blob'})
      .then((res) => {
        this.setState({ downloadLoading: false });
        return FileDownload(res.data, fileName);
      })
      .catch(err => {
        return this.setState({ downloadLoading: false }, () => {
          if (!isEmpty(err.response)) {
            if (!isEmpty(err.response.status)) {
              if (err.response.status === 404) {
                return this.props.addFlashMessage({
                  type: 'error',
                  text: err.response.message
                });
              }
            }
          }
          return this.props.serverErrorMessage();
        });
      })
  }

	render() {
		const { classes, acceptedFileTypes, error, usersSign, disabled, vipot } = this.props;
		const { open, nameFIle, data, downloadLoading } = this.state;
		let file_name_download = '';
		let btndownloaddisabled=false;
		if (!isEmpty(data)) {
			if (!isEmpty(data.file_name)) {
				if (data.file_name.length > 15) {
					file_name_download = data.file_name.substring(0, 14) + '...';

				} else {
					file_name_download = data.file_name;
				}
				btndownloaddisabled=true;
			}
		}

		return (
			<div>
				<Card className={classnames(classes.card)}>
					<CardContent classes={{ root: classes.cardContent }}>
						<input
							id="file"
							name="file"
							type="file"
							ref={(ref) => (this.file = ref)}
							style={{ display: 'none' }}
							onChange={this.showModal}
							accept={acceptedFileTypes}
						/>
						<Grid container spacing={16} alignItems="center">
							<Grid item xs={12} sm={12} md={6} lg={6}>
								<Typography variant="h6" color="primary" component="span">
									{data.user_interview_name}
								</Typography>
							</Grid>
							<Grid item xs={12} sm={12} md={6} lg={6}>
								<div className={classes.right}>
                  {!disabled && (
                    <Button
                      onClick={(e) => this.file.click()}
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={!(usersSign.immap_email == data.user_interview_email)}
                    >
                      Upload
                      <CloudUploadIcon className={classes.rightIcon} />
                    </Button>
                  )}

									{
										btndownloaddisabled==false ? (
											<Button
												style={{ marginLeft: 5 }}
												size="small"
												variant="contained"
												color="primary"
												disabled={true}
                        onClick={() => this.downloadScore(data.id, vipot.job_id, data.media_id, data.file_name)}
											>
												{!isEmpty(file_name_download) ? file_name_download : 'Download'}
												{ downloadLoading ? (
                          <CircularProgress className={classes.downloadLoading} thickness={5} size="16"/>
                          ) : (
                          <CloudDownload className={classes.rightIcon} />
                        )}
											</Button>
										):(
											<Tooltip title={data.file_name}>
												<Button
													style={{ marginLeft: 5 }}
													size="small"
													variant="contained"
													color="primary"
													disabled={false}
                          onClick={() => this.downloadScore(data.id, vipot.job_id, data.media_id, data.file_name)}
												>
													{!isEmpty(file_name_download) ? file_name_download : 'Download'}
                          { downloadLoading ? (
                            <CircularProgress className={classes.downloadLoading} thickness={5} size="16"/>
                            ) : (
                            <CloudDownload className={classes.rightIcon} />
                          )}
												</Button>
											</Tooltip>
										)
									}
								</div>
							</Grid>
						</Grid>
						{!isEmpty(error) && <div style={{ fontSize: '0.75rem', color: '#d50000' }}>Error</div>}
					</CardContent>
				</Card>
				<Dialog
					open={open}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					disableEnforceFocus
					PaperProps={{ style: { overflow: 'visible' } }}
				>
					<DialogTitle id="upload-modal">Upload</DialogTitle>
					<DialogContent className={classes.minWidth}>
						<Typography gutterBottom>{nameFIle}</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleUpload} color="primary">
							Upload
						</Button>
					</DialogActions>
				</Dialog>
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
  addFlashMessage,
  serverErrorMessage
}

UploadButton.propTypes = {
	acceptedFileTypes: PropTypes.array.isRequired,
	handleUpload: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  serverErrorMessage: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool
};

export default withStyles(styles)(connect('', mapDispatchToProps)(UploadButton));
