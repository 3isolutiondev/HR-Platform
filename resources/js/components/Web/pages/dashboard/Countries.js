import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAPI, deleteAPI, postAPI } from "../../redux/actions/apiActions";
import { addFlashMessage } from "../../redux/actions/webActions";
import MUIDataTable from "mui-datatables";
import isEmpty from "../../validations/common/isEmpty";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Checkbox from "@material-ui/core/Checkbox";
import Btn from "../../common/Btn";
import CircleBtn from "../../common/CircleBtn";
import Alert from "../../common/Alert";
import { red, blue, purple, white, secondaryColor } from "../../config/colors";
import { withStyles } from "@material-ui/core/styles";
import { can } from "../../permissions/can";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../config/general";

// import Button from '@material-ui/core/Button'
// import Fab from '@material-ui/core/Fab';
// import CircularProgress from '@material-ui/core/CircularProgress'
// import { Link } from 'react-router-dom';
// import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
  actions: {
    width: 144,
  },
  red: {
    "background-color": red,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  },
  blue: {
    "background-color": blue,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  },
  purple: {
    "background-color": purple,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  },
});

class Countries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      columns: [
        {
          name: "id",
          options: {
            display: "excluded",
            filter: false,
            sort: false,
          },
        },
        {
          name: "Name",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "Country Code",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "Phone Code",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "Nationality",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "Seen in P11",
          options: {
            filter: false,
            sort: false,
          },
        },
        //Adding a new column Seen in Security Module
        {
        name: "Seen in Security Module",
          options: {
            filter: false,
            sort: false,
          },
        },
        {
        name: "Vehicle Filled by iMMAPer",
          options: {
            filter: false,
            sort: false,
          },
        },
        {
          name: "Flag",
          options: {
            filter: false,
            sort: false,
          },
        },
        {
          name: "Action",
          options: {
            filter: false,
            sort: false,
          },
        },
      ],
      options: {
        responsive: "scroll",
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 15, 100],
        filterType: "checkbox",
        download: false,
        print: false,
        selectableRows: "none",
        customToolbar: () => {
          if (can("Add Country")) {
            return (
              <Btn
                link="/dashboard/countries/add"
                btnText="Add New Country"
                btnStyle="contained"
                color="primary"
                size="small"
                icon={<Add />}
              />
            );
          }

          return false;
        }
      },
      alertOpen: false,
      name: "",
      deleteId: 0,
      apiURL: "/api/countries",
    };
    this.setSeenInSecurityModule = this.setSeenInSecurityModule.bind(this);
    this.setSeenInP11 = this.setSeenInP11.bind(this);
    this.getData = this.getData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.dataToArray = this.dataToArray.bind(this);
    this.setVehicleFilledByImmaper = this.setVehicleFilledByImmaper.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.props
      .getAPI(this.state.apiURL)
      .then((res) => {
        this.dataToArray(res.data.data);
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while processing the request",
        });
      });
  }

  deleteData() {
    this.props
      .deleteAPI(this.state.apiURL + "/" + this.state.deleteId)
      .then((res) => {
        const { status, message } = res.data;
        this.props.addFlashMessage({
          type: status,
          text: message,
        });
        this.setState({ deleteId: 0, alertOpen: false, full_name: "" }, () =>
          this.getData()
        );
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while processing the delete request",
        });
      });
  }

  dataToArray(jsonData) {
    const { classes } = this.props;
    let dataInArray = jsonData.map((data, index) => {
      let dataTemp = [
        data.id,
        data.name,
        data.country_code,
        data.phone_code,
        data.nationality,
      ];

      const setSeenInP11 = (
        <div>
          <Checkbox
            checked={data.seen_in_p11 === 1 ? true : false}
            onChange={(e) => this.setSeenInP11(data.id, e)}
            value={data.id.toString()}
            color="primary"
          />
        </div>
      );

      dataTemp.push(setSeenInP11);
      /* define checkbox for security module     */
      const setSeenInSecurityModule = (
        <div>
          <Checkbox
            checked={data.seen_in_security_module === 1 ? true : false}
            onChange={(e) => this.setSeenInSecurityModule(data.id, e)}
            value={data.id.toString()}
            color="primary"
          />
        </div>
      );

      dataTemp.push(setSeenInSecurityModule);

      const vehicle_filled_by_immaper = (
        <div>
          <Checkbox
            checked={data.vehicle_filled_by_immaper === 'yes' ? true : false}
            onChange={(e) => this.setVehicleFilledByImmaper(data.id, e)}
            value={data.id.toString()}
            color="primary"
          />
        </div>
      );

      dataTemp.push(vehicle_filled_by_immaper);

      if (!isEmpty(data.flag)) {
        const flag = <img src={data.flag} height="25" width="35" />;

        dataTemp.push(flag);
      } else {
        const empty = <div />;
        dataTemp.push(empty);
      }
      const actions = (
        <div className={classes.actions}>
          {/* {can('Show Country') && (
						<CircleBtn
							link={'/dashboard/countries/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
          {can("Edit Country") && (
            <CircleBtn
              link={"/dashboard/countries/" + data.id + "/edit"}
              color={classes.purple}
              size="small"
              icon={<Edit />}
            />
          )}
          {can("Delete Country") && (
            <CircleBtn
              color={classes.red}
              size="small"
              icon={<Delete />}
              onClick={() => {
                this.setState({
                  deleteId: data.id,
                  name: data.name,
                  alertOpen: true,
                });
              }}
            />
          )}
        </div>
      );

      dataTemp.push(actions);

      return dataTemp;
    });

    this.setState({ countries: dataInArray });
  }

  setSeenInP11(id, e) {
    this.props
      .postAPI(this.state.apiURL + "/set-seen-in-p11", {
        id: id,
        _method: "PUT",
      })
      .then((res) => {
        this.getData();
        this.props.addFlashMessage({
          type: "success",
          text: "Seen in p11 successfully updated",
        });
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while updating seen in p11",
        });
      });
  }
  /* Define setSeenInSecurityModule */
  setSeenInSecurityModule(id, e) {
    this.props
      .postAPI(this.state.apiURL + "/set-seen-in-security-module", {
        id: id,
        _method: "PUT",
      })
      .then((res) => {
        this.getData();
        this.props.addFlashMessage({
          type: "success",
          text: "Seen in security module successfully updated",
        });
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while updating seen in security module ",
        });
      });
  }

  setVehicleFilledByImmaper(id) {
    this.props
      .postAPI(`${this.state.apiURL}/set-vehicle-filled-by-immaper`, {
        id: id,
        _method: "PUT",
      })
      .then((res) => {
        this.getData();
        this.props.addFlashMessage({
          type: "success",
          text: "Vehicle filled by iMMAPer successfully updated",
        });
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while updating vehicle filled by iMMAPer",
        });
      });
  }

  render() {
    let { countries, columns, options, alertOpen, name, deleteId } = this.state;

    return (
      <div>
        <Helmet>
          <title>{APP_NAME + " - Dashboard > Country List"}</title>
          <meta
            name="description"
            content={APP_NAME + " Dashboard > Country List"}
          />
        </Helmet>
        <MUIDataTable
          title={"Country List"}
          data={countries}
          columns={columns}
          options={options}
          download={false}
          print={false}
        />
        <Alert
          isOpen={alertOpen}
          onClose={() => {
            this.setState({ alertOpen: false });
          }}
          onAgree={() => {
            this.deleteData();
          }}
          title="Delete Warning"
          text={"Are you sure to delete country : " + name + " ?"}
          closeText="Cancel"
          AgreeText="Yes"
        />
      </div>
    );
  }
}

Countries.propTypes = {
  user: PropTypes.object.isRequired,
  getAPI: PropTypes.func.isRequired,
  deleteAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  user: state.auth.user,
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  deleteAPI,
  postAPI,
  addFlashMessage,
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Countries)
);
