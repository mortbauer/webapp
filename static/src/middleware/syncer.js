import Immutable from 'immutable';

var messages = new Map();

export function fromServerSync(store){
    return data => {
        if (data.msg !== undefined){
            //handle ddp
            store.dispatch({
                type: 'DDP'.concat(data.msg),
                payload: data
            })
        } else {
            console.log('got message without msg',data);
        }
    }
}

export function createMiddleware(to_server_handler){
    let counter = 0
    return store => next => action => {
        if ((action.payload !== undefined) && (action.payload.rpc !== undefined)){
            messages.set(counter.toString(),action.payload.callbackActionType)
            action.payload.rpc.id = counter.toString()
            if (action.payload.rpc.params === undefined){
                action.payload.rpc.params = {}
            }
            to_server_handler(action.payload.rpc);
        }
        return next(action);
    }
}

//not used/needed for now but surely for other stuff
export function rpcReducerEnhancer(reducer){
    const initialState = reducer(undefined,{});

    return function (state = initialState, action){
        switch (action.type) {
            case 'RPC_SUCCESS':
                console.log('I am the RPC_SUCCESS reducer enhancer',state,action)
                return state.setIn([action.payload.resource],action.payload.result)
            default:
                // Delegate handling the action to the passed reducer
                return reducer(state, action)
        }
    }
}
