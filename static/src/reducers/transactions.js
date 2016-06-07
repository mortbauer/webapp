import {createReducer} from '../utils/misc';
import {
    TRANSACTIONS_GET, 
    TRANSACTIONS_GET_SUCCESS, 
    TRANSACTIONS_GET_FAIL,
    TRANSACTIONS_PUT,
} from '../constants/index';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false
};

export function transactions(state = initialState, action) {
    switch (action.type) {
        case TRANSACTIONS_GET_SUCCESS:
            return Object.assign({}, state, {
                'data': action.payload.data.result,
                'isFetching': false,
                'loaded': true
            });
        case TRANSACTIONS_GET_FAIL:
            return Object.assign({}, state, {
                'isFetching': false,
                'loaded': false,
                'data':null,
            });
        case TRANSACTIONS_GET:
            return Object.assign({}, state, {
                'isFetching': true,
            });
        case TRANSACTIONS_PUT:
            console.log('reducing TRANSACTIONS_PUT');
            if (!!state.data){
                return Object.assign({}, state, {
                'data': [
                    ...state.data.slice(0,action.payload.id-1),
                    action.payload,
                    ...state.data.slice(action.payload.id)
                ]

            });}
        default:
            return state
    }
}

