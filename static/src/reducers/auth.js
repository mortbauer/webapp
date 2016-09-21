import Immutable from 'immutable';
import {createReducer} from '../utils/misc';
import {
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGIN_USER_REQUEST,
    LOGOUT_USER,
    REGISTER_USER_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS
} from '../constants/index'

import jwtDecode from 'jwt-decode';

const initialState = Immutable.fromJS({
    token: null,
    email: null,
    id: null,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null,
    isRegistering: false,
    isRegistered: false,
    registerStatusText: null
});

export default createReducer(initialState, {
    [LOGIN_USER_REQUEST]: (state, payload) => {
        return state.merge({
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [LOGIN_USER_SUCCESS]: (state, payload) => {
        var jwt = jwtDecode(payload.token);
        return state.merge({
            'isAuthenticating': false,
            'isAuthenticated': true,
            'token': payload.token,
            'email': jwt.email,
            'id': jwt.id,
            'statusText': 'You have been successfully logged in.'
        });

    },
    [LOGIN_USER_FAILURE]: (state, payload) => {
        return state.merge({
            'isAuthenticating': false,
            'isAuthenticated': false,
            'token': null,
            'email': null,
            'id': null,
            'statusText': `Authentication Error: ${payload.status} ${payload.statusText}`
        });
    },
    [LOGOUT_USER]: (state, payload) => {
        return state.merge({
            'isAuthenticated': false,
            'token': null,
            'email': null,
            'id': null,
            'statusText': 'You have been successfully logged out.'
        });
    },
    [REGISTER_USER_SUCCESS]: (state, payload) => {
        var jwt = jwtDecode(payload.token);
        return state.merge({
            'isAuthenticating': false,
            'isAuthenticated': true,
            'isRegistering': false,
            'token': payload.token,
            'email': jwt.email,
            'id': jwt.id,
            'registerStatusText': 'You have been successfully logged in.'
        });

    },
    [REGISTER_USER_REQUEST]: (state, payload) => {
        return state.merg({
            'isRegistering': true,
        });
    },
    [REGISTER_USER_FAILURE]: (state, payload) => {
        return state.merge({
            'isAuthenticated': false,
            'token': null,
            'email': null,
            'id': null,
            'registerStatusText': `Register Error: ${payload.status} ${payload.statusText}`
        });
    }
});
