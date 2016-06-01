import {createReducer} from '../utils/misc';
import {FETCH_TRANSACTIONS} from '../actions/transactions';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false
};

export function transactions(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_TRANSACTIONS_SUCCESS':
            return Object.assign({}, state, {
                'data': action.payload.data.result,
                'isFetching': false,
                'loaded': true
            });
        case 'FETCH_TRANSACTIONS_FAIL':
            return Object.assign({}, state, {
                'isFetching': false,
                'loaded': false,
                'data':null,
            });
        case FETCH_TRANSACTIONS:
            return Object.assign({}, state, {
                'isFetching': true,
            });
        default:
            return state
    }
}

