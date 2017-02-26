import Immutable from 'immutable';

var messages = new Map();

export function createMiddleware(to_server_handler){
    let counter = 0
    return store => next => action => {
        if ((action.payload !== undefined) && (action.payload.ddp !== undefined)){
            if (action.payload.callbackActionType !== undefined){
                messages.set(counter.toString(),action.payload.callbackActionType)
            }
            action.payload.ddp.id = counter.toString()
            to_server_handler(action.payload.ddp);
        }
        if (action.type == 'PATCH'){
            let {type,...params} = action;
            to_server_handler({msg:'method',method:type.toLowerCase(),params});
        }
        return next(action);
    }
}

//not used/needed for now but surely for other stuff
export function reducerEnhancer(reducer){
    const initialState = reducer(undefined,{}).set('not_synced',Immutable.Map());

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
