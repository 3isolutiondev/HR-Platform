import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAPI, deleteAPI, postAPI } from "../../../redux/actions/apiActions";
import { addFlashMessage } from "../../../redux/actions/webActions";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
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
import SkillForm from "./SkillForm";
import { Typography } from "@material-ui/core";

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
  actions: {
    width: "144px",
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
  addMarginRight: {
    "margin-right": "8px",
  },
  rating: {
    display: "inline-block",
    "vertical-align": "super",
    "margin-left": ".25em",
  },
  ratingContainer: {
    width: "155px",
  },
});

class SkillLists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataId: "",
      openDialog: false,
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
          name: "Skill",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "Proficiency",
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
        rowsPerPage: 25,
        // responsive: 'scroll',
        customToolbar: () => {
          return (
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={this.props.classes.addMarginRight}
              onClick={this.dialogOpen}
            >
              <Add />
              Add Skill
            </Button>
          );
        },
        onRowsDelete: (rows) => {
          let deletedRows = rows.data;

          const { records } = this.state;
          deletedRows.forEach((rowData, index) => {
            let recordId = records[rowData.dataIndex][0];

            this.props
              .deleteAPI(this.state.apiURL + "/" + recordId)
              .then((res) => {
                const { status, message } = res.data;
                this.props.addFlashMessage({
                  type: status,
                  text: message,
                });
                this.props.getP11();
              })
              .catch((err) => {
                this.props.addFlashMessage({
                  type: "error",
                  text: "There is an error while processing the delete request",
                });
              });
          });

          this.getData();
        },
      },
      alertOpen: false,
      name: "",
      deleteId: 0,
      records: [],
      motherTongue: 0,
      apiURL: "/api/p11-skills",
      skills: []
    };

    this.getData = this.getData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.dataToArray = this.dataToArray.bind(this);
    this.dialogOpen = this.dialogOpen.bind(this);
    this.dialogClose = this.dialogClose.bind(this);
    this.dialogUpdate = this.dialogUpdate.bind(this);
  }

  componentDidMount() {
    this.getData();

    //reference event method from parent
    this.props.onRef(this);
  }

  getData() {
    this.props
      .getAPI(this.state.apiURL + "/lists")
      .then((res) => {
        this.dataToArray(res.data.data);
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while processing the requestss",
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
        this.setState({ deleteId: 0, alertOpen: false, name: "" });
        this.getData();
        this.props.checkValidation();
        this.props.getP11();
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
    let reformatSkills = [];

    let dataInArray = jsonData.map((data, index) => {
      let dataTemp = [data.id, data.skill.skill];
      let reformatSkill = {
          label: data.skill.skill,
          value: data.skill.id
      };

      reformatSkills.push(reformatSkill);

      let proficiency = [];

      if (data.proficiency == 0) {
        proficiency.push(
          <StarBorder key={"zero-rating-" + data.id} color="primary" />
        );
      } else {
        for (var i = 1; i <= parseInt(data.proficiency); i++) {
          proficiency.push(
            <Star key={"rating-" + i + "-" + data.id} color="primary" />
          );
        }
      }

      proficiency.push(
        <Typography key={"rating-text-" + data.id} className={classes.rating}>
          {"  " + data.proficiency + " / 5"}
        </Typography>
      );
      proficiency = (
        <div className={classes.ratingContainer}>{proficiency}</div>
      );

      dataTemp.push(proficiency);

      const actions = (
        <div className={classes.actions}>
          <CircleBtn
            onClick={() => this.dialogUpdate(data.id)}
            color={classes.purple}
            size="small"
            icon={<Edit />}
          />
          <CircleBtn
            color={classes.red}
            size="small"
            icon={<Delete />}
            onClick={() => {
              this.setState({
                deleteId: data.id,
                name: data.skill.skill,
                alertOpen: true,
              });
            }}
          />
        </div>
      );

      dataTemp.push(actions);

      return dataTemp;
    });

    this.setState({ records: dataInArray, skills : reformatSkills });
  }

  dialogOpen() {
    this.setState({ openDialog: true });
  }

  dialogClose() {
    this.setState({ openDialog: false, dataId: "" }, () =>
      this.props.checkValidation()
    );
  }

  dialogUpdate(id) {
    this.setState({ dataId: id }, () => this.dialogOpen());
  }

  render() {
    let {
      records,
      columns,
      options,
      alertOpen,
      name,
      dataId,
      openDialog,
      skills
    } = this.state;

    return (
      <div>
        <SkillForm
          isOpen={openDialog}
          recordId={dataId}
          title="Skill"
          onClose={this.dialogClose}
          updateList={this.getData}
          getP11={this.props.getP11}
          skills={skills}
        />
        <MUIDataTable
          title={"Skill List"}
          data={records}
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
          text={"Are you sure to delete your skill " + name + " ?"}
          closeText="Cancel"
          AgreeText="Yes"
        />
      </div>
    );
  }
}

SkillLists.propTypes = {
  user: PropTypes.object.isRequired,
  getAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
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
  postAPI,
  deleteAPI,
  addFlashMessage,
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SkillLists)
);
