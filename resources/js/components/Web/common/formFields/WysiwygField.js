import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import ReactQuill from 'react-quill';
import isEmpty from '../../validations/common/isEmpty';
import 'react-quill/dist/quill.snow.css';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	reactQuill: {
		width: '100%',
		marginTop: '0.5em',
		'& .ql-container': {
			height: 'auto !important',
			'min-height': '120px',
			'font-family': 'Barlow, sans-serif !important'
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
  ],
  clipboard: { matchVisual: false }
};

const modulesWithColor = {
	toolbar: [
		[ { header: [ 1, 2, 3, 4, 5, 6, false ] } ],
		[ 'bold', 'italic', 'underline' ],
		[ { list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' } ],
		[ 'clean' ],
		[ { color: [] }, { background: [] } ]
	]
};

const formats = [ 'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'indent', 'color' ];

const WysiwygField = ({ label, margin, name, value, error, onChange, classes, withColor }) => {
	const moduleColors = withColor ? modulesWithColor : modules;
	return (
		<FormControl margin={margin} fullWidth error={!isEmpty(error)}>
			<FormLabel>{label}</FormLabel>
			<ReactQuill
				value={value}
				name={name}
				theme="snow"
				modules={moduleColors}
				formats={formats}
				onChange={(value) => onChange({ target: { value: value, name: name } })}
				className={classes.reactQuill}
			/>
			{!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
		</FormControl>
	);
};

WysiwygField.defaultProps = {
	margin: 'normal'
};

WysiwygField.propTypes = {
	label: PropTypes.string.isRequired,
	margin: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	error: PropTypes.string
};

export default withStyles(styles)(WysiwygField);
