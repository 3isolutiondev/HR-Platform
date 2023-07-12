import React, { Component } from 'react';
import { unionBy } from 'lodash/array';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SelectField from './SelectField';
import { getApprovedSectors } from '../../redux/actions/optionActions';
import isEmpty from '../../validations/common/isEmpty';
import SectorDialog from './sectorPicker/SectorDialog';
import AddIcon from '@material-ui/icons/Add';
import { addFlashMessage } from '../../redux/actions/webActions';

class SectorPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addMore: false,
			sectors: [],
			approvedSectors: []
		};

		this.handleAddMore = this.handleAddMore.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getApprovedSectors().then(() =>
			this.setState({
				approvedSectors: this.props.approvedSectors,
				sectors: this.props.sectors
			})
		);
	}

	componentDidUpdate(prevProps, prevState) {
		let currentSectors = JSON.stringify(this.props.sectors);
		let oldSectors = JSON.stringify(prevProps.sectors);
		let currentApprovedSectors = JSON.stringify(this.props.approvedSectors);
		let oldApprovedSectors = JSON.stringify(prevProps.approvedSectors);

		if (oldSectors !== currentSectors) {
			this.setState({ sectors: this.props.sectors });
		}

		if (currentApprovedSectors !== oldApprovedSectors) {
			this.props.getApprovedSectors().then(() => this.setState({ approvedSectors: this.props.approvedSectors }));
		}
	}

	handleAddMore() {
		this.setState({ addMore: !this.state.addMore });
	}

	selectOnChange(value) {
		let approvedSectors = unionBy(this.props.approvedSectors, value, 'value');
		if(!this.props.limit || (value.length <= this.props.limit || value.length < this.props.sectors.length) ) {
			this.setState({ approvedSectors }, () => {
				this.setState({ sectors: value }, () => {
					this.props.onChange(this.state.sectors, { name: this.props.name });
				});
			});
		} else {
			return this.props.addFlashMessage({
                type: "error",
                text: `You can only select ${this.props.limit} sectors`,
              });
		}
	}

	render() {
		const { addMore, sectors, approvedSectors } = this.state;
		const { errors, classes, onMenuOpenOrClose } = this.props;

		return (
			<div>
				<SectorDialog
					isOpen={addMore}
					sectors={sectors}
					onChange={this.selectOnChange}
					onClose={this.handleAddMore}
				/>
				<Grid container spacing={24} alignItems="flex-end">
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
						<SelectField
							label="Sectors *"
							options={approvedSectors}
							value={sectors}
							onChange={this.selectOnChange}
							placeholder={this.props.placeholder || "Select sectors"}
							name="sectors"
							error={errors}
							required
							isMulti={this.props.isMulti === false ? false : true}
							fullWidth={true}
							margin="none"
							/**Uncomment  to enable adding more sector*/
							/*added={true}*/ // jika added true, maka option mengikuti name dari SelectField
              handleAddMore={this.handleAddMore}
              onMenuOpenOrClose={onMenuOpenOrClose}
						/>
					</Grid>
					{/**Uncomment  to enable adding more sector*/}
					{/*<Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
						<Button
							// size="normal"
							variant="contained"
							aria-label="large outlined secondary button group"
							color="primary"
							fullWidth
							onClick={this.handleAddMore}
							className={!isEmpty(errors) ? classes.btnErr : ''}
						>
							<AddIcon /> Add Other Sector
						</Button>
					</Grid>*/}
				</Grid>
			</div>
		);
	}
}

SectorPicker.defaultProps = {
  onMenuOpenOrClose: () => { return false; }
}

SectorPicker.propTypes = {
	name: PropTypes.string.isRequired,
	// sectors: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	approvedSectors: PropTypes.array.isRequired,
	getApprovedSectors: PropTypes.func.isRequired,
  errors: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
  onMenuOpenOrClose: PropTypes.func
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getApprovedSectors,
	addFlashMessage,
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

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	btnErr: {
		'margin-top': '-4em'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SectorPicker));
