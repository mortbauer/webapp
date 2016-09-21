import {
    TRANSACTIONS_GET,
    TRANSACTIONS_FILTER_SET,
    TRANSACTIONS_EDIT
} from '../constants/index'


export function loadTransactions(token){
    return {
        type: TRANSACTIONS_GET,
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
        type: TRANSACTIONS_FILTER_SET,
        payload: {
            field: field,
            value: value
        }
    }
}

export function editIdValue(id,field,value) {
    return {
        type: TRANSACTIONS_EDIT,
        payload: {
            value: value,
            field: field,
            index: id
        }
    }
}

