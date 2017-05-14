import {
    GET,
    RECEIVE,
    FILTER_SET,
    SET_ORDER_GROUP,
} from './actionTypes'


export function loadData(collection_name){
    return {
        type: 'SUBSCRIBE',
        name: collection_name,
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

