import axios from 'axios';

const client = axios.create({
    baseURL: process.env.API_URL,
    responseType: 'json',
});

const tokenConfig = function (token) {
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
};

export function validate_token(token) {
    return client.post('/is_token_valid', {
        token: token,
    })
}

export function create_user(username, email, password) {
    return client.post('/users', {
        username: username,
        email: email,
        password: password
    })
}

export function get_token(email, password) {
    return client.post('/get_token', {
        email: email,
        password: password
    })
}

export function get_transactions(token) {
    return client.get('/transactions', tokenConfig(token))
}

export function protected_endpoint(token,endpoint) {
    return client.get(endpoint, tokenConfig(token))
}
