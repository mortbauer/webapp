import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import {validateEmail} from '../utils/misc'

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        statusText: state.auth.registerStatusText
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch)
};

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

@connect(mapStateToProps, mapDispatchToProps)
export default class RegisterView extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/login';
        this.state = {
            email: '',
            password: '',
            email_error_text: null,
            password_error_text: null,
            redirectTo: redirectRoute,
            disabled: true
        };
    }

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

        if (this.state.email === "") {
            this.setState({
                email_error_text: null
            })
        } else {

            if (validateEmail(this.state.email)) {
                email_is_valid = true
                this.setState({
                    email_error_text: null
                })

            } else {
                this.setState({
                    email_error_text: "Sorry, this is not a valid email"
                })
            }
        }

        if (this.state.password === "" || !this.state.password) {
            this.setState({
                password_error_text: null
            })
        } else {

            if (this.state.password.length >= 6) {
                password_is_valid = true;
                this.setState({
                    password_error_text: null
                })
            } else {
                this.setState({
                    password_error_text: "Your password must be at least 6 characters"
                })

            }
        }

        if (email_is_valid && password_is_valid) {
            this.setState({
                disabled: false
            })
        }

    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled()
        })
    }

    login(e) {
        e.preventDefault();
        this.props.registerUser(
            this.state.email, 
            this.state.password, 
            this.state.redirectTo
        );
    }

    render() {
        return (
            <div className='col-md-6 col-md-offset-3'>
                <Paper style={style}>
                    <form role='form' onSubmit={(e) => this.login(e)}>
                        <div className="text-center">
                            <h2>Register to view protected content!</h2>
                            {
                                this.props.statusText &&
                                <div className='alert alert-info'>
                                    {this.props.statusText}
                                </div>
                            }
                            <div className="col-md-12">
                                <TextField
                                    name="email"
                                    id="email"
                                    type="email"
                                    hintText="Email"
                                    floatingLabelText="Email"
                                    errorText={this.state.email_error_text}
                                    onChange={(e) =>this.changeValue(e, 'email')}
                                />
                            </div>
                            <div className="col-md-12">
                                <TextField
                                    name="password"
                                    id="password"
                                    type="password"
                                    hintText="Password"
                                    floatingLabelText="Password"
                                    errorText={this.state.password_error_text}
                                    onChange={(e) => this.changeValue(e, 'password')}
                                />
                            </div>
                            <RaisedButton 
                                type="submit"
                                disabled={this.state.disabled} 
                                style={{"marginTop": 50}} 
                                label="Submit"
                            />
                        </div>
                    </form>
                </Paper>
            </div>
        );

    }
}

