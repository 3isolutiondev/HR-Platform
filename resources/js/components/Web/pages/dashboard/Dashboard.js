import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Helmet } from "react-helmet";
import { Pie } from "react-chartjs-2";
import { getAPI } from "../../redux/actions/apiActions";
import { addFlashMessage } from "../../redux/actions/webActions";
import { APP_NAME } from "../../config/general";

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
  centered: {
    margin: "auto",
    width: "40%",
  },
  textCenter: {
    textAlign: "center",
    marginTop: "45px",
    marginBottom: "45px",
  },
});
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      total: 0,
    };
  }
  componentDidMount() {
    this.props
      .getAPI("/api/users-statistic-p11-complete")
      .then((res) => {
        this.setState({ data: res.data.data, total: res.data.data.total });
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while retrieving your data",
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Helmet>
          <title>{APP_NAME + " - Dashboard"}</title>
          <meta name="description" content={APP_NAME + " Dashboard"} />
        </Helmet>{" "}
        <Grid container spacing={16}>
          <Grid item xs={12} sm={12}>
            <div className={classes.centered}>
              <Pie data={this.state.data} />
              <Typography
                variant="h5"
                gutterBottom
                className={classes.textCenter}
              >
                Profile Statistic
              </Typography>
            </div>
          </Grid>
          {/* <Grid item xs={6} sm={6}>
						<Pie data={data} />
					</Grid> */}
        </Grid>
      </div>
    );
  }
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  addFlashMessage,
};

export default withStyles(styles)(
  connect(
    "",
    mapDispatchToProps
  )(Dashboard)
);
