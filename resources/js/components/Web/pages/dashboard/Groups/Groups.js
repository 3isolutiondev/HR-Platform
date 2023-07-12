import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAPI , deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from "../../../redux/actions/webActions";
import MUIDataTable from "mui-datatables";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Btn from "../../../common/Btn";
import CircleBtn from "../../../common/CircleBtn";
import Alert from "../../../common/Alert";
import { red, purple, white, secondaryColor } from "../../../config/colors";
import { withStyles } from "@material-ui/core/styles";
import { can } from "../../../permissions/can";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../config/general";
import isEmpty from '../../../validations/common/isEmpty';

class Groups extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: [],
      loadingText: 'Loading...',
      deleteId: '',
      deleteName: '',
      alertOpen: false
    }

    this.getData = this.getData.bind(this)
    this.deleteData = this.deleteData.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.props.getAPI('/api/groups').then(res => {
      const { classes } = this.props
      const dataToArray = res.data.data.map((data, index) => {
        let dataTemp = [data.id, data.name];
        const actions = (
          <div>
            {can("Edit Permission|Edit Role|Set as Admin") && (
              <CircleBtn
                link={"/dashboard/permissions/groups/" + data.id + "/edit"}
                color={classes.purple}
                size="small"
                icon={<Edit />}
              />
            )}
            {can("Delete Permission|Delete Role|Set as Admin") && (
              <CircleBtn
                color={classes.red}
                size="small"
                icon={<Delete />}
                onClick={() => {
                  this.setState({
                    deleteId: data.id,
                    deleteName: data.name,
                    alertOpen: true,
                  });
                }}
              />
            )}
          </div>
        )
        dataTemp.push(actions);
        return dataTemp;
      })
      this.setState({ groups: dataToArray, loadingText: isEmpty(res.data.data) ? 'Sorry, data not found' : 'Loading...' })
    }).catch(err => this.setState({ groups: [], loadingText: 'Loading...' }))
  }

  deleteData() {
    this.props
      .deleteAPI('/api/groups/' + this.state.deleteId)
      .then((res) => {
        const { status, message } = res.data;
        this.props.addFlashMessage({
          type: status,
          text: message,
        });
        this.setState({ deleteId: '', alertOpen: false, deleteName: "" }, () =>
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

  render() {
    const { loadingText, groups, alertOpen, deleteName } = this.state
    const columns = [
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
      }
    ]

    const options = {
      responsive: "scroll",
      filterType: "checkbox",
      download: false,
      print: false,
      selectableRows: "none",
      customToolbar: () => {
        if (can("Add Permission|Add Role|Set as Admin")) {
          return (
            <Btn
              link="/dashboard/permissions/groups/add"
              btnText="Add New Group"
              btnStyle="contained"
              color="primary"
              size="small"
              icon={<Add />}
            />
          );
        }

        return false;
      },
      textLabels: {
        body: {
          noMatch: loadingText
        }
      }
    }

    return (
      <div>
        <Helmet>
          <title>{APP_NAME + " - Dashboard > Group List"}</title>
          <meta
            name="description"
            content={APP_NAME + " Dashboard > Group List"}
          />
        </Helmet>
        <MUIDataTable
          title={"Group List"}
          data={groups}
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
          text={"Are you sure to delete group : " + deleteName + " ?"}
          closeText="Cancel"
          AgreeText="Yes"
        />
      </div>
    )
  }
}

Groups.propTypes = {
  classes: PropTypes.object.isRequired,
  getAPI: PropTypes.func.isRequired,
  deleteAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI, deleteAPI, addFlashMessage
}

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
  red: {
    "background-color": red,
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
})

export default withStyles(styles)(connect('', mapDispatchToProps)(Groups));
