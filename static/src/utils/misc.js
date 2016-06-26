export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];


        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}


export function parseJSON(response) {
     return response.data
}

export function validateEmail(email) {
    var re = /.*@.*/;
    return re.test(email);
}

export function validateUsername(username) {
    var re = /(?=^.{3,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/;
    return re.test(username);
} 

export function validatePassword(password) {
    var re = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
    return re.test(password);
}
