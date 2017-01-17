import Immutable from 'immutable';

var msgs = new Map();

export function fromServerSync(store){
    return data => {
        if (data.id !== undefined){
            console.log('got message with id',data);
            if (data.result !== undefined){
                store.dispatch({
                    type: 'RPC_RESULT',
                    payload: {
                        result: data.result,
                        resource: msgs.get(data.id)
                    }
                })
            }
            //store.dispatch(data.action);
        } else {
            console.log('got message without id',data);
        }
    }
}

export function createMiddleware(to_server_handler){
    let counter = 0
    return store => next => action => {
        if ((action.payload !== undefined) && (action.payload.rpc !== undefined) && (action.payload.resource !== undefined)){
            msgs.set(counter.toString(),action.payload.resource)
            action.payload.rpc.id = counter.toString()
            if (action.payload.rpc.params === undefined){
                action.payload.rpc.params = {}
            }
            to_server_handler(action.payload.rpc);
        }
        return next(action);
    }
}

export function rpcReducerEnhancer(reducer){
    const initialState = reducer(undefined,{});

    return function (state = initialState, action){
        switch (action.type) {
            case 'RPC_RESULT':

        }
    }
}
