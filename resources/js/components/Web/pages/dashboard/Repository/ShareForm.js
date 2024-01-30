import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

import { getAPI, deleteAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import CircularProgress from '@material-ui/core/CircularProgress';
import { white } from '../../../config/colors';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	displayBlock: {
		display: 'block'
	}
});

class ShareForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apiURL: '/api/repository/notify',
			apiCountry: '/api/repository/getImmapOffice',
			selectedValue: '',
			idOffice: [],
			immapoffice: [],
			alertOpen: false,
			isLoading: false
		};

		this.handleClose = this.handleClose.bind(this);
		this.handleShare = this.handleShare.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleClose() {
		this.props.onClose(false);
	}

	handleChange(e) {
		this.setState({
			selectedValue: e.target.value
		});

		if (e.target.value == 'Country') {
			this.getSpecificCountry();
		} else {
			this.setState({
				immapoffice: []
			});
		}
	}

	getSpecificCountry() {
		this.props
			.getAPI(this.state.apiCountry)
			.then((res) => {
				this.setState({
					immapoffice: res.data.data
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while requesting tor data'
				});
			});
	}
	handleShare() {
		if (!this.state.selectedValue) {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Please choose one or more'
			});
		}

		if (this.state.selectedValue === 'Country' && this.state.idOffice.length == 0) {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Please choose one or more country office'
			});
		}

		let recordData = {
			share: this.state.selectedValue,
			idOffice: this.state.idOffice,
			documentID: this.props.documentID
		};

		this.setState({
			isLoading: true
		});

		this.props
			.postAPI(this.state.apiURL, recordData)
			.then((res) => {
				const { status, message } = res.data;

				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({
					isLoading: false,
					idOffice: []
				});
				this.props.onClose(false);
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
			});
	}

	render() {
		const { classes } = this.props;
		const { isEdit, immapoffice, isLoading } = this.state;
		let textall = (
			<div>
				<span>All Consultants </span>
				<b>(will be sent to all@organization.org)</b>
			</div>
		);
		return (
			<div>
				<Dialog open={this.props.isOpen} fullWidth onClose={this.handleClose}>
					<DialogTitle>Send Document Notification To:</DialogTitle>
					<DialogContent>
						<Grid container>
							<Grid item xs={12}>
								<RadioGroup
									aria-label="Gender"
									name="shareTo"
									// className={classes.group}
									value={this.state.selectedValue}
									onChange={this.handleChange}
								>
									<FormControlLabel value="All" control={<Radio />} label={textall} />
									<FormControlLabel value="Managers" control={<Radio />} label="Managers" />
									<FormControlLabel
										value="Country"
										control={<Radio />}
										label="Specific Country Office"
									/>
								</RadioGroup>
								<div style={{ paddingLeft: 50 }}>
									{immapoffice.length > 0 &&
										immapoffice.map((sheet, i) => {
											return (
												<FormControlLabel
													key={i}
													control={
														<Checkbox
															onChange={() =>
																this.setState((prevState) => ({
																	idOffice: [ sheet.id, ...prevState.idOffice ]
																}))}
															color="primary"
														/>
													}
													label={sheet.city}
												/>
											);
										})}
								</div>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="secondary" variant="contained">
							Close
						</Button>
						<Button onClick={this.handleShare} color="primary" variant="contained">
							Share{' '}
							{isLoading && <CircularProgress className={classes.loading} thickness={4} size={18} />}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

ShareForm.propTypes = {
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect('', mapDispatchToProps)(ShareForm));
