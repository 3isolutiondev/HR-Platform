import React, { Component } from 'react';
import { unionBy } from 'lodash/array';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SelectField from './SelectField';
import { getApprovedFieldOfWorks } from '../../redux/actions/optionActions';
import isEmpty from '../../validations/common/isEmpty';
import FieldOfWorkDialog from './fieldOfWorkPicker/fieldOfWorkDialog';
import AddIcon from '@material-ui/icons/Add';
import { addFlashMessage } from '../../redux/actions/webActions';

class FieldOfWorkPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addMore: false,
			field_of_works: [],
			approvedFieldOfWorks: []
		};

		this.handleAddMore = this.handleAddMore.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getApprovedFieldOfWorks().then(() =>
			this.setState({
				approvedFieldOfWorks: this.props.approvedFieldOfWorks,
				field_of_works: this.props.field_of_works
			})
		);
	}

	componentDidUpdate(prevProps, prevState) {
		let currentFieldOfWorks = JSON.stringify(this.props.field_of_works);
		let oldFieldOfWorks = JSON.stringify(prevProps.field_of_works);
		let currentApprovedFieldOfWorks = JSON.stringify(this.props.approvedFieldOfWorks);
		let oldApprovedFieldOfWorks = JSON.stringify(prevProps.approvedFieldOfWorks);

		if (oldFieldOfWorks !== currentFieldOfWorks) {
			this.setState({ field_of_works: this.props.field_of_works });
		}

		if (currentApprovedFieldOfWorks !== oldApprovedFieldOfWorks) {
			this.props.getApprovedFieldOfWorks().then(() =>
				this.setState({
					approvedFieldOfWorks: this.props.approvedFieldOfWorks
				})
			);
		}
	}

	handleAddMore() {
		this.setState({ addMore: !this.state.addMore });
	}

	selectOnChange(value) {
		let approvedFieldOfWorks = unionBy(this.props.approvedFieldOfWorks, value, 'value');
		if(!this.props.limit || value.length <= this.props.limit ) {
			if(this.props.onSelect) {this.props.onSelect(this.state.approvedFieldOfWorks.find(afw => afw.value === value))}
			this.setState({ approvedFieldOfWorks }, () => { 
				this.setState({ field_of_works: value }, () => {
					this.props.onChange(this.state.field_of_works, {
						name: this.props.name
					});
				});
			});
		} else  {
			return this.props.addFlashMessage({
                type: "error",
                text: `You can only select ${this.props.limit} areas of expertise`,
              });
		}
	}

	render() {
		const { addMore, field_of_works, approvedFieldOfWorks } = this.state;
		const { errors, classes } = this.props;

		return (
			<div>
				<FieldOfWorkDialog
					isOpen={addMore}
					field_of_works={field_of_works}
					onChange={this.selectOnChange}
					onClose={this.handleAddMore}
				/>
				<Grid container spacing={24} alignItems="flex-end">
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
						<SelectField
							label="Areas of expertise *"
							options={approvedFieldOfWorks}
							value={field_of_works}
							onChange={this.selectOnChange}
							placeholder="Select areas of expertise"
							name="field_of_works"
							error={errors}
							required
							isMulti={this.props.isMulti === false ? false : true}
							fullWidth={true}
							margin="none"
							/**Uncomment  to enable adding more area of expertise*/
							/*added={true}*/ // jika added true, maka option mengikuti name dari SelectField
							handleAddMore={this.handleAddMore}
						/>
					</Grid>
					{/**Uncomment  to enable adding more area of expertise*/}
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
							<AddIcon /> Add Other Field
						</Button>
		          </Grid>*/}
				</Grid>
			</div>
		);
	}
}

FieldOfWorkPicker.propTypes = {
	name: PropTypes.string.isRequired,
	field_of_works: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	approvedFieldOfWorks: PropTypes.array.isRequired,
	getApprovedFieldOfWorks: PropTypes.func.isRequired,
	errors: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ])
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getApprovedFieldOfWorks,
	addFlashMessage,
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

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	btnErr: {
		'margin-top': '-4em'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FieldOfWorkPicker));
