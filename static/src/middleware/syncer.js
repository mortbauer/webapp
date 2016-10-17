export function fromServerSync(store){
    return data => {
        if (!!data.action){
            //validate that propper action
            console.log(`${Date.now()} dispatching action ${data.action.type}`);
            store.dispatch(data.action);
        } else {
            console.log('got message without action');
            store.dispatch({
                type:'transactions/GET_SUCCESS',
                payload:{
                    'data':data.data,
                }
            })
        }
    }
}

export function createMiddleware(to_server_handler){
    return store => next => action => {
        console.log(`syncer middlware on action: ${action.type}`);
        if (action.type.endsWith('/GET')){
            action.payload['method'] = 'GET'
            action.payload['token'] = store.getState().getIn(['auth','token'])
            to_server_handler(action.payload);
        }
        return next(action);
    }
}
