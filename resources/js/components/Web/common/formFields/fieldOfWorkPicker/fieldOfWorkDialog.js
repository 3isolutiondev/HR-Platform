import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import AutoCompleteSingleValue from '../AutoCompleteSingleValue';
// import isEmpty from '../../../validations/common/isEmpty';
import { getApprovedFieldOfWorks } from '../../../redux/actions/optionActions';
// import SaveIcon from '@material-ui/icons/Save';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	selectAddMore: {
		'overflow-y': 'visible'
	}
});

class FieldOfWorkDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			field_of_works: []
		};

		this.handleClose = this.handleClose.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getApprovedFieldOfWorks();
	}

	componentDidUpdate(prevProps, prevState) {
		let currentFieldOfWorks = JSON.stringify(this.props.field_of_works);
		let oldFieldOfWorks = JSON.stringify(prevProps.field_of_works);

		if (oldFieldOfWorks !== currentFieldOfWorks) {
			this.setState({ field_of_works: this.props.field_of_works });
		}

		const currentApprovedFieldOfWorks = JSON.stringify(this.props.approvedFieldOfWorks);
		const oldApprovedOfFieldOfWorks = JSON.stringify(prevProps.approvedFieldOfWorks);

		if (currentApprovedFieldOfWorks !== oldApprovedOfFieldOfWorks) {
			this.props.getApprovedFieldOfWorks();
		}
	}

	handleClose() {
		this.props.onClose();
	}

	selectOnChange(value, e) {
		this.setState({ field_of_works: value }, () => {
			this.props.onChange(value, e);
		});
	}

	render() {
		const { isOpen, classes, approvedFieldOfWorks } = this.props;
		const { field_of_works } = this.state;
		return (
			<Dialog
				open={isOpen}
				fullWidth
				maxWidth="lg"
				onClose={this.handleClose}
				PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle>Add Other Area of Expertise</DialogTitle>
				<DialogContent className={classes.selectAddMore}>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<AutoCompleteSingleValue
								options={approvedFieldOfWorks}
								value={field_of_works}
								suggestionURL="/api/field-of-works/suggestions"
								name="field_of_works"
								label="field"
								placeholder="Add or Search Area of Expertise"
								onChange={(e, val) => {this.selectOnChange(val, e)}}
								limit={3}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} color="secondary" variant="contained">
						<ArrowLeft /> Back
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

FieldOfWorkDialog.propTypes = {
	onClose: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getApprovedFieldOfWorks
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	approvedFieldOfWorks: state.options.approvedFieldOfWorks
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FieldOfWorkDialog));
