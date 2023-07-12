import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { postAPI } from '../../redux/actions/apiActions';
import isEmpty from '../../validations/common/isEmpty';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		height: 250,
		flexGrow: 1
	},
	container: {
		position: 'relative'
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		zIndex: 111111,
		marginTop: theme.spacing.unit * 1,
		left: 0,
		right: 0
	},
	suggestion: {
		display: 'block'
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none'
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	labelMargin: {
		'margin-top': '1em',
		'margin-bottom': '1em'
	},
	chip: {
		'margin-right': '0.25em'
	}
});

class AutoCompleteSingleValue extends Component {
	constructor(props) {
		super(props);

		// Autosuggest is a controlled component.
		// This means that you need to provide an input value
		// and an onChange handler that updates this value (see below).
		// Suggestions also need to be provided to the Autosuggest,
		// and they are initially empty because the Autosuggest is closed.
		this.state = {
			value: '',
			suggestions: [],
			dataSuggestions: []
		};
		this.onChange = this.onChange.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.renderInputComponent = this.renderInputComponent.bind(this);
		this.getSuggestionValue = this.getSuggestionValue.bind(this);
		this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
		this.handleDeleteChip = this.handleDeleteChip.bind(this);
		this.addSkill = this.addSkill.bind(this);
	}
	// Teach Autosuggest how to calculate suggestions for any given input value.
	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		const data = this.state.dataSuggestions.filter(
			(data) => data.label.toLowerCase().slice(0, inputLength) === inputValue
		);

		return data;
	}

	// When suggestion is clicked, Autosuggest needs to populate the input
	// based on the clicked suggestion. Teach Autosuggest how to calculate the
	// input value for every given suggestion.
	getSuggestionValue(suggestion) {
		return suggestion.label;
	}

	// Use your imagination to render suggestions.
	renderSuggestion(suggestion, { query, isHighlighted }) {
		const matches = match(suggestion.label, query);
		const parts = parse(suggestion.label, matches);
		return (
			<MenuItem selected={isHighlighted} component="div">
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

	onChange(event, { newValue }) {
		this.setState(
			{
				value: newValue
			},
			() => {
				if (newValue.length > 1) {
					this.props
						.postAPI(this.props.suggestionURL, { [this.props.label]: newValue })
						.then((res) => {
							let response = res.data.data.map((data) => {
								return { value: data.id, label: data[this.props.label] };
							});
							this.setState({
								dataSuggestions: response
							});
						})
						.catch((err) => { });
				}
			}
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

	// Use
	renderInputComponent(inputProps) {
		const { classes, value, inputRef = () => { }, ref, ...other } = inputProps;
		return (
			<TextField
				fullWidth
				value={value}
				InputProps={{
					inputRef: (node) => {
						ref(node);
						inputRef(node);
					},
					classes: {
						input: classes.input
					},
					startAdornment: (
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					)
				}}
				{...other}
			/>
		);
	}

	onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
		let isSimilar = Array.isArray(this.props.value) ? this.props.value.filter((isimilar) => {
			return isimilar.label.toLowerCase() == suggestion.label.toLowerCase();
		}) : null;
		if (isEmpty(isSimilar)  && (this.props.limit && this.props.value.length < this.props.limit)) {
			this.props.value.push(suggestion);
		} else {
			this.props.value;
		}

		this.setState(
			{
				value: ''
			},
			() => this.props.onChange({ name: this.props.name }, this.props.value)
		);
	}

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	onSuggestionsFetchRequested({ value }) {
		this.setState({
			suggestions: this.getSuggestions(value)
		});
	}

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested() {
		this.setState({
			suggestions: []
		});
	}
	handleDeleteChip(chip, index) {
		let temp = this.props.value;
		temp.splice(index, 1);
		this.props.onChange({ name: this.props.name }, temp);
	}

	addSkill() {
		let isSimilar = Array.isArray(this.props.value) ? this.props.value.filter((isimilar) => {
			return isimilar.label.toLowerCase() == this.state.value;
		}) : null;
		if (isEmpty(isSimilar)) {
			if (!isEmpty(this.state.value)) {
				this.props.value.push({
					value: 'others-' + moment().format('YYYY-MM-DD,HH:mm:ss'),
					label: this.state.value,
					addedBy: 'others'
				});
			}
		} else {
			if (!isEmpty(this.props.value)) {
				this.props.value;
			}
		}

		this.setState(
			{
				value: ''
			},
			() => this.props.onChange({ name: this.props.name }, this.props.value)
		);
	}
	render() {
		const { value, suggestions } = this.state;
		const { classes } = this.props;
		// Finally, render it!
		return (
			<Grid container spacing={24} alignItems="flex-end">
				<Grid item xs={12} sm={7} md={8} lg={9} xl={10}>
					<Autosuggest
						suggestions={suggestions}
						onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.onSuggestionsClearRequested}
						getSuggestionValue={this.getSuggestionValue}
						onSuggestionSelected={this.onSuggestionSelected}
						renderSuggestion={this.renderSuggestion}
						renderSuggestionsContainer={this.renderSuggestionsContainer}
						renderInputComponent={this.renderInputComponent}
						inputProps={{
							classes,
							id: this.props.name,
							placeholder: this.props.placeholder,
							value: value,
							onChange: this.onChange,
						}}
						theme={{
							container: classes.container,
							suggestionsContainerOpen: classes.suggestionsContainerOpen,
							suggestionsList: classes.suggestionsList,
							suggestion: classes.suggestion
						}}
					/>
				</Grid>
				<Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
					<Button onClick={this.addSkill} variant="contained" color="primary" fullWidth size="small">
						<AddIcon /> Add {this.props.label}
					</Button>
				</Grid>
				<Grid item xs={12}>
					{isEmpty(this.props.value) ? null : (
						<Typography variant="subtitle1" className={classes.labelMargin}>
							Your {this.props.label} :
						</Typography>
					)}
					{!isEmpty(this.props.value) && this.props.value.map((skill, index) => {
						return (
							<Chip
								key={skill.value}
								label={skill.label}
								onDelete={(chip) => this.handleDeleteChip(chip, index)}
								color="primary"
								className={classes.chip}
							/>
						);
					})}
				</Grid>
			</Grid>
		);
	}
}
AutoCompleteSingleValue.propTypes = {
	classes: PropTypes.object.isRequired,
	postAPI: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	postAPI
};

export default withStyles(styles)(connect('', mapDispatchToProps)(AutoCompleteSingleValue));
