import React, { Component } from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
// import YesNoField from '../../common/formFields/YesNoField';
import PortfolioLists from "./portfolios/PortfolioLists";
import isEmpty from "../../validations/common/isEmpty";

import {
  onChangeForm7,
  checkError,
  setP11FormData,
  updateP11Status,
  setP11Status,
} from "../../redux/actions/p11Actions";
import { addFlashMessage } from "../../redux/actions/webActions";
import { validateP11Form7 } from "../../validations/p11";
import { getAPI } from "../../redux/actions/apiActions";
import LoadingSpinner from "../../common/LoadingSpinner";
import Skill from "../profileV2/parts/Skill";
const SkillLists = Loadable({
  loader: () => import("./skills/SkillLists"),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500, // 0.5 seconds
});

class P11Form7 extends Component {
  constructor(props) {
    super(props);

    this.switchOnChange = this.switchOnChange.bind(this);
    this.getP11 = this.getP11.bind(this);
    this.isValid = this.isValid.bind(this);
  }
  componentDidMount() {
    this.getP11();
  }

  getP11() {
    this.props
      .getAPI("/api/p11-profile-form-7")
      .then((res) => {
        this.child.props.getSkill(true);
        let { form7 } = this.props;
        Object.keys(res.data.data)
          .filter((key) => key in form7)
          .forEach((key) => (form7[key] = res.data.data[key]));
        if (!isEmpty(res.data.data.p11Status)) {
          this.props.setP11Status(JSON.parse(res.data.data.p11Status));
        }
        this.props.setP11FormData("form7", form7).then(() => this.isValid());
        // this.props.onChangeForm7('violation_of_law', res.data.data.violation_of_law);
        // this.props.onChangeForm7('portfolios_counts', res.data.data.portfolios_counts);
        // this.isValid();
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "Error while retrieving your data",
        });
      });
  }

  isValid() {
    let { errors, isValid } = validateP11Form7(this.props.form7);
    this.props.updateP11Status(7, isValid, this.props.p11Status);
    this.props.checkError(errors, isValid);
    return isValid;
  }

  async switchOnChange(e) {
    if (this.props.form7[e.target.name]) {
      await this.props.onChangeForm7(e.target.name, 0);
    } else {
      await this.props.onChangeForm7(e.target.name, 1);
    }
    await this.isValid();
  }

  render() {
    let { errors, form7 } = this.props;
    return (
      <Grid container spacing={24}>
        {/* <Grid item xs={12}>
					<YesNoField
						ariaLabel="violation_of_law"
						label="Have your ever been arrested, indicted, or summoned into court as a defendant in a criminal proceeding, or convicted, fined or imprisoned for the violation of any law (excluding minor traffic violations) ?"
						value={violation_of_law.toString()}
						onChange={this.switchOnChange}
						name="violation_of_law"
						error={errors.violation_of_law}
						margin="dense"
					/>
				</Grid> */}
        <Grid item xs={12}>
          <Skill 
              editable
              profileID={this.props.profileID}
              showSkills={true}
              onRef={(ref) => (this.child = ref)} 
          />
          <FormHelperText error  style={{fontSize: 14}}>{errors.skills}</FormHelperText>
        </Grid>
      </Grid>
    );
  }
}

P11Form7.propTypes = {
  getAPI: PropTypes.func.isRequired,
  checkError: PropTypes.func.isRequired,
  onChangeForm7: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  form7: PropTypes.object.isRequired,
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
  onChangeForm7,
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
  form7: state.p11.form7,
  errors: state.p11.errors,
  p11Status: state.p11.p11Status,
  profileID: state.auth.user.data.profile.id,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(P11Form7);
