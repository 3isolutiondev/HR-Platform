import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import { blueIMMAPHover, blueIMMAP, white } from '../../../config/colors';
// import isEmpty from '../../../validations/common/isEmpty';
import SelectField from '../../../common/formFields/SelectField';
import DatePickerField from '../../../common/formFields/DatePickerField';
import { getIMTestTemplates } from '../../../redux/actions/optionActions';

class Quiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			im_test_template: '',
			submit_quiz_date: moment(new Date()).add(7, 'days'),
			errors: {}
		};

		this.dateOnChange = this.dateOnChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getIMTestTemplates();
	}

	dateOnChange(e) {
		this.setState({ [e.target.name]: moment(e.target.value) });
	}

	selectOnChange(e) {}

	render() {
		const { im_test_template, submit_quiz_date, errors } = this.state;
		const { classes, im_test_templates } = this.props;
		return (
			<Grid container spacing={16} alignItems="center" className={classes.inviteContainer}>
				<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
					// ambil data dr quiz select process`
					<SelectField
						label="IM Test Template"
						margin="none"
						options={im_test_templates}
						value={im_test_template}
						placeholder="Choose IM Test Template"
						isMulti={false}
						name="type"
						fullWidth
						onChange={this.selectOnChange}
						error={errors.im_test_template}
						required
					/>
				</Grid>
				<Grid item xs={12} md={6} lg={3} xl={3}>
					<DatePickerField
						label="Submit Quiz Date & Time"
						name="submit_quiz_date"
						value={submit_quiz_date}
						onChange={this.dateOnChange}
						error={errors.submit_quiz_date}
						margin="none"
						usingTime={true}
						// disablePast={interview_invitation_done ? false : true}
					/>
				</Grid>
				<Grid item xs={12} md={6} lg={3} xl={3}>
					<Button
						size="small"
						color="primary"
						// className={classes.addSmallMarginLeft}
						fullWidth
						variant="contained"
						className={classes.interviewBtn}
						// onClick={() => nextStep(id)}
					>
						Send Quiz <Send fontSize="small" className={classes.addSmallMarginLeft} />{' '}
					</Button>
				</Grid>
			</Grid>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getIMTestTemplates
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	im_test_templates: state.options.im_test_templates
});

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	inviteContainer: {
		'margin-bottom': '-4px'
	},
	interviewBtn: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Quiz));
