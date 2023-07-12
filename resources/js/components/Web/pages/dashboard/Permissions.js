import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAPI, deleteAPI } from "../../redux/actions/apiActions";
import { addFlashMessage } from "../../redux/actions/webActions";
import MUIDataTable from "mui-datatables";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Btn from "../../common/Btn";
import CircleBtn from "../../common/CircleBtn";
import Alert from "../../common/Alert";
import { red, blue, purple, white, secondaryColor, primaryColor } from "../../config/colors";
import { withStyles } from "@material-ui/core/styles";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { can } from "../../permissions/can";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../config/general";
import Loadable from 'react-loadable';
import LoadingSpinner from '../../common/LoadingSpinner';

const Groups = Loadable({
  loader: () => import('./Groups/Groups'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

// import Button from '@material-ui/core/Button'
// import Fab from '@material-ui/core/Fab';
// import isEmpty from '../../validations/common/isEmpty';
// import RemoveRedEye from "@material-ui/icons/RemoveRedEye";
// import CircularProgress from '@material-ui/core/CircularProgress'
// import { Link } from 'react-router-dom';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
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
  tab: {
    borderBottom: "1px solid " + primaryColor,
    marginBottom: theme.spacing.unit * 2,
  }
});

class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: [],
      tabValue: 'permissions',
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
          if (can("Add Permission")) {
            return (
              <Btn
                link="/dashboard/permissions/add"
                btnText="Add New Permission"
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

        // 	const { permissions } = this.state;
        // 	deletedRows.forEach((rowData, index) => {
        // 		let userId = permissions[rowData.dataIndex][0];

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
      apiURL: "/api/permissions",
    };

    this.getData = this.getData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.dataToArray = this.dataToArray.bind(this);
  }

  componentDidMount() {
    if (this.props.match.path === '/dashboard/permissions') {
      this.getData()
    }
    if (this.props.match.path === '/dashboard/permissions/groups') {
      this.setState({ tabValue: 'groups' })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.path !== this.props.match.path) {
      this.setState({ tabValue: this.props.match.path === '/dashboard/permissions' ? 'permissions' : 'groups'}, () => {
        if (this.state.tabValue === 'permissions') this.getData()
      })
    }
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
          {/* {can('Show Permission') && (
						<CircleBtn
							link={'/dashboard/permissions/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
          {can("Edit Permission") && (
            <CircleBtn
              link={"/dashboard/permissions/" + data.id + "/edit"}
              color={classes.purple}
              size="small"
              icon={<Edit />}
            />
          )}
          {can("Delete Permission") && (
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

    this.setState({ permissions: dataInArray });
  }

  render() {
    let {
      permissions,
      columns,
      options,
      alertOpen,
      name,
      tabValue
    } = this.state;

    const { classes } = this.props;

    return (
      <div>
        <Helmet>
          <title>{APP_NAME + " - Dashboard > Permission List"}</title>
          <meta
            name="description"
            content={APP_NAME + " Dashboard > Permission List"}
          />
        </Helmet>
        <Tabs
          value={tabValue}
          onChange={(e, tabValue) => this.props.history.push(tabValue == 'permissions' ? '/dashboard/permissions' : '/dashboard/permissions/groups')}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tab}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Permissions" value="permissions" />
          <Tab label="Permission Groups" value="groups" />
        </Tabs>
        {tabValue == "permissions" ? (
          <div>
            <MUIDataTable
              title={"Permission List"}
              data={permissions}
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
              text={"Are you sure to delete permission : " + name + " ?"}
              closeText="Cancel"
              AgreeText="Yes"
            />
          </div>
        ) : (
          <Groups/>
        )}
      </div>
    );
  }
}

Permissions.propTypes = {
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
  )(Permissions)
);
