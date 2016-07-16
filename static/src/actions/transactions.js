import {TRANSACTIONS_GET} from '../constants/index'

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
        
