import {
    TRANSACTIONS_GET,
    TRANSACTIONS_FILTER_SET
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
        
export function setCommentFilter(comment) {
    return {
        type: TRANSACTIONS_FILTER_SET,
        payload: {
            comment: comment
        }
    }
}

export function setDateFilter(date) {
    return {
        type: TRANSACTIONS_FILTER_SET,
        payload: {
            date: date
        }
    }
}

