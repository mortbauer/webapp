import React from 'react';
import {connect} from 'react-redux';
import {validate_token} from '../utils/http_functions'
import * as actionCreators from '../actions/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

function mapStateToProps(state) {
    return {
        token: state.getIn(['auth','token']),
        email: state.getIn(['auth','email']),
        isAuthenticated: state.getIn(['auth','isAuthenticated'])
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch)
};


export function requireAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth(nextProps);
        }

        checkAuth(props = this.props) {
            if (!props.isAuthenticated) {
                let token = localStorage.getItem('token')
                if (!token){
                    browserHistory.push('/home')
                } else {
                    this.props.validateAuth(token)
                }
            } 
        }

        render() {
            return (
                <div>
                    {this.props.isAuthenticated 
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )

        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);

}
