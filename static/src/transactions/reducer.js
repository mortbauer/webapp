import Immutable from 'immutable';

import {
    GET,
    GET_SUCCESS,
    GET_FAIL,
    PUT,
    FILTER_SET,
} from './actionTypes';

const initialState = Immutable.fromJS({
    data: [],
    filter: {
        comment: '',
        date: null,
        amount: null,
    },
    isFetching: false,
});

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_SUCCESS:
            return state.merge({
                data: action.payload.data.result,
                isFetching: false,
            })
        case GET_FAIL:
            return state.merge({
                isFetching: false,
            })
        case GET:
            return state.merge({
                isFetching: true,
            })
        case PUT:
            return state.setIn(['data',action.payload.index,'order_group_id'],action.payload.value)
        case FILTER_SET:
            return state.setIn(['filter',action.payload.field],action.payload.value)
        default:
            return state
    }
}
