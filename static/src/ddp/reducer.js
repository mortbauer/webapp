import Immutable from 'immutable';

import {
    CONNECTED,
    FAILED,
    PING,
    NOSUB,
    ADDED,
    ADDEDMULTIPLE,
    CHANGED,
    REMOVED,
    READY,
    ADDEDBEFORE,
    MOVEDBEFORE,
    RESULT,
    UPDATED,
    MERGE,
} from './actionTypes';

export default function reducer(state, action) {
    switch (action.type) {
        case MERGE:
            let incoming_unmerged = Immutable.List();
            return action.msgs.reduce((state,msg)=>{
                let new_data = Immutable.fromJS(msg.fields)
                if (!state.hasIn([msg.collection,'data',msg.id])){
                    return state.setIn([msg.collection,'data',msg.id],new_data)
                } else
                {
                    let cur_data = state.getIn([msg.collection,'data',msg.id])
                    if (cur_data.hashCode() != new_data.hashCode()){
                        return state.set(
                            'incoming_unmerged',state.get(
                                'incoming_unmerged',incoming_unmerged).push(
                                    [msg.collection,msg.id,new_data]))
                    } else {
                        return state
                    }
                }
            },state)
        case CONNECTED:
            return state.setIn(['ddp','session'],action.payload.session)
        case FAILED:
            return state.deleteIn(['ddp','session'])
        case ADDED:
            return state.setIn(
                [action.payload.collection,'data',action.payload.id],
                action.payload.fields
            )
        case ADDEDMULTIPLE:
            return state.mergeIn(
                [action.payload.collection,'data'],
                action.payload.docs
            )
        case CHANGED:
            if (action.payload.cleared !== undefined){
                state = actioy.payload.cleared.reduce(
                    (state,id) => {return state.deltetIn(
                        [action.payload.collection,'data',action.payload.id,id])},state)
            }
            return state.mergeIn(
                [action.payload.collection,action.payload.id],
                action.payload.fields
            )
        case REMOVED:
                return state.deltetIn(
            [action.payload.collection,action.payload.id])
        default:
            return state
    }
}
