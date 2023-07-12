import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import isEmpty from '../../validations/common/isEmpty';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import validator from 'validator';
import { primaryColor } from '../../config/colors';
import { getCountryCodeWithFlag } from '../../redux/actions/optionActions';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	labelNormalSize: {
		fontSize: '16px',
		transform: 'translate(0, 1.5px) scale(0.75)',
		'transform-origin': 'top left'
	},
	root: {
		padding: '0px 0px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		boxShadow: 'none',
		borderRadius: '0',
		paddingTop: '28px'
	},
	input: {
		width: '100%'
	},
	iconButton: {
		position: 'absolute',
		paddingBottom: '30px'
	},
	icon: {
		fill: 'transparent'
	},
	svg: {
		width: 20,
		paddingRight: '10px'
	},
	flag: {
		width: 30,
		cursor: 'pointer'
	},
	capitalize: {
		textTransform: 'capitalize'
	},
	searchBox: {
		padding: '.75em 1em .75em 1em',
		width: 'calc(100% - 2em)',
		'&:focus': {
			outline: 'none'
		},
		position: 'fixed',
		top: 0,
		background: '#fff',
		zIndex: 1400,
		'border-bottom': '1px solid ' + primaryColor
	},
	countryList: {
		paddingTop: '8px',
		paddingBottom: '8px'
	},
	errorCountry: {
		color: 'red',
		top: '1em'
	},
	menu: {
		height: '500px',
		'overflow-y': 'hidden',
		width: '26em',
		'& ul': {
			'overflow-y': 'auto',
			height: '435px',
			'margin-top': '4.5em',
			'padding-top': '0'
		}
	}
});

class PhoneNumberField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			flag: {},
			phone_number: '',
			country_code: '',
			errors: '',
			isMounted: false,
			keyword: '',
			allCountryName: [],
			allPhoneData: [],
			countryNotFoundError: ''
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSelectFlag = this.handleSelectFlag.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.findCountryCode = this.findCountryCode.bind(this);
		this.setFlag = this.setFlag.bind(this);
		this.functionGetData = this.functionGetData.bind(this);
		this.checkKey = this.checkKey.bind(this);
		this.searchCountry = this.searchCountry.bind(this);
	}

	componentDidMount() {
		this.props.getCountryCodeWithFlag().then(() => {
			this.setFlag();
			this.setState({ errors: this.props.error, allPhoneData: this.props.country_code_with_flag }, () => {
				this.functionGetData(this.props.value);
			});
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.value !== this.props.value) {
			this.functionGetData(this.props.value);
		}
		if (prevProps.error !== this.props.error) {
			this.setState({ errors: this.props.error });
		}

		const currentCountryCodeWithFlag = JSON.stringify(this.props.country_code_with_flag);
		const prevCountryCodeWithFlag = JSON.stringify(prevProps.country_code_with_flag);

		if (prevCountryCodeWithFlag !== currentCountryCodeWithFlag) {
			this.props.getCountryCodeWithFlag().then(() => {
				this.setState({ allPhoneData: this.props.country_code_with_flag });
			});
		}
	}

	functionGetData(value) {
		let lengthCountryCode = value.indexOf('-');
		let rowPhone = value.length;
		let countryCode = value.slice(0, lengthCountryCode);
		let phone = value.slice(lengthCountryCode + 1, rowPhone);
		let { data, response } = this.findCountryCode(countryCode);
		if (response && !isEmpty(data)) {
			this.setState({
				phone_number: phone,
				flag: data,
				country_code: data.calling_code
			});
		}
	}

	handleClick(event) {
		this.setState({ anchorEl: event.currentTarget });
	}

	handleClose() {
		this.setState({ anchorEl: null, allPhoneData: this.props.country_code_with_flag });
	}

	handleSelectFlag(data) {
		this.setState(
			{
				flag: data,
				phone_number: '',
				country_code: data.calling_code,
				errors: ''
			},
			() => {
				this.props.onChange(this.state.flag.calling_code, this.props.name);
				this.handleClose();
			}
		);
	}

	async setFlag() {
		await this.props.country_code_with_flag.find((country_code) => {
			let country_code_without_plus = country_code.calling_code.slice(1);
			if (country_code.calling_code == this.props.country_code) {
				this.setState({
					flag: country_code,
					phone_number: ''
				});
			} else if (country_code_without_plus == this.props.country_code) {
				this.setState({
					flag: country_code,
					phone_number: ''
				});
			}
		});
	}
	findCountryCode(e) {
		let response = false;
		let data = {};
		let copied = false;
		this.props.country_code_with_flag.find((country_code) => {
			let country_code_without_plus = country_code.calling_code.slice(1);

			if (country_code.calling_code == e) {
				data = country_code;
				response = true;
			} else if (country_code_without_plus == e) {
				data = country_code;
				response = true;
			} else if (e.indexOf(country_code.calling_code) == 0 || e.indexOf(country_code_without_plus) == 0) {
				data = country_code;
				response = true;
				copied = true;
			}
		});

		return { response, data, copied };
	}

	checkKey(e) {
		const keyCode = e.which || e.keyCode;
		const keyValue = String.fromCharCode(keyCode);
		if (keyValue !== '+' && keyValue !== '-' && (keyCode < 47 || keyCode > 58)) {
			e.preventDefault();
		}
	}

	handleOnChange(e) {
		let clean_phone = e.target.value.replace('(', '');
		clean_phone = clean_phone.replace(')', '');
		if (!isEmpty(clean_phone)) {
			clean_phone = clean_phone.replace(/\s/g, '');
		}

		let errors = '';
		let { country_code, phone_number } = this.state;
		let { name, length } = this.props;
		if (isEmpty(country_code)) {
			this.setState({ phone_number: clean_phone });
			this.props.onChange(clean_phone, name, errors);

			let { data, response, copied } = this.findCountryCode(clean_phone);

			if (response && !isEmpty(data) && copied) {
				let phone = clean_phone;
				if (phone.indexOf(data.calling_code) == 0) {
					phone = phone.replace(data.calling_code, '');
				} else if (phone.indexOf(data.calling_code.substr(1)) == 0) {
					phone = phone.replace(data.calling_code.substr(1), '');
				} else {
					phone = '';
				}

				this.setState({
					phone_number: phone,
					flag: data,
					country_code: data.calling_code,
					errors: ''
				});
				this.props.onChange(data.calling_code + '-' + phone, name, errors);
			} else if (response && !isEmpty(data)) {
				this.setState({
					phone_number: '',
					flag: data,
					country_code: data.calling_code,
					errors: ''
				});
				this.props.onChange(data.calling_code, name, errors);
			} else if (!response && isEmpty(data) && isEmpty(clean_phone)) {
				this.setState({
					errors: ''
				});
				this.props.onChange(phone_number, name, errors);
			} else if (!response && isEmpty(data) && !isEmpty(clean_phone) && copied == false) {
				errors = 'Country Code Invalid';
				if (phone_number.length < 3) {
					phone_number = '';
				}
				this.setState({ errors }, () => {
					this.props.onChange(phone_number, name, errors);
				});
			}
		} else if (!isEmpty(country_code)) {
			if (e.target.value == '(' + country_code + ')') {
				this.setFlag();
				this.setState({
					phone_number: '',
					country_code: '',
					errors: ''
				});
				this.props.onChange('', name, errors);
			} else {
				this.setState({ phone_number: e.target.value.replace('(' + country_code + ')-', '') });
				if (
					!validator.isLength(e.target.value.replace('(' + country_code + ')-', ''), {
						min: length
					})
				) {
					errors = this.props.name.replace('_', ' ') + ' minimum ' + this.props.length + ' characters';
					this.props.onChange(
						country_code + '-' + e.target.value.replace('(' + country_code + ')-', ''),
						name,
						errors
					);
					this.setState({
						errors: this.props.name.replace('_', ' ') + ' minimum ' + this.props.length + ' characters'
					});
				} else {
					this.props.onChange(
						country_code + '-' + e.target.value.replace('(' + country_code + ')-', ''),
						name,
						errors
					);
					this.setState({
						errors: ''
					});
				}
			}
		}
	}

	searchCountry(e) {
		this.setState({ keyword: e.target.value }, () => {
			let allPhoneData = this.props.country_code_with_flag.filter((country) => {
				return country.country.toLowerCase().indexOf(this.state.keyword) == 0;
			});
			if (isEmpty(allPhoneData)) {
				this.setState({
					allPhoneData: this.props.country_code_with_flag,
					countryNotFoundError: 'Country Not Found'
				});
			} else {
				this.setState({ allPhoneData, countryNotFoundError: '' });
			}
		});
	}

	render() {
		let { id, label, placeholder, margin, fullWidth, classes } = this.props;
		let { anchorEl, flag, errors, phone_number, country_code, countryNotFoundError } = this.state;

		return (
			<FormControl
				id={id ? id : 'phone-field'}
				margin={margin ? margin : 'normal'}
				fullWidth={fullWidth ? true : false}
				error={!isEmpty(errors) ? true : false}
			>
				<FormLabel className={classes.labelNormalSize}>{label}</FormLabel>

				{Boolean(anchorEl) && (
					<div>
						<Menu
							id="simple-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={this.handleClose}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							getContentAnchorEl={null}
							classes={{ paper: classes.menu }}
						>
							<div className={classes.searchBox}>
								<TextField
									id="search-country"
									name="search-country"
									value={this.state.keyword}
									placeholder="Search Country"
									autoFocus
									onChange={this.searchCountry}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Search />
											</InputAdornment>
										)
									}}
									fullWidth
									className={classes.countryList}
								/>
								{!isEmpty(countryNotFoundError) && (
									<FormHelperText className={classes.errorCountry}>
										{countryNotFoundError}
									</FormHelperText>
								)}
							</div>
							{this.state.allPhoneData.map((flag, index) => {
								return (
									<MenuItem
										onClick={() => this.handleSelectFlag(flag)}
										key={index}
										value={10}
										selected={flag === this.state.flag}
									>
										<img className={classes.svg} src={flag.flag_base64} /> {flag.country}{' '}
										{flag.calling_code}
									</MenuItem>
								);
							})}
						</Menu>
					</div>
				)}

				<TextField
					className={classes.input}
					placeholder={placeholder}
					onChange={this.handleOnChange}
					value={country_code ? '(' + country_code + ')-' + phone_number : phone_number}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<img onClick={this.handleClick} className={classes.flag} src={flag.flag_base64} />
							</InputAdornment>
						)
					}}
					onKeyPress={this.checkKey}
				/>

				{!isEmpty(errors) && <FormHelperText className={classes.capitalize}>{errors}</FormHelperText>}
			</FormControl>
		);
	}
}

PhoneNumberField.defaultProps = {
	length: 6,
	country_code: '+1'
};

PhoneNumberField.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	margin: PropTypes.string,
	fullWidth: PropTypes.bool,
	length: PropTypes.number,
	country_code: PropTypes.string,
	classes: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getCountryCodeWithFlag
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	phone_countries: state.options.phone_countries,
	country_code_with_flag: state.options.countryCodeWithFlag
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PhoneNumberField));
