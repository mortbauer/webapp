import {createReducer} from '../utils/misc';
import Immutable from 'immutable';

import {
    TRANSACTIONS_GET,
    TRANSACTIONS_GET_SUCCESS,
    TRANSACTIONS_GET_FAIL,
    TRANSACTIONS_PUT,
    TRANSACTIONS_ORDER_GROUP_EDIT,
    TRANSACTIONS_FILTER_SET,
} from '../constants/index';

const initialState = Immutable.fromJS({
    data: [],
    filter: {
        comment: '',
        date: null,
        amount: null,
    },
    isFetching: false,
});

export function transactions(state = initialState, action) {
    switch (action.type) {
        case TRANSACTIONS_GET_SUCCESS:
            return state.merge({
                data: action.payload.data.result,
                isFetching: false,
            })
        case TRANSACTIONS_GET_FAIL:
            return state.merge({
                isFetching: false,
            })
        case TRANSACTIONS_GET:
            return state.merge({
                isFetching: true,
            })
        case TRANSACTIONS_ORDER_GROUP_EDIT:
            return state.setIn(['data',action.payload.index,'order_group_id'],action.payload.value)
        case TRANSACTIONS_FILTER_SET:
            return state.setIn(['filter',action.payload.field],action.payload.value)
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

