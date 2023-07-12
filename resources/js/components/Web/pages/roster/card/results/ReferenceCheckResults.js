import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { openReferenceCheck, getReferenceCheckResult } from '../../../../redux/actions/roster/rosterActions';
import isEmpty from '../../../../validations/common/isEmpty';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class ReferenceCheckResults extends Component {
	componentDidUpdate(prevProps) {
		const currentTemplate = JSON.stringify(this.props.reference_check_template_id);
		const prevTemplate = JSON.stringify(prevProps.reference_check_template_id);
		const currentProfile = JSON.stringify(this.props.reference_check_profile_id);
		const prevProfile = JSON.stringify(prevProps.reference_check_profile_id);

		if (currentTemplate !== prevTemplate || currentProfile !== prevProfile) {
			this.props.getReferenceCheckResult();
		}
	}

	render() {
		const { openReferenceCheck, openReferenceCheckResult, reference_already_did, classes } = this.props;
		return (
			<Dialog open={openReferenceCheckResult} maxWidth="lg" onClose={openReferenceCheck} fullWidth>
				<DialogTitle>Reference Check Result</DialogTitle>
				<DialogContent>
					{isEmpty(reference_already_did) ? (
						<Typography variant="body1" color="primary">
							No Reference Check Result Yet
						</Typography>
					) : (
						<Grid container spacing={24}>
							{reference_already_did.map((user, index) => (
								<Grid item xs={12} key={'reference-user-' + index}>
									<Paper className={classes.root}>
										<Typography variant="h6" color="primary">
											{user.full_name}
										</Typography>
										<Typography
											variant="body1"
											color="secondary"
											className={classes.addMarginBottom}
										>
											{user.email}
										</Typography>
										<hr />
										{!isEmpty(user.question) ?
											user.question.map((QnA, QnAIndex) => (
												<Grid container spacing={8} key={'qna-' + index + QnAIndex}>
													<Grid item xs={12}>
														<Typography
															variant="body1"
															color="primary"
															dangerouslySetInnerHTML={{ __html: QnA.question }}
															// paragraph={true}
															className={classes.question}
															// component="div"
														/>
													</Grid>
													<Grid item xs={12}>
														<Typography
															variant="body1"
															dangerouslySetInnerHTML={{ __html: QnA.answer.answer }}
															// paragraph={true}
															className={classes.answer}
															// component="div"
														/>
													</Grid>
												</Grid>
											)) : null
										}
									</Paper>
								</Grid>
							))}
						</Grid>
					)}
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="secondary" onClick={openReferenceCheck}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

const mapDispatchToProps = {
	openReferenceCheck,
	getReferenceCheckResult
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	openReferenceCheckResult: state.roster.openReferenceCheckResult,
	reference_check_template_id: state.roster.reference_check_modal_id,
	reference_check_profile_id: state.roster.reference_check_profile_id,
	reference_already_did: state.roster.reference_already_did
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2
	},
	addMarginBottom: {
		'margin-bottom': theme.spacing.unit * 2
	},
	answer: {
		'& p': {
			'margin-block-start': 0,
			'margin-block-end': theme.spacing.unit + 'px'
		}
	},
	question: {
		'& p': {
			'margin-block-start': 0,
			'margin-block-end': 0
		}
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReferenceCheckResults));
