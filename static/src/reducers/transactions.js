import {createReducer} from '../utils/misc';
import {
    TRANSACTIONS_GET, 
    TRANSACTIONS_GET_SUCCESS, 
    TRANSACTIONS_GET_FAIL,
    TRANSACTIONS_PUT,
    TRANSACTIONS_FILTER_SET,
} from '../constants/index';

const initialState = {
    data: [],
    filter: {
        comment: '',
        date: '',
    },
    isFetching: false,
};

export function transactions(state = initialState, action) {
    switch (action.type) {
        case TRANSACTIONS_GET_SUCCESS:
            return {
                ...state,
                data: action.payload.data.result,
                isFetching: false,
            }
        case TRANSACTIONS_GET_FAIL:
            return {
                ...state,
                isFetching: false,
            }
        case TRANSACTIONS_GET:
            return {
                ...state,
                isFetching: true,
            }
        case TRANSACTIONS_FILTER_SET:
            return {
                ...state,
                filter: {...state.filter,...action.payload},
            }
        case TRANSACTIONS_PUT:
            console.log('reducing TRANSACTIONS_PUT');
            if (!!state.data){
                return {
                    ...state,
                    data: [
                        ...state.data.slice(0,action.payload.id-1),
                        action.payload,
                        ...state.data.slice(action.payload.id)
                    ]
                }
            }
        default:
            return state
    }
}

