import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '../../../../common/Alert';
import { getAPI, deleteAPI } from '../../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../../redux/actions/webActions';
import {
  setPolicyPermission, setToggleShareDialog,
  setToggleDeletePolicyDialog, setReloadPolicyByCategory,
  setToggleDeleteCategoryDialog
} from '../../../../redux/actions/policy/policyActions';
import Tree from './Tree';
import PDFViewer from '../../../../common/pdf-viewer/PDFViewer';
import ShareForm from '../ShareForm';
import isEmpty from '../../../../validations/common/isEmpty';

class TreeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      closeAll: false,
      firstLoad: true,
      isLoading: false
    }

    this.getCategory = this.getCategory.bind(this)
    this.deletePolicy = this.deletePolicy.bind(this)
    this.deleteCategory = this.deleteCategory.bind(this)
  }

  componentDidMount() {
    this.props.onRef(this);
    this.getCategory()
    this.props.setPolicyPermission()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.repoType !== this.props.repoType) {
      this.getCategory()
    }
  }

  getCategory() {
    this.setState({ firstLoad: false, isLoading: true }, () => {
      this.props.getAPI('/api/repository-category/tree-category-by-type/' + this.props.repoType)
      .then(res => {
        this.setState({ categories: res.data.data, isLoading: false })
      })
      .catch(err => {
        this.setState({ categories: [], isLoading: false })
      })
    })
  }

  deletePolicy() {
    this.props
			.deleteAPI('/api/repository/' + this.props.deletePolicyId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
        this.props.setReloadPolicyByCategory(this.props.deletePolicyCategoryId)
        this.props.setToggleDeletePolicyDialog()
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
  }

  deleteCategory() {
    this.props
			.deleteAPI('/api/repository-category/' + this.props.deleteCategoryId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});

				this.getCategory();
        this.props.setToggleDeleteCategoryDialog()
        // use the code below for reload the page, if there is long delay for two functions above
        // window.location.replace(window.location.pathname + window.location.search + window.location.hash)
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
  }

  render() {
    const { categories, firstLoad, isLoading } = this.state
    const { sharePolicyId, openShareDialog } = this.props

    return (
      <Card>
        <CardContent>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              {(firstLoad || isLoading) ? (
                <Typography align="center" variant="subtitle1">Loading categories...</Typography>
                ) : (
                  !isEmpty(categories) ? (
                    <Tree
                    categories={categories}
                    repoType={this.props.repoType}
                    />
                  ) : (
                    <Typography align="center" variant="subtitle1">No categories nor documents were found in this repository.</Typography>
                  )
              )}
            </Grid>
          </Grid>
        </CardContent>
        <PDFViewer bg="light" />
        <ShareForm
					isOpen={openShareDialog}
					documentID={sharePolicyId}
					onClose={this.props.setToggleShareDialog}
				/>
        <Alert
					isOpen={this.props.openDeletePolicyDialog}
					onClose={this.props.setToggleDeletePolicyDialog}
					onAgree={this.deletePolicy}
					title="Delete Confirmation"
					text={`Are you sure to delete document ${this.props.deletePolicyName} ?`}
					closeText="Cancel"
					AgreeText="Yes"
				/>
        <Alert
					isOpen={this.props.openDeleteCategoryDialog}
					onClose={this.props.setToggleDeletePolicyDialog}
					onAgree={this.deleteCategory}
					title="Delete Confirmation"
					text={`Are you sure to delete category : ${this.props.deleteCategoryName} ?`}
					closeText="Cancel"
					AgreeText="Yes"
				/>
      </Card>
    )
  }
}

TreeContainer.propTypes = {
  repoType: PropTypes.oneOf(['1','2','3','4','5',1,2,3,4,5]).isRequired,
  getAPI: PropTypes.func.isRequired,
  deleteAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  setPolicyPermission: PropTypes.func.isRequired,
  setToggleShareDialog: PropTypes.func.isRequired,
  setReloadPolicyByCategory: PropTypes.func.isRequired,
  setToggleDeleteCategoryDialog: PropTypes.func.isRequired,
  sharePolicyId: PropTypes.oneOfType([PropTypes.oneOf(['']), PropTypes.number]),
  openShareDialog: PropTypes.bool.isRequired,
  setToggleDeletePolicyDialog: PropTypes.func.isRequired,
  deletePolicyId: PropTypes.oneOfType([PropTypes.oneOf(['']), PropTypes.number]),
  deletePolicyCategoryId: PropTypes.oneOfType([PropTypes.oneOf(['']), PropTypes.number]),
  deletePolicyName: PropTypes.string,
  openDeletePolicyDialog: PropTypes.bool.isRequired,
  openDeleteCategoryDialog: PropTypes.bool.isRequired,
  deleteCategoryId: PropTypes.oneOfType([PropTypes.oneOf(['']), PropTypes.number]),
  deleteCategoryName: PropTypes.string
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  deleteAPI,
  addFlashMessage,
  setPolicyPermission,
  setToggleShareDialog,
  setToggleDeletePolicyDialog,
  setReloadPolicyByCategory,
  setToggleDeleteCategoryDialog
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  sharePolicyId: state.policy.sharePolicyId,
  openShareDialog: state.policy.openShareDialog,
  deletePolicyId: state.policy.deletePolicyId,
  deletePolicyCategoryId: state.policy.deletePolicyCategoryId,
  deletePolicyName: state.policy.deletePolicyName,
  openDeletePolicyDialog: state.policy.openDeletePolicyDialog,
  openDeleteCategoryDialog: state.policy.openDeleteCategoryDialog,
  deleteCategoryId: state.policy.deleteCategoryId,
  deleteCategoryName: state.policy.deleteCategoryName
})

export default connect(mapStateToProps, mapDispatchToProps)(TreeContainer);
