import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import WysiwygField from '../../common/formFields/WysiwygField';
import ReactQuill from 'react-quill';
import isEmpty from '../../validations/common/isEmpty';
import { primaryColor } from '../../config/colors';
import { onChangeStep, isValid, onUpload, onDelete } from '../../redux/actions/imtest/imtestActions';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	title: {
		color: primaryColor
	},
	reactQuill: {
		width: '100%',
		marginTop: '0.5em',
		'& .ql-container': {
			height: 'auto !important',
			'min-height': '120px',
			'font-family': 'Barlow, sans-serif'
		},
		'& .ql-editor': {
			height: 'auto !important',
			'min-height': '120px'
		},
		'& .ql-editor p': {
			'margin-bottom': theme.spacing.unit * 2
		}
	}
});

const modules = {
	toolbar: [
		[ { header: [ 1, 2, 3, 4, 5, 6, false ] } ],
		[ 'bold', 'italic', 'underline' ],
		[ { list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' } ],
		[ 'clean' ]
	]
};

const formats = [ 'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'indent' ];

class IMTest3 extends Component {
	componentDidMount() {
		this.props.isValid(4);
	}
	componentDidUpdate(prevProps) {
		const currentDashboardIMTest = JSON.stringify(this.props.imtest.step4);
		const prevDashboardIMTest = JSON.stringify(prevProps.imtest.step4);

		if (currentDashboardIMTest !== prevDashboardIMTest) {
			this.props.isValid(4);
		}
	}

	render() {
		let { text1, title, answer } = this.props.imtest.step4;
		let { errors } = this.props.imtest;

		const { onChangeStep, isEdit, isAdd, classes } = this.props;
		return (
			<Grid container spacing={24}>
				{isAdd || isEdit ? (
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<TextField
								required
								id="Title"
								name="title"
								label="Title"
								fullWidth
								value={title}
								autoComplete="title"
								onChange={(e) => onChangeStep('step4', e.target.name, e.target.value)}
								error={!isEmpty(errors.title)}
								helperText={errors.title}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<WysiwygField
								withColor={true}
								label="Body"
								margin="dense"
								name="text1"
								value={text1}
								onChange={(e) => onChangeStep('step4', e.target.name, e.target.value)}
								error={errors.text1}
							/>
						</Grid>
					</Grid>
				) : (
					<Grid container spacing={16}>
						<Grid item xs={12} sm={11}>
							<Typography variant="h4" component="h4" className={classes.title} gutterBottom>
								{title}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<div dangerouslySetInnerHTML={{ __html: text1 }} />
						</Grid>
						<Grid item xs={12}>
							<ReactQuill
								value=""
								name=""
								theme="snow"
								modules={modules}
								formats={formats}
								onChange={null}
								className={classes.reactQuill}
							/>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
}

IMTest3.propTypes = {
	classes: PropTypes.object,
	onChangeStep: PropTypes.func.isRequired,
	isValid: PropTypes.func.isRequired,
	onUpload: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChangeStep,
	isValid,
	onUpload,
	onDelete
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	imtest: state.imtest
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTest3));
