import debounce from 'debounce';
import Immutable from 'immutable';

import {MERGE} from './actionTypes';

var unsent = [];
var outgoing = new Map();

window.outgoing = outgoing;

export default class WSClient{
    constructor(url,{reconnectDecay=1.5,reconnectInterval=2000,to_sync=[]}){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connected = false;
        this.websocket = null;
        this.incoming = [];
        this.pending = new Map();
        this.to_sync = to_sync;
        this.enable_actor = true;
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
        this.state = store.getState();
        store.subscribe(this.syncActor)
    }

    merge = debounce(function(){
        this.enable_actor = false;
        this.store.dispatch({type:MERGE,msgs:[...this.incoming]})
        this.enable_actor = true;
        this.incoming.length=0
    },200)

    handleFromServer(data){
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
    }

    diffMap(a,b){
        let changed = []
        if (!Immutable.is(a,b)){
            a.keySeq().forEach(k => {
                if (!b.has(k)){
                    changed.push({op:'removed','id':k})
                }
            })
            b.keySeq().forEach(k => {
                if (!a.has(k)){
                    changed.push({op:'added','id':k})
                } else {
                    let val_a = a.get(k)
                    let val_b = b.get(k)
                    if (!Immutable.is(val_a,val_b)){
                        changed.push({op:'changed','id':k})
                    }
                }
            })
        }
        return changed
    }

    syncActor = () => {
        if (this.enable_actor){
            this.enable_actor = false;
            const state = this.store.getState();
            if (!Immutable.is(state,this.state)){
                this.to_sync.forEach(spec => {
                    let prev = this.state.getIn(spec.collection)
                    let cur = state.getIn(spec.collection)
                    let changed = this.diffMap(prev,cur)
                    if (changed.length){
                        console.log('BACKSYNC_NEEDED',changed)
                        this.store.dispatch({
                            type:'BACKSYNC_NEEDED',
                            collection:spec.backend,
                            changed:changed,
                        })
                    }
                })
                this.state = state
            }
            this.enable_actor = true;
        }
    }

    createMiddleware(){
        let counter = 0
        let pending = this.pending
        window.pending = pending
        let to_server_handler = this.createToServerHandler()
        return store => next => action => {
            let state = store.getState()
            if ((action.ddp !== undefined)){
                let id = (counter++).toString()
                if (action.ddp.msg == 'method'){
                    pending.set(id,action.type)
                }
                action.ddp.id = id
                to_server_handler(action.ddp);
            }
            return next(action);
        }
    }
};
