import Immutable from 'immutable';

import {
    GET,
    PUT,
    PATCH,
    FILTER_SET,
} from './actionTypes';

const initialState = Immutable.fromJS({
    data: {},
    filter: {
        comment: '',
        date: null,
        amount: null,
    },
    subscribed: false,
    isFetching: false,
});

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET:
            return state.merge({
                isFetching: true,
            })
        case PATCH:
            return state.setIn(['data',action.payload.id,action.payload.inst.field],action.payload.inst.value)
        case FILTER_SET:
            return state.setIn(['filter',action.payload.field],action.payload.value)
        default:
            return state
    }
}
