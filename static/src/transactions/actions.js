import {
    PUT,
    GET,
    FILTER_SET,
} from './actionTypes'


export function loadTransactions(token){
    return {
        type: GET,
        payload: {
            request: {
                url: '/transactions',
                headers: {'Authorization': `Bearer ${token}`}
            }
        }
    }
}
        
export function setFilter(field,value) {
    return {
        type: FILTER_SET,
        payload: {
            field: field,
            value: value
        }
    }
}

export function editOrderGroup(id,value) {
    return {
        type: PUT,
        payload: {
            'field': 'order_group_id',
            'value': value,
            'index': id
        }
    }
}

