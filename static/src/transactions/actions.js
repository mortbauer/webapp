import {
    PATCH,
    GET,
    FILTER_SET,
} from './actionTypes'


export function loadTransactions(token){
    return {
        type: GET,
        payload: { 
            resource: 'transactions', 
            rpc:{
                msg: 'rpc',
                method: 'transactions_get',
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
        type: PATCH,
        payload: {
            'inst': {'op':'replace','field':'order_group_id','value': value},
            'id': id
        }
    }
}

