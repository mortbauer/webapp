import axios from 'axios';

const tokenConfig = function (token) {
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
};

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token: token,
    })
}

export function create_user(username, email, password) {
    return axios.post('api/users', {
        username: username,
        email: email,
        password: password
    })
}

export function get_token(email, password) {
    return axios.post('api/get_token', {
        email: email,
        password: password
    })
}

export function get_transactions(token) {
    return axios.get('api/transactions', tokenConfig(token))
}

export function protected_endpoint(token,endpoint) {
    return axios.get(endpoint, tokenConfig(token))
}
