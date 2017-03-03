import Immutable from 'immutable';

import {
    SET_ORDER_GROUP,
    GET,
    PUT,
    PATCH,
    FILTER_SET,
} from './actionTypes';

const initialState = Immutable.fromJS({
    users: {},
    order_groups: {},
    transactions: {},
    transactions_view: {
        sort_by: 'id',
        filter: {
            comment: '',
            date: null,
            amount: null,
        },
    }
});

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_ORDER_GROUP:
            let order_group = state.get('order_groups').find((group)=>group.get('name')==action.value)
            if (order_group !== undefined){
                return state.setIn(['transactions',action.id,'order_group_id'],order_group.get('id'))
            }else{
                return state
            }
        case FILTER_SET:
            return state.setIn(['transactions_view','filter',action.field],action.value)
        default:
            return state
    }
}
