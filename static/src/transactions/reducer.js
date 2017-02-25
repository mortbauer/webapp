import Immutable from 'immutable';

import {
    GET,
    PUT,
    PATCH,
    FILTER_SET,
} from './actionTypes';

const initialState = Immutable.fromJS({
    data: {},
    sort_by: 'id',
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
            switch (action.payload.desc.op){
                case 'replace':
                    return state.setIn(['data',action.payload.id,action.payload.desc.field],action.payload.desc.value)
                default:
                    return state
            }
        case FILTER_SET:
            return state.setIn(['filter',action.payload.field],action.payload.value)
        default:
            return state
    }
}
