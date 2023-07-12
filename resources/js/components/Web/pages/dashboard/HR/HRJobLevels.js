import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAPI, deleteAPI } from "../../../redux/actions/apiActions";
import { addFlashMessage } from "../../../redux/actions/webActions";
import MUIDataTable from "mui-datatables";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";
import Delete from "@material-ui/icons/Delete";
import Btn from "../../../common/Btn";
import CircleBtn from "../../../common/CircleBtn";
import Alert from "../../../common/Alert";
import {
  red,
  blue,
  purple,
  white,
  secondaryColor,
} from "../../../config/colors";
import { withStyles } from "@material-ui/core/styles";
import { can } from "../../../permissions/can";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../config/general";

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

class HRJobLevels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hrJobLevels: [],
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
          name: "Action",
          options: {
            filter: false,
            sort: false,
          },
        },
      ],
      options: {
        responsive: "scroll",
        filterType: "checkbox",
        download: false,
        print: false,
        selectableRows: "none",
        customToolbar: () => {
          if (can("Add HR Job Level")) {
            return (
              <Btn
                link="/dashboard/hr-job-levels/add"
                btnText="Add New Job Level"
                btnStyle="contained"
                color="primary"
                size="small"
                icon={<Add />}
              />
            );
          }

          return false;
        },
        // onRowsDelete: (rows) => {
        // 	let deletedRows = rows.data;

        // 	const { roles } = this.state;
        // 	deletedRows.forEach((rowData, index) => {
        // 		let userId = roles[rowData.dataIndex][0];

        // 		this.props
        // 			.deleteAPI(this.state.apiURL + '/' + userId)
        // 			.then((res) => {
        // 				const { status, message } = res.data;
        // 				this.props.addFlashMessage({
        // 					type: status,
        // 					text: message
        // 				});
        // 			})
        // 			.catch((err) => {
        // 				this.props.addFlashMessage({
        // 					type: 'error',
        // 					text: 'There is an error while processing the delete request'
        // 				});
        // 			});
        // 	});

        // 	this.getData();
        // }
      },
      alertOpen: false,
      name: "",
      deleteId: 0,
      apiURL: "/api/hr-job-levels",
    };

    this.getData = this.getData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.dataToArray = this.dataToArray.bind(this);
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
      let dataTemp = [data.id, data.name];

      const actions = (
        <div className={classes.actions}>
          {/* {can('Show HR Job Level') && (
						<CircleBtn
							link={'/dashboard/hr-job-levels/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
          {can("Edit HR Job Level") && (
            <CircleBtn
              link={"/dashboard/hr-job-levels/" + data.id + "/edit"}
              color={classes.purple}
              size="small"
              icon={<Edit />}
            />
          )}
          {can("Delete HR Job Level") && (
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

    this.setState({ roles: dataInArray });
  }

  render() {
    let { roles, columns, options, alertOpen, name, deleteId } = this.state;
    return (
      <div>
        <Helmet>
          <title>{APP_NAME + " - Dashboard > Job Level List"}</title>
          <meta
            name="description"
            content={APP_NAME + " Dashboard > Job Level List"}
          />
        </Helmet>
        <MUIDataTable
          title={"Job Level List"}
          data={roles}
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
          text={"Are you sure to delete job level : " + name + " ?"}
          closeText="Cancel"
          AgreeText="Yes"
        />
      </div>
    );
  }
}

HRJobLevels.propTypes = {
  user: PropTypes.object.isRequired,
  getAPI: PropTypes.func.isRequired,
  deleteAPI: PropTypes.func.isRequired,
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
  addFlashMessage,
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HRJobLevels)
);
