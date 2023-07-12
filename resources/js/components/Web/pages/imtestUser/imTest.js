import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Welcome from './parts/Welcome';
import Part1 from './parts/Part1';
import Part2 from './parts/Part2';
import Part3 from './parts/Part3';
import Part4 from './parts/Part4';
import Recap from './parts/Recap';
import isEmpty from '../../validations/common/isEmpty';
import { primaryColor, white } from '../../config/colors';
import Alert from '../../common/Alert';
import Success from '../../common/Success';
import Placeholder from './PlaceHolder';
import {
	handleBack,
	handleNext,
	onChange,
	getIMTestStep,
	checkUser,
	onDelete,
	handleFinish
} from '../../redux/actions/imtest/imTestUserActions';

const partComponents = [ Welcome, Part1, Part2, Part3, Part4, Recap ];

class IMTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timerStart: 0,
			timerTime: 3600000,
			timerOn: false
		};
		this.renderTimmer = this.renderTimmer.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.handleFinished = this.handleFinished.bind(this);
		this.continueHandler = this.continueHandler.bind(this);
		this.handleStart = this.handleStart.bind(this);
	}
	componentDidMount() {
		if (!isEmpty(this.props.match.params.id)) {
			this.props.onChange('im_test', this.props.match.params.id);
		}
		this.props.getIMTestStep();
		this.props.checkUser(this.props.history);
	}

	componentDidUpdate(prevProps) {
		if (this.props.match.params.id != prevProps.match.params.id) {
			this.props.onChange('im_test', this.props.match.params.id);
		}
		if (prevProps.im_test_end_time !== this.props.im_test_end_time) {
			this.renderTimmer();
		}
	}

	async handleStart() {
		this.props.handleNext();
		let TrueFalse = await this.props.startImTest;
		if (TrueFalse) {
			this.renderTimmer();
		}
	}

	renderTimmer() {
		const { im_test_end_time } = this.props;
		const im_test_utc_now = moment.utc().format('YYYY-MM-DD h:mm:ss');
		this.setState({ timerTime: moment(im_test_end_time).diff(im_test_utc_now), timerOn: true }, () =>
			this.startTimer()
		);
	}

	startTimer() {
		this.timer = setInterval(() => {
			const newTime = this.state.timerTime - 10;
			if (newTime > 0) {
				this.setState({
					timerTime: newTime
				});
			} else {
				clearInterval(this.timer);
				this.setState({ timerTime: 0 });
			}
		}, 10);
	}

	handleFinished() {
		this.props.onChange('alertOpen', true);
	}

	continueHandler() {}

	render() {
		const {
			steps,
			activeStep,
			classes,
			handleBack,
			handleFinish,
			handleNext,
			onChange,
			step1,
			step2,
			step3,
			step4,
			step5,
			alertOpen,
			successOpen
		} = this.props;

		const partPropsComponent = [ step1, step2, step3, step4, step5 ];
		const IMTestComponent = partComponents[activeStep];

		const { timerTime, timerOn } = this.state;
		let seconds = ('0' + Math.floor((timerTime / 1000) % 60) % 60).slice(-2);
		let minutes = ('0' + Math.floor((timerTime / 60000) % 60)).slice(-2);
		let hours = ('0' + Math.floor((timerTime / 3600000) % 60)).slice(-2);

		return (
			<Paper className={classes.paper}>
				<Typography variant="h5" component="h3" className={classes.title} color="primary">
					IM Test
				</Typography>

				{timerOn && (
					<Typography className={classes.timmer} variant="h5" component="h3" color="primary">
						{hours} : {minutes} : {seconds}
					</Typography>
				)}

				<Stepper activeStep={activeStep} alternativeLabel>
					{steps.map((label) => {
						return (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				{isEmpty(partPropsComponent[activeStep]) && activeStep < partPropsComponent.length ? (
					<Placeholder />
				) : (
					<IMTestComponent data={partPropsComponent[activeStep]} classes={classes} />
				)}

				<div className={classes.navBtn}>
					<Grid container spacing={24}>
						{activeStep == 0 && (
							<Grid item xs={12} sm={4}>
								<Button variant="contained" color="primary" onClick={() => this.handleStart()}>
									Start
									<PlayArrow />
								</Button>
							</Grid>
						)}
						{activeStep > 0 && (
							<Grid item xs={12} sm={4}>
								<Button
									className={classes.backBtn}
									variant="outlined"
									color="primary"
									onClick={handleBack}
									disabled={activeStep == 0}
								>
									<ChevronLeftIcon />Back
								</Button>
							</Grid>
						)}

						{activeStep > 0 && <Grid item xs={12} sm={4} />}
						<Grid item xs={12} sm={4}>
							{activeStep > 0 &&
							activeStep < steps.length && (
								<Button
									variant="contained"
									color="primary"
									className={classes.nextBtn}
									onClick={handleNext}
								>
									Next
									<ChevronRightIcon />
								</Button>
							)}
							{activeStep >= steps.length && (
								<Button
									variant="contained"
									color="primary"
									className={classes.nextBtn}
									onClick={() => this.handleFinished()}
								>
									Finish
								</Button>
							)}
						</Grid>
					</Grid>
					<Alert
						isOpen={alertOpen}
						onClose={() => {
							onChange('alertOpen', false);
						}}
						onAgree={handleFinish}
						title="Submit IM Test"
						text={'Are you sure to submit IM Test ?'}
						closeText="Cancel"
						AgreeText="Yes"
					/>
					<Success
						isOpen={successOpen}
						onClose={() => onChange('successOpen', false)}
						continueHandler={() => this.props.history.push('/profile')}
					/>
				</div>
			</Paper>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	handleBack,
	handleNext,
	onChange,
	getIMTestStep,
	checkUser,
	onDelete,
	handleFinish
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	steps: state.imTestUser.steps,
	activeStep: state.imTestUser.activeStep,
	im_test_start_time: state.imTestUser.im_test_start_time,
	im_test_end_time: state.imTestUser.im_test_end_time,
	startImTest: state.imTestUser.startImTest,
	step1: state.imTestUser.step1,
	step2: state.imTestUser.step2,
	step3: state.imTestUser.step3,
	step4: state.imTestUser.step4,
	step5: state.imTestUser.step5,
	alertOpen: state.imTestUser.alertOpen,
	successOpen: state.imTestUser.successOpen
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		padding: theme.spacing.unit * 2
	},
	title: {
		'text-align': 'center'
	},
	addMarginTop: {
		'margin-top': '0.5em'
	},
	btnChoose: {
		width: 'max-content'
	},
	subTitle: {
		color: primaryColor
	},
	addMarginBottom: {
		marginBottom: 10
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	active: {
		backgroundColor: primaryColor,
		color: white
	},
	capitalize: {
		textTransform: 'capitalize'
	},
	timmer: {
		position: 'absolute',
		right: 30,
		top: 30
	},
	correctFont: {
		fontFamily: "'Barlow', sans-serif !important;",
		'& *': {
			fontFamily: "'Barlow', sans-serif !important;"
		}
	},
	navBtn: { 'min-height': theme.spacing.unit * 4 + theme.spacing.unit / 2, marginTop: theme.spacing.unit + 4 },
	backBtn: { float: 'left', marginBottom: theme.spacing.unit / 2 },
	nextBtn: { float: 'right', marginBottom: theme.spacing.unit / 2 }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTest));
