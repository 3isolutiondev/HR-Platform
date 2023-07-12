/** import React, react router dom and axios */
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';

/** import Redux related data */
import { connect } from 'react-redux';
import { store } from '../redux/store';
import { addFlashMessage } from '../redux/actions/webActions';
import { SET_CURRENT_USER } from '../redux/types/authTypes';

/**
 * isVerified is a function to check if the logged in user is verified user or not
 * @returns {boolean}
 */
export function isVerified() {
	return store.getState().auth.user.isVerified;
}

/**
 * Verified is a component to render page if the logged in user is verified user
 *
 * @name AllProfiles
 * @component
 * @category Permissions
 *
 */
class Verified extends Component {
	constructor(props) {
		super(props);
		this.checkVerified = this.checkVerified.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.checkVerified();
	}

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
	componentDidUpdate(prevProps) {
		if (this.props.isVerified != prevProps.isVerified) {
			this.checkVerified();
		}
	}

  /**
   * checkVerified is a function to call an api that check the current user is verified user or not
   * @returns {boolean}
   */
	checkVerified() {
		let { user, isVerified } = this.props;

		if (!isVerified) {
			axios
				.get('api/check-verified')
				.then((res) => {
					user.isVerified = res.data.data.isVerified;
					if (user.isVerified) {
						store.dispatch({
							type: SET_CURRENT_USER,
							user
						});

						return this.props.history.goBack();
					}
					return user.isVerified;
				})
				.catch((err) => {
          if (!isEmpty(error)) {
            if (!isEmpty(error.response)) {
              if (
                error.response.status === 401 ||
                error.response.data === "Unauthorized"
              ) {
                return false;
              }
            }
          }
					return isVerified;
				});
		} else {
			return isVerified;
		}
	}

	render() {
		let { isVerified, addFlashMessage, ...props } = this.props;

		if (isVerified) {
			return { ...props.children };
		}

		addFlashMessage({
			type: 'error',
			text: 'You should verified your email first'
		});

		return <Redirect to="/not-verified" />;
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	user: state.auth.user,
	isVerified: state.auth.user.isVerified
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Verified));
