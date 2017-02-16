import React, { Component } from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/auth';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import onClickOutside from 'react-onclickoutside-decorator';
import { routeActions } from 'react-router-redux'
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

@connect(mapStateToProps, mapDispatchToProps)
@onClickOutside
export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }

    }

    dispatchNewRoute(route) {
        browserHistory.push(route)
        this.setState({
            open: false
        })

    }


    handleClickOutside(event) {
        this.setState({
            open: false
        })
    }


    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false
        })
    }

    openNav() {
        this.setState({
            open: true
        })
    }

    render() {
        return (
            <header>
                <Drawer open={this.state.open}>
                    {
                        !this.props.isAuthenticated ?
                            <div>
                                <MenuItem onClick={() => this.dispatchNewRoute('/login')}>
                                    Login
                                </MenuItem>
                                <MenuItem onClick={() => this.dispatchNewRoute('/register')}>
                                    Register
                                </MenuItem>
                            </div>
                            :
                            <div>
                                <MenuItem onClick={(e) =>  this.dispatchNewRoute('/transactions')}>
                                    Transactions
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={(e) => this.logout(e)}>
                                    Logout
                                </MenuItem>
                            </div>
                    }
                </Drawer>
                <AppBar
                    title="React-Redux-Flask"
                    onLeftIconButtonTouchTap={() => this.openNav()}
                    iconElementRight={

                    <FlatButton label="Home" onClick={() => this.dispatchNewRoute('/')} />
                    }
                />
            </header>

        );
    }
}
