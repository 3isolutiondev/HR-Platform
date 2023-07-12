import React from 'react';
import classname from 'classnames';
import SelectSearch from 'react-select';
// import CreateableSelect from 'react-select/creatable';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from '../../../validations/common/isEmpty';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { lightText } from '../../../config/colors';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		flexGrow: 1,
		height: 250
	},
	input: {
		display: 'flex',
		padding: 0
	},
	disabled: {
		color: lightText
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		alignItems: 'center',
		overflow: 'hidden'
	},
	chip: {
		margin: `${theme.spacing.unit}px ${theme.spacing.unit / 4}px`
	},
	chipFocused: {
		backgroundColor: emphasize(
			theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
			0.08
		)
	},
	noOptionsMessage: {
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
	},
	addedValue: {
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
		background: '#D6DBDF',
		color: '#000000',
		cursor: 'pointer'
	},
	icons: {
		'&:hover': {
			backgroundColor: '#D6DBDF'
		},
		'text-transform': 'capitalize'
	},

	singleValue: {
		fontSize: 16
	},
	placeholder: {
		position: 'absolute',
		left: 2,
		fontSize: 16
	},
	// paper: {
	// 	position: 'absolute',
	// 	zIndex: 111111,
	// 	marginTop: theme.spacing.unit,
	// 	left: 0,
	// 	right: 0,
	// 	background: 'white'
	// },
	paper: {
		position: 'absolute',
		zIndex: 111111,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0,
		background: 'white'
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	selectSearch: {
		input: (base) => ({
			...base,
			color: theme.palette.text.primary,
			'& input': {
				font: 'inherit'
			}
		})
	},
	extraMargin: {
		marginTop: theme.spacing.unit * 3
	},
	input: {
		height: 'auto',
		display: 'flex',
		padding: '0'
	},
	clearNormal: {
		position: 'absolute',
		right: '2.25em',
		color: 'hsl(0,0%,80%)',
		cursor: 'pointer',
		'&:hover': {
			borderBottom: '1px solid ' + lightText,
			color: lightText
		}
	},
	loading: {
		position: 'absolute',
		right: '3em'
	}
});

function NoOptionsMessage(props) {
	return (
		<Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
			{props.children}
		</Typography>
	);
}
function AddedValue(props) {
	return (
		<Typography
			onClick={props.selectProps.handleAddMore}
			color="textSecondary"
			className={props.selectProps.classes.addedValue}
			{...props.innerProps}
		>
			<Button className={props.selectProps.classes.icons}>
				<PlaylistAdd style={{ paddingRight: '3px' }} />
				Add More {props.selectProps.name}
			</Button>
		</Typography>
	);
}

function inputComponent({ inputRef, ...props }) {
	return <div ref={inputRef} {...props} />;
}

function Control(props) {
	return (
		<TextField
			fullWidth
			inputProps={{
				className: props.selectProps.extraMargin ? props.selectProps.classes.extraMargin : ''
			}}
			InputProps={{
				inputComponent,
				inputProps: {
					className: props.selectProps.classes.input,
					inputRef: props.innerRef,
					children: props.children,
					...props.innerProps
				}
			}}
			{...props.selectProps.textFieldProps}
		/>
	);
}

function Option(props) {
	return (
		<MenuItem
			buttonRef={props.innerRef}
			selected={props.isFocused}
			component="div"
			style={{
				fontWeight: props.isSelected ? 500 : 400
			}}
			{...props.innerProps}
		>
			{props.selectProps.beforeOptionText ? props.selectProps.beforeOptionText : ''}
			{props.children}
		</MenuItem>
	);
}

function Placeholder(props) {
	return (
		<Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
			{props.children}
		</Typography>
	);
}

function SingleValue(props) {
	return (
		<Typography
			className={
				props.selectProps.isDisabled ? (
					classname(props.selectProps.classes.singleValue, props.selectProps.classes.disabled)
				) : (
					props.selectProps.classes.singleValue
				)
			}
			{...props.innerProps}
		>
			{props.children}
		</Typography>
	);
}

function ValueContainer(props) {
	return (
		<div className={props.selectProps.classes.valueContainer}>
			{props.children}{' '}
			{props.selectProps.showLoading && (
				<CircularProgress
					color="primary"
					thickness={4}
					size={20}
					className={props.selectProps.classes.loading}
				/>
			)}
			{props.selectProps.clearable &&
			!props.selectProps.showLoading && (
				<Close
					fontSize="small"
					onClick={props.selectProps.onClear}
					className={
						props.selectProps.showLoading ? (
							props.selectProps.classes.clearExtra
						) : (
							props.selectProps.classes.clearNormal
						)
					}
				/>
			)}
		</div>
	);
}

// function MultiValue(props, onDeleteManager) {
// 	return (
// 		<Chip
// 			// key={props.children}
// 			color="primary"
// 			tabIndex={-1}
// 			label={props.children}
// 			className={classname(props.selectProps.classes.chip, {
// 				[props.selectProps.classes.chipFocused]: props.isFocused
// 			})}
// 			// onDelete={props.removeProps.onClick}
// 			onDelete={(chips) => {
// 				props.removeProps.onClick();
// 				console.log(onDeleteManager)
// 				// onDeleteManager();
// 				// this.props.onDelete();
// 			}}
// 			deleteIcon={<CancelIcon {...props.removeProps} />}
// 		/>
// 	);
// }

function Menu(props) {
	return (
		<Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
			{props.children}
		</Paper>
	);
}

const SelectField = ({
	label,
	margin,
	classes,
	options,
	value,
	placeholder,
	isMulti,
	name,
	beforeOptionText,
	fullWidth,
	onChange,
	error,
	required,
	isDisabled,
	added,
	handleAddMore,
	showLoading,
	extraMargin,
	onClear,
	clearable,
	onDeleteManager, obj
}) => {

	function MultiValue(props) {
		return (
			<Chip
				// key={props.children}
				color="primary"
				tabIndex={-1}
				label={props.children}
				className={classname(props.selectProps.classes.chip, {
					[props.selectProps.classes.chipFocused]: props.isFocused
				})}
				onDelete={() => {
					props.removeProps.onClick();

					onDeleteManager(props, obj);

				}}
				// onDelete={props.removeProps.onClick}
				deleteIcon={<CancelIcon {...props.removeProps} />}
			/>
		);
	}

	return (
		<FormControl margin={margin ? margin : 'normal'} fullWidth error={!isEmpty(error)}>
			<SelectSearch
				classes={classes}
				styles={classes.selectSearch}
				textFieldProps={{
					label: label == 'undefined' ? false : label,
					InputLabelProps: {
						shrink: true
					},
					error: !isEmpty(error)
				}}
				beforeOptionText={beforeOptionText ? beforeOptionText : ''}
				options={options}
				components={{
					Control,
					Menu,
					MultiValue,
					NoOptionsMessage: added ? AddedValue : NoOptionsMessage,
					Option,
					Placeholder,
					SingleValue,
					ValueContainer
				}}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				isMulti={isMulti}
				name={name}
				required={required}
				fullWidth={fullWidth ? fullWidth : false}
				// isDisabled={true}
				isDisabled={isDisabled ? isDisabled : false}
				handleAddMore={handleAddMore}
				showLoading={showLoading ? showLoading : false}
				extraMargin={extraMargin}
				clearable={clearable}
				onClear={onClear}
				// onDeleteManager={onDeleteManager}
			/>

			{!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
		</FormControl>
	);
};


SelectField.defaultProps = {
	extraMargin: false,
	isDisabled: false,
	clearable: false
};

export default withStyles(styles)(SelectField);
