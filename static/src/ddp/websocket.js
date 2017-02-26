import debounce from 'debounce';
import Immutable from 'immutable';

import {MERGE} from './actionTypes';

var unsent = [];
var outgoing = new Map();

window.outgoing = outgoing;

var merge_action = (store,msg,collection)=>{
    store.dispatch({
        'type':msg,
        'payload':{
            'data':incoming.get(collection),
            'collection':collection,
        },
    })
};

var ddpaction = debounce(merge_action,200);

export default class WSClient{
    constructor(url,reconnectDecay=1.5,reconnectInterval=2000){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connected = false;
        this.websocket = null;
        this.store = null;
        this.incoming = [];
        window.incoming = this.incoming;
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
                console.log('websocket not ready yet');
                unsent.push(msg);
            }
        } 
    }
    setStore(store){
        this.store = store;
    }

    merge = debounce(function(){
        this.store.dispatch({
            type:MERGE,
            msgs:this.incoming,
        }),
        this.incoming.length=0;
    },200)

    handleFromServer(msg){
        if (msg.msg !== undefined){
            switch (msg.msg){
                case 'added':
                    this.incoming.push(msg);
                    this.merge()
            }
        } else {
            console.log('got message without msg',msg);
        }
    }

};
