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
            let data = {
                'method':'GET',
                'resource':action.type.substr(0,action.type.indexOf('/GET')),
                'data':action.payload,
            }
            to_server_handler(data);
        }
        else if (action.type.endsWith('/PATCH')){
            let data = {
                'method':'PATCH',
                'resource':action.type.substr(0,action.type.indexOf('/PATCH')),
                'inst':action.payload.inst,
                'id':action.payload.id,
            }
            to_server_handler(data);
        }
        return next(action);
    }
}
