import {
    PATCH,
    GET,
    RECEIVE,
    FILTER_SET,
} from './actionTypes'

import {storageAvailable} from '../utils/browser_support'

export function loadTransactions(){
    //if (storageAvailable('localStorage') && localStorage.getItem('transactions')){
        //console.log('transactions in localStorage');
    //}
    return {
        type: GET,
        payload: { 
            ddp:{
                msg: 'sub',
                name: 'transactions',
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

