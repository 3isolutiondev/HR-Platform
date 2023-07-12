import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MUIDataTable from "mui-datatables"
import Button from '@material-ui/core/Button'
import PlaceIcon from '@material-ui/icons/Place'
import Btn from '../../../common/Btn'
import { getAPI } from '../../../redux/actions/apiActions'
import { addFlashMessage } from '../../../redux/actions/webActions'
import { Helmet } from "react-helmet"
import { APP_NAME } from "../../../config/general"

class RiskLocations extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: [],
      columns: [
        {
          name: "id",
          options: {
            display: "excluded",
            filter: false,
            sort: false
          }
        },
        {
          name: "Name",
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: "High Risk",
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: "Actions",
          options: {
            filter: false,
            sort: false
          }
        }
      ],
      loadingText: 'Loading Super Human Profiles...',
      emptyDataText: 'Sorry, No User Data can be found',
      firstLoaded: false,
      isLoading: false
    }

    this.getData = this.getData.bind(this)
    this.dataToArray = this.dataToArray.bind(this)
  }

  componentDidMount() {
    this.getData(true)
  }

  getData(firstTime = false) {
    this.props
    .getAPI('/api/security-module/risk-locations/countries')
    .then(res => {
      this.dataToArray(res.data.data, firstTime);
    })
    .catch(err => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'There is an error while processing the request'
      });
    })
  }

  dataToArray(jsonData, firstTime = false) {
    let dataInArray = jsonData.map((data) => {
      let dataTemp = [
        data.id,
        data.name,
        (data.is_high_risk == 0 && data.high_risk_cities_count == 0) ? 'No' : 'Yes'
      ];

      const actions = (
        <div>
          <Btn
            link={"/dashboard/risk-locations/" + data.id + '/edit'}
            btnText="Setup"
            btnStyle="contained"
            color="primary"
            size="small"
            icon={<PlaceIcon />}
          />
        </div>
      );

      dataTemp.push(actions);

      return dataTemp;
    });

    if (firstTime) {
      this.setState({ countries: dataInArray, firstLoaded: true, isLoading: false });
    } else {
      this.setState({ countries: dataInArray, isLoading: false });
    }
  }

  render() {
    const { countries, columns, firstLoaded, loadingText, isLoading, emptyDataText } = this.state

    const options = {
      responsive: 'scroll',
      filterType: 'dropdown',
      download: false,
      print: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: (firstLoaded === false) ? loadingText : (isLoading) ? loadingText : emptyDataText
        }
      }
    }

    return(
      <div>
        <Helmet>
          <title>{APP_NAME + " - Dashboard > Risk Locations"}</title>
          <meta
            name="description"
            content={APP_NAME + " Dashboard > Risk Locations"}
          />
        </Helmet>
        <MUIDataTable
          title={"Risk Locations"}
          data={countries}
          columns={columns}
          options={options}
          download={false}
          print={false}
        />
      </div>
    )
  }
}

RiskLocations.propTypes = {
  addFlashMessage: PropTypes.func.isRequired,
  getAPI: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  addFlashMessage,
  getAPI
}

export default connect('', mapDispatchToProps)(RiskLocations)
