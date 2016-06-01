import {FETCH_TRANSACTIONS} from '../constants/index'

export function loadTransactions(token){
    return {
        type: FETCH_TRANSACTIONS,
        payload: {
            request: {
                url: '/transactions'
            }
        }
    }
}
        
