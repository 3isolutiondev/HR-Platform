import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getAPI, deleteAPI, postAPI } from '../../redux/actions/apiActions';
import Search from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Autosuggest from 'react-autosuggest';
import isEmpty from '../../validations/common/isEmpty';
// import Popper from '@material-ui/core/Popper';

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

class SearchAndSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			val: '',
			suggestions: [],
			dataSuggestions: []
		};
		this.getSuggestions = this.getSuggestions.bind(this);
		this.getSuggestionValue = this.getSuggestionValue.bind(this);
		this.renderSuggestion = this.renderSuggestion.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.renderInputComponent = this.renderInputComponent.bind(this);
		this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this);
		this.getDataSuggestion = this.getDataSuggestion.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEmpty(this.props.option)) {
			if (this.props.option !== prevProps.option) {
				this.setState({ val: this.props.option.email });
			}
		}
	}

	getSuggestions(value) {
		return this.state.dataSuggestions;
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
					endAdornment: (
						<InputAdornment position="end">
							<Search />
						</InputAdornment>
					)
				}}
				{...other}
			/>
		);
	}

	getSuggestionValue(suggestion) {
		this.props.insertData(suggestion);
		return suggestion.email;
	}

	renderSuggestion(suggestion, { query, isHighlighted }) {
		const matches = match(suggestion.email, query);
		const parts = parse(suggestion.email, matches);
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

	renderSuggestionsContainer(options) {
		const { containerProps, children } = options;
		return (
			<Paper {...containerProps} square>
				{children}
			</Paper>
		);
	}

	onChange(event, { newValue }) {
		this.setState(
			{
				val: newValue
			},
			() => this.getDataSuggestion(newValue)
		);
	}

	getDataSuggestion(value) {
		let { val, dataSuggestions } = this.state;
		let recordData = {
			email: val
		};
		if (value.length > 1) {
			this.props
				.postAPI(this.props.suggestionURL, recordData)
				.then((res) => {
					this.setState({
						dataSuggestions: res.data.data
					});
				})
				.catch((err) => { });
		}
		if (!isEmpty(this.props.option)) {
			if (this.props.option.email !== value) {
				this.props.insertData([]);
			}
		}
	}

	onSuggestionsFetchRequested({ value }) {
		this.setState({
			suggestions: this.getSuggestions(value)
		});
	}

	onSuggestionsClearRequested() {
		this.setState({
			suggestions: []
		});
	}

	render() {
		const { val, suggestions } = this.state;
		let { classes, error, name, placeholder } = this.props;

		// Finally, render it!
		return (
			<Autosuggest
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				getSuggestionValue={this.getSuggestionValue}
				renderSuggestion={this.renderSuggestion}
				renderSuggestionsContainer={this.renderSuggestionsContainer}
				renderInputComponent={this.renderInputComponent}
				inputProps={{
					classes,
					id: name,
					placeholder: placeholder,
					value: val,
					onChange: this.onChange,
					helperText: error,
					error: !isEmpty(error) ? true : false
				}}
				theme={{
					container: classes.container,
					suggestionsContainerOpen: classes.suggestionsContainerOpen,
					suggestionsList: classes.suggestionsList,
					suggestion: classes.suggestion
				}}
			/>
		);
	}
}

SearchAndSelect.propTypes = {
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	deleteAPI
};

export default withStyles(styles)(connect('', mapDispatchToProps)(SearchAndSelect));
