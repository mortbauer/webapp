import Immutable from 'immutable';

var messages = new Map();

export function createMiddleware(to_server_handler){
    let counter = 0
    return store => next => action => {
        let state = store.getState()
        if ((action.ddp !== undefined)){
            let id = (counter++).toString()
            if (action.callbackActionType !== undefined){
                messages.set(id,action.callbackActionType)
            }
            action.ddp.id = id
            to_server_handler(action.ddp);
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
