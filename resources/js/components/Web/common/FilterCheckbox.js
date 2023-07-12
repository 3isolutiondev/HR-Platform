import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import isEmpty from '../validations/common/isEmpty';
import Search from '@material-ui/icons/Search';
import { pluck } from '../utils/helper';

/**
 * FilterCheckbox is component to shown searchable checkbox data for filter. It shows list of checkobox inside box with search input in the top of it.
 * It also can give more detail about data parameter using form in dialog box.
 *
 * In case usingDialog prop is true. You should also add Modal Component for the field in the parent component.
 *
 * Example:
 *  <FilterCheckbox
 *    name="chosen_language"
 *    label="Languages"
 *    options={language_lists}
 *    optionVariable="language_lists"
 *    optionDefaultVariable="languages"
 *    value={chosen_language}
 *    error={errors.chosen_language}
 *    filterCheckbox={filterCheckbox}
 *    keyword={search_language}
 *    search="search_language"
 *    searchOnChange={searchOnChange}
 *    searchLabel="Search Language"
 *    variableIsOpen="languageDialog"
 *    parameterVariable="languageParameters"
 *    usingDialog={true}
 *  />
 *  <LanguageModal
 *    isOpen={languageDialog}
 *    parameters={languageParameters}
 *    onClose={() => closeDialog('languageDialog')}
 *    setParameters={(parameters) =>
 *      setParameters('chosen_language', parameters, 'languageDialog')}
 *  />
 *
 * Permission: -
 *
 * @component
 * @name FilterCheckbox
 * @category Common
 * @subcategory Form Field
 * @example
 * return (
 *  <FilterCheckbox
 *    name="chosen_language"
 *    label="Languages"
 *    options={language_lists}
 *    optionVariable="language_lists"
 *    optionDefaultVariable="languages"
 *    value={chosen_language}
 *    error={errors.chosen_language}
 *    filterCheckbox={filterCheckbox}
 *    keyword={search_language}
 *    search="search_language"
 *    searchOnChange={searchOnChange}
 *    searchLabel="Search Language"
 *    variableIsOpen="languageDialog"
 *    parameterVariable="languageParameters"
 *    usingDialog={true}
 *  />
 * )
 *
 */
const FilterCheckbox = ({
	name,
	label,
	options,
	optionVariable,
	optionDefaultVariable,
	value,
	filterCheckbox,
	keyword,
	search,
	searchOnChange,
	searchLabel,
	error,
	autoHeight,
	variableIsOpen,
	parameterVariable,
	usingDialog,
	smallBox,
	classes
}) => {
	let chosen_data = pluck(value, 'id');

	return (
		<FormControl margin={smallBox ? 'dense' : 'normal'} fullWidth error={!isEmpty(error) ? true : false}>
			<FormLabel>{label}</FormLabel>
			<FormControl margin="normal" fullWidth className={classnames(classes.search, classes.noMarginBottom)}>
				<Input
					id={search}
					name={search}
					placeholder={searchLabel}
					value={keyword}
					onChange={(e) =>
						searchOnChange(e.target.name, e.target.value, optionVariable, optionDefaultVariable)}
					startAdornment={
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					}
				/>
			</FormControl>
			<div className={smallBox ? classes.smallContainer : !autoHeight ? classes.checkboxContainer : {}}>
				<FormGroup>
					{!isEmpty(options) &&
						(options.length > 0 ? (
							options.map((data, index) => {
								return (
									<FormControlLabel
										classes={{ label: classes.checkboxWithLabel }}
										color="primary"
										key={index}
										control={
											<Checkbox
												value={data.value.toString()}
												color="primary"
												name={name}
												className={classnames(classes.noPaddingBottom, classes.checkbox)}
												onChange={(e) =>
													filterCheckbox(
														e.target.name,
														e.target.value.toString(),
														variableIsOpen,
														e.target.checked,
														parameterVariable,
														usingDialog
													)}
												checked={chosen_data.indexOf(data.value.toString()) > -1 ? true : false}
											/>
										}
										label={data.label}
									/>
								);
							})
						) : (
							<Typography variant="subtitle1" color="secondary">
								No Record
							</Typography>
						))}
				</FormGroup>
				{!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
			</div>
		</FormControl>
	);
};

FilterCheckbox.defaultProps = {
	autoHeight: false,
	usingDialog: true,
	smallBox: false
};

FilterCheckbox.propTypes = {
  /**
   * name is string containing the name of the field (ex: "chosen_languages").
   */
  name: PropTypes.string.isRequired,
  /**
   * label is string to show the label of the field (ex: "Languages").
   */
  label: PropTypes.string.isRequired,
  /**
   * options is an array containing list of all the options that will be shown on the field.
   * (ex: [ {value: 11, label: Akan}, {value: 12, label: Albanian} ])
   */
  options: PropTypes.array.isRequired,
  /**
   * filterCheckbox is a function that will run when one of the checkbox is clicked (check or uncheck).
   */
  filterCheckbox: PropTypes.func.isRequired,
  /**
   * error is a string containing the an error text for this field
   */
	error: PropTypes.string,
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired,
  /**
   * autoHeight is a boolean value to show all the checkbox options or showing it partially by adding scroll bar to scroll the options
   */
  autoHeight: PropTypes.bool.isRequired,
  /**
   * optionVariable is a string value containing the name of the options data variable (ex: language_lists).
   * The language_lists variable will show the options data that need to be seen by the user, it can be filtered from the keyword that user put on the search box.
   */
  optionVariable: PropTypes.string.isRequired,
  /**
   * optionDefaultVariable is a string value containing the name of default options data variable. This name variable is the default / all options data that can
   * be shown to the user not affected by keyword filter from search box.
   */
  optionDefaultVariable: PropTypes.string.isRequired,
  /**
   * variableIsOpen is a string value that containing the name of variable that will open Dialog box related to this filter checkbox.
   * It's in the same file inside the parent of this component.
   * (See the parent component, ex: /resources/js/components/Web/pages/dashboard/CompletedProfiles/CompletedProfilesFilter.js)
   */
  variableIsOpen: PropTypes.string,
  /**
   * value of field that in the shape of array
   */
  value: PropTypes.array,
  /**
   * keyword is a string value that storing keyword used for filtering the checkbox list
   */
  keyword: PropTypes.string,
  /**
   * search is a string that containing field name of the input text that act as search input
   */
  search: PropTypes.string.isRequired,
  /**
   * searchOnChange is a function that run when the search input is being typed
   */
  searchOnChange: PropTypes.func.isRequired,
  /**
   * searchLabel is a string value that will be set as a placeholder on the search input
   */
  searchLabel: PropTypes.string.isRequired,
  /**
   * parameterVariable is a string that containing the name of the variable of the parameter for each option selected
   */
  parameterVariable: PropTypes.string.isRequired,
  /**
   * usingDialog is a boolean value that set this component to use dialog box for adding additional parameter
   */
  usingDialog: PropTypes.bool,
  /**
   * smallBox is a boolean value that set the style to use small container and dense margin or not
   */
  smallBox: PropTypes.bool
};

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	addSmallMarginTop: {
		'margin-top': '.75em'
	},
	noPaddingBottom: {
		'padding-bottom': '0'
	},
	noMarginBottom: {
		'margin-bottom': '0'
	},
	checkbox: {
		'&:hover': {
			cursor: 'pointer'
		}
	},
	search: {
		'margin-top': '8px'
	},
	checkboxContainer: {
		height: '195px',
		overflow: 'auto'
	},
	checkboxContainerAuto: {
		height: 'auto !important'
	},
	checkboxWithLabel: {
		'margin-top': '.75em'
	},
	smallContainer: {
		height: '75px',
		overflowY: 'scroll'
	}
});

export default withStyles(styles)(FilterCheckbox);
