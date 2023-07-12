import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import { postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import isEmpty from '../../validations/common/isEmpty';
import { secondaryColor } from '../../config/colors';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	container: {
		flexGrow: 1,
		position: 'relative'
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit * 3,
		left: 0,
		right: 0,
		'z-index': 2
	},
	suggestion: {
		display: 'block'
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none'
	},
	textField: {
		width: '100%'
	},
	chipDefault: {
		background: '#ddd',
		color: secondaryColor,
		'&:hover': {
			background: '#ddd'
		},
		'&:focus': {
			background: '#ddd'
		}
	}
});

class AutocompleteTagsField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// value: '',
			suggestions: [],
			value: [],
			textFieldInput: '',
			chipPlaceholder: ['Type your preferred area of expertise and press enter to add tag. Click X to remove it.'],
			// chipPlaceholder: [ '+ Add Tag' ],
			isMulti: true
		};

		this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
		this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
		this.handletextFieldInputChange = this.handletextFieldInputChange.bind(this);
		this.handleAddChip = this.handleAddChip.bind(this);
		this.handleDeleteChip = this.handleDeleteChip.bind(this);

		this.renderSuggestion = this.renderSuggestion.bind(this);
		this.getSuggestionValue = this.getSuggestionValue.bind(this);
	}

	componentDidMount() {
		let { value, isMulti } = this.props;

		if (!isEmpty(value)) {
			this.setState({ value });
		}

		if (!isMulti) {
			this.setState({ isMulti });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEmpty(this.props.value)) {
			if (this.props.value !== prevProps.value) {
				this.setState({ value: this.props.value });
			}
		}

		if (this.props.isMulti !== prevProps.isMulti) {
			if (this.props.isMulti === false) {
				this.setState({ isMulti: false });
			} else {
				this.setState({ isMulti: true });
			}
		}

		if (!isEmpty(this.props.chipPlaceholder)) {
			const currentChipPlaceholder = JSON.stringify([this.props.chipPlaceholder]);
			const prevChipPlaceholder = JSON.stringify(prevState.chipPlaceholder);
			if (currentChipPlaceholder !== prevChipPlaceholder) {
				this.setState({ chipPlaceholder: [this.props.chipPlaceholder] });
			}
		}
	}

	handleSuggestionsFetchRequested(value) {
		if (value.value.length > 2) {
			this.props
				.postAPI(this.props.suggestionURL, { [this.props.labelField]: value.value })
				.then((res) => {
					this.setState({ suggestions: res.data.data });
				})
				.catch((err) => { });
		}
	}

	handleSuggestionsClearRequested() {
		this.setState({
			suggestions: []
		});
	}

	handletextFieldInputChange(event, { newValue }) {
		if (this.state.isMulti === false) {
			if (this.state.value.length < 2) {
				this.setState({
					textFieldInput: newValue
				});
			} else {
				this.setState({
					textFieldInput: ''
				});
			}
		} else {
			this.setState({
				textFieldInput: newValue
			});
		}
	}

	handleAddChip(chip) {
		this.setState({ suggesttions: [], textFieldInput: '' }, () => {
			if (this.state.isMulti === false) {
				if (this.state.value.length < 1) {
					this.setState({ value: this.state.value.concat([chip]) }, () => {
						this.props.onChange(this.props.name, this.state.value);
					});
				}
			} else {
				this.setState({ value: this.state.value.concat([chip]) }, () => {
					this.props.onChange(this.props.name, this.state.value);
				});
			}
		});
	}

	handleDeleteChip(chip, index) {
		let temp = this.state.value;
		temp.splice(index, 1);
		this.setState({ value: temp }, () => {
			this.props.onChange(this.props.name, this.state.value);
		});
	}

	// render paper and chip
	renderInput(inputProps) {
		const { classes, autoFocus, value, onChange, onAdd, onDelete, chips, chip, ref, ...other } = inputProps;

		return (
			<ChipInput
				alwaysShowPlaceholder={true}
				clearInputValueOnChange={true}
				onUpdateInput={onChange}
				onAdd={onAdd}
				onDelete={onDelete}
				value={chips}
				inputRef={ref}
				// placeholder="Type your preferred area of expertise and press enter to add tag. Click X to remove it."
				chipRenderer={({ value, text, isFocused, isDisabled, handleClick, handleDelete, className }, key) => (
					<Chip
						key={key}
						className={className}
						// style={{ pointerEvents: isDisabled ? 'none' : undefined, backgroundColor: isFocused ? blue[300] : undefined }}
						onClick={handleClick}
						onDelete={chip !== 'secondary' ? handleDelete : () => { }}
						label={text}
						color={chip}
						classes={{
							colorSecondary: classes.chipDefault
						}}
					// clickable={chip === 'secondary' ? false : true}
					/>
				)}
				{...other}
			/>
		);
	}

	renderSuggestion(suggestion, { query, isHighlighted }) {
		const matches = match(suggestion[this.props.labelField], query);
		const parts = parse(suggestion[this.props.labelField], matches);

		return (
			<MenuItem
				selected={isHighlighted}
				component="div"
			// onMouseDown={(e) => e.preventDefault()} // prevent the click causing the input to be blurred
			>
				<div>
					{parts.map((part, index) => {
						return part.highlight ? (
							<span key={String(index)} style={{ fontWeight: 300 }}>
								{part.text}
							</span>
						) : (
								<strong key={String(index)} style={{ fontWeight: 500 }}>
									{part.text}
								</strong>
							);
					})}
				</div>
			</MenuItem>
		);
	}

	renderSuggestionsContainer(options) {
		const { containerProps, children } = options;

		return (
			<Paper {...containerProps} square>
				{children}
			</Paper>
		);
	}

	getSuggestionValue(suggestion) {
		return suggestion[this.props.labelField];
	}

	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;
		let count = 0;

		return inputLength === 0
			? []
			: suggestions.filter((suggestion) => {
				const keep = count < 5 && suggestion.field.toLowerCase().slice(0, inputLength) === inputValue;

				if (keep) {
					count += 1;
				}

				return keep;
			});
	}

	render() {
		const { classes, ...rest } = this.props;
		const { errors } = this.props;

		return (
			<Autosuggest
				theme={{
					container: classes.container,
					suggestionsContainerOpen: classes.suggestionsContainerOpen,
					suggestionsList: classes.suggestionsList,
					suggestion: classes.suggestion
				}}
				renderInputComponent={this.renderInput}
				suggestions={this.state.suggestions}
				onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
				renderSuggestionsContainer={this.renderSuggestionsContainer}
				getSuggestionValue={this.getSuggestionValue}
				renderSuggestion={this.renderSuggestion}
				onSuggestionSelected={(e, { suggestionValue }) => {
					this.setState({ textFieldInput: '' }, () => {
						this.handleAddChip(suggestionValue);
					});
					e.preventDefault();
				}}
				focusInputOnSuggestionClick={false}
				inputProps={{
					// allowDuplicates: false,
					label: this.props.label,
					fullWidth: true,
					classes,
					chips: !isEmpty(this.state.value) ? this.state.value : this.state.chipPlaceholder,
					// chips: this.state.value.push(this.state.chipPlaceholder),
					onChange: this.handletextFieldInputChange,
					value: this.state.textFieldInput,
					onAdd: (chip) => this.handleAddChip(chip),
					onDelete: (chip, index) => this.handleDeleteChip(chip, index),
					helperText: this.props.error,
					error: !isEmpty(this.props.error) ? true : false,
					chip: !isEmpty(this.state.value) ? 'primary' : 'secondary',
					placeholder: this.props.placeholder
					// ...rest
				}}
			/>
		);
	}
}

AutocompleteTagsField.defaultProps = {
	isMulti: true
};

AutocompleteTagsField.propTypes = {
	classes: PropTypes.object.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	postAPI,
	addFlashMessage
};

export default withStyles(styles)(connect('', mapDispatchToProps)(AutocompleteTagsField));
