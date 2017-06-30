import Immutable from 'immutable';

import {MERGE} from './actionTypes';

export default class WSClient{
    constructor(url,send_to_redux,reconnectDecay=1.5,reconnectInterval=2000){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connected = false;
        this.websocket = null;
        this.unsent = [];
        this.send_to_redux = send_to_redux;
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
                this.send_to_backend({
                    'msg':'method',
                    'method':'identify',
                    'kwargs':{
                        'token':token,
                    }
                });
                while (this.unsent.length){
                    this.websocket.send(this.unsent.shift());
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
            this.send_to_redux(data);
        }
    }

    send_to_backend = (data) => {
        try{
            var msg = JSON.stringify(data);
        }catch(err){
            console.log(`could not stringify to json ${data}`);
        }
        console.log(`to server handler sending ${msg}`);
        if (!!this.websocket && this.websocket.readyState){
            this.websocket.send(msg);
        }
        else {
            this.unsent.push(msg);
        }
    }

};
