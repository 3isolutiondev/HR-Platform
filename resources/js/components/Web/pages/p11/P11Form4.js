import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import UniversityLists from "./universities/UniversityLists";
import isEmpty from "../../validations/common/isEmpty";
import SchoolLists from "./schools/SchoolLists";
import { connect } from "react-redux";
import {
  onChangeForm4,
  checkError,
  setP11FormData,
  setP11Status,
  updateP11Status,
} from "../../redux/actions/p11Actions";
import { addFlashMessage } from "../../redux/actions/webActions";
import { validateP11Form4 } from "../../validations/p11";
import { getAPI } from "../../redux/actions/apiActions";

class P11Form4 extends Component {
  constructor(props) {
    super(props);
    this.getP11 = this.getP11.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  componentDidMount() {
    this.getP11();
  }
  getP11() {
    this.props
      .getAPI("/api/p11-profile-form-4")
      .then((res) => {
        let { form4 } = this.props;
        Object.keys(res.data.data)
          .filter((key) => key in form4)
          .forEach((key) => (form4[key] = res.data.data[key]));
        if (!isEmpty(res.data.data.p11Status)) {
          this.props.setP11Status(JSON.parse(res.data.data.p11Status));
        }
        this.props.setP11FormData("form4", form4).then(() => this.isValid());
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while retrieving your data",
        });
      });
  }
  isValid() {
    let { errors, isValid } = validateP11Form4(this.props.form4);
    this.props.updateP11Status(4, isValid, this.props.p11Status);
    this.props.checkError(errors, isValid);
    return isValid;
  }

  render() {
    let {
      education_universities_counts,
      education_schools_counts,
    } = this.props.form4;
    let { countries, errors } = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <FormControl
            margin="none"
            fullWidth
            error={
              !isEmpty(errors.education_universities_counts) ? true : false
            }
          >
            {/* <FormLabel>
							<b>Education (University or Equivalent)</b> Give full details - N.B. Please give exact
							titles of degrees in original language. Please do not translate or equate to other degrees.
						</FormLabel> */}
            <br />
            <UniversityLists
              checkValidation={this.isValid}
              getP11={this.getP11}
              countries={countries}
            />
            {(!isEmpty(errors.education_universities_counts) ||
              education_universities_counts < 1) ? (
              <FormHelperText>
                {errors.education_universities_counts}
              </FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            margin="none"
            fullWidth
            error={!isEmpty(errors.education_schools_counts) ? true : false}
          >
            {/* <FormLabel>
							<b>Formal trainings & workshops</b>
						</FormLabel> */}
            <br />
            <SchoolLists
              checkValidation={this.isValid}
              getP11={this.getP11}
              countries={countries}
            />
            {(!isEmpty(errors.education_schools_counts) ||
              education_schools_counts < 1) ? (
              <FormHelperText>{errors.education_schools_counts}</FormHelperText>
            ) : null}
          </FormControl>
          <br />
          <br />
        </Grid>
      </Grid>
    );
  }
}

P11Form4.propTypes = {
  getAPI: PropTypes.func.isRequired,
  checkError: PropTypes.func.isRequired,
  onChangeForm4: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  form4: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  checkError,
  onChangeForm4,
  addFlashMessage,
  setP11FormData,
  setP11Status,
  updateP11Status,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  form4: state.p11.form4,
  countries: state.options.countries,
  errors: state.p11.errors,
  p11Status: state.p11.p11Status,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(P11Form4);
