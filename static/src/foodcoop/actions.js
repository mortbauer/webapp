import {
    GET,
    RECEIVE,
    FILTER_SET,
    SET_ORDER_GROUP,
} from './actionTypes'

import {storageAvailable} from '../utils/browser_support'

export function loadTransactions(){
    return {
        type: GET,
        ddp:{
            msg: 'sub',
            name: 'transactions',
        }
    }
}

export function loadOrderGroups(){
    return {
        type: GET,
        ddp:{
            msg: 'sub',
            name: 'order_groups',
        }
    }
}

        
export function setFilter(field,value) {
    return {
        type: FILTER_SET,
        field: field,
        value: value
    }
}

export function setOrderGroup(id,value) {
    return {
        type: SET_ORDER_GROUP,
        value: value,
        id: id,
    }
}

