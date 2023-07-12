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
import isEmpty from '../../../validations/common/isEmpty';
import { getApprovedSectors } from '../../../redux/actions/optionActions';
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
			sectors: []
		};

		this.handleClose = this.handleClose.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getApprovedSectors();
	}

	componentDidUpdate(prevProps, prevState) {
		let currentSectors = JSON.stringify(this.props.sectors);
		let oldSectors = JSON.stringify(prevProps.sectors);

		if (oldSectors !== currentSectors) {
			this.setState({ sectors: this.props.sectors });
		}

		const currentApprovedSectors = JSON.stringify(this.props.approvedSectors);
		const oldApprovedSectors = JSON.stringify(prevProps.approvedSectors);

		if (currentApprovedSectors !== oldApprovedSectors) {
			this.props.getApprovedSectors();
		}
	}

	handleClose() {
		this.props.onClose();
	}

	selectOnChange(value, e) {
		this.setState({ sectors: value }, () => {
			this.props.onChange(value, e);
		});
	}

	render() {
		const { isOpen, classes, approvedSectors } = this.props;
		const { sectors } = this.state;

		return (
			<Dialog
				open={isOpen}
				fullWidth
				maxWidth="lg"
				onClose={this.handleClose}
				PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle>Add Other Sector</DialogTitle>
				<DialogContent className={classes.selectAddMore}>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<AutoCompleteSingleValue
								options={approvedSectors}
								value={isEmpty(sectors) ? [] : sectors}
								suggestionURL="/api/sectors/suggestions"
								name="sectors"
								label="sector"
								placeholder="Add or Search Sectors"
								onChange={(e, val) => this.selectOnChange(val, e)}
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
	getApprovedSectors
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	approvedSectors: state.options.approvedSectors
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FieldOfWorkDialog));
