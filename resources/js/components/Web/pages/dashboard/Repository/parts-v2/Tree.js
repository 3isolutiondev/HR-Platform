import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import isEmpty from '../../../../validations/common/isEmpty';
import Branch from './Branch';

class Tree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: {}
    }

    this.expandCategory = this.expandCategory.bind(this)
  }

  expandCategory(categoryId) {
    this.setState({ open: {
      ...this.state.open,
      [categoryId]: (!this.state.open[categoryId]) ? true : false
    }})
  }

  render() {
    const { categories } = this.props;
    const level = this.props.level || 0;

    return(
      <div style={{ marginLeft: level == 0 ? 0 : 24 }}>
        {!isEmpty(categories) && categories.map((category) => (
          <div key={`cat-${category.id}`}>
            <Branch
              category={category}
              expandCategory={this.expandCategory}
              parentId={category.id}
              repoType={this.props.repoType}
            />
            {!isEmpty(category.children) && (
              <Collapse in={this.state.open[category.id]} timeout="auto" unmountOnExit style={{ display: 'block' }}>
                <Tree categories={category.children} level={level+1} prevDepth={category.depth} repoType={this.props.repoType}/>
              </Collapse>
            )}
          </div>
        ))}
      </div>
    )
  }
}

Tree.defaultProps = {
  level: 0,
  categories: []
}

Tree.propTypes = {
  categories: PropTypes.array.isRequired,
  level: PropTypes.number,
  repoType: PropTypes.oneOf([1,2,3,4,5,'1','2','3','4','5'])
}

export default Tree
