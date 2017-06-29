import debounce from 'debounce';
import Immutable from 'immutable';

import {MERGE} from './actionTypes';

var unsent = [];

export default class WSClient{
    constructor(url,enable_backsync,disable_backsync,reconnectDecay=1.5,reconnectInterval=2000){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connected = false;
        this.websocket = null;
        this.incoming = [];
        this.pending = new Map();
        this.enable_backsync = enable_backsync;
        this.disable_backsync = disable_backsync;
    };

    connect(token){
        console.log(`connecting to: ${this.url}`);

        try {
            this.websocket = new WebSocket(this.url);
        }
        catch(e) {
            console.log('websocket construction error');
            this.websocket = null;
            this.reconnect(token);
        }
        if (!!this.websocket){
            this.websocket.onmessage = (event) => {
                this.handleIncomming(event.data);
            }

            this.websocket.onerror = (event) => {
                console.log('websocket error');
            }

            this.websocket.onopen = (event) => {
                this.reconnectAttempts = 0;
                this.websocket.send(JSON.stringify({
                    'msg':'method',
                    'method':'identify',
                    'kwargs':{
                        'token':token,
                    }
                }));
                while (unsent.length){
                    this.websocket.send(unsent.shift());
                };
            }

            this.websocket.onclose = (event) => {
                console.log('websocket closed');
                this.reconnect(token)
            }
        }
    }

    reconnect(token){
        var timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts);
        console.log(`try to reconnect in: ${timeout}`);
        setTimeout(()=>this.connect(token),timeout);
        this.reconnectAttempts ++;
    }

    handleIncomming(msg){
        try{
            var data = JSON.parse(msg);
        }catch(err){
            console.log(`could not parse to json ${msg}`);
        }
        if (!!data){
            this.handleFromServer(data);
            
        }
    }

    createToServerHandler(){
        let ws = this;
        return function(data){
            try{
                var msg = JSON.stringify(data);
            }catch(err){
                console.log(`could not stringify to json ${data}`);
            }
            console.log(`to server handler sending ${msg}`);
            if (!!ws.websocket && ws.websocket.readyState){
                ws.websocket.send(msg);
            }
            else {
                unsent.push(msg);
            }
        } 
    }

    setStore(store){
        this.store = store;
    }
    
    merge = debounce(function(){
        this.store.dispatch({type:'MERGE_FROM_SERVER',msgs:[...this.incoming]})
        this.incoming.length=0
    },200)

    handleFromServer(data){
        this.disable_backsync();
        switch (data.msg){
            case 'added':
                this.incoming.push(data);
                this.merge();
                break;
            case 'result':
                const status = data.hasOwnProperty('result') ? 'SUCESS' : 'FAILED'
                const {msg,id,...action} = data 
                action.type = `${this.pending[data.id]}_${status}`
                this.store.dispatch(action)
                break;
            case 'ready':
                this.store.dispatch({
                    type:'SUBS_READY',
                    ids:data.subs,
                })
                break;
        }
        this.enable_backsync();
    }

    createMiddleware(){
        let counter = 0
        let pending = this.pending
        window.pending = pending
        let to_server_handler = this.createToServerHandler()
        return store => next => action => {
            if ((action.type == 'SUBSCRIBE')){
                let id = (counter++).toString()
                let msg = {
                    msg: 'sub',
                    name: action.name,
                    id: id,
                }
                //if (action.ddp.msg == 'method'){
                    //pending.set(id,action.type)
                //}
                to_server_handler(msg);
            }
            return next(action);
        }
    }
};
