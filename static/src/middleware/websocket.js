
export default class WSClient{
    constructor(url,reconnectDecay=1.5,reconnectInterval=2000){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.websocket;
        this.connecting = false;
        this.connect();
    };
    connect(){
        if (!this.connecting){
            console.log(`connecting to: ${this.url}`);
            this.connecting = true;
            this.websocket = new WebSocket(this.url);
            this.websocket.onmessage = (event) => {
                console.log('a websocket got ',event.data);
                try{
                    var msg = JSON.parse(event.data);
                    if (!!msg.action){
                        console.log('got message wich should be dispatched here');
                    } else {
                        console.log('got message without action');
                    }
                }catch(err){
                    console.log('could not parse to json');
                }
            }
            this.websocket.onerror = (event) => {
                this.connecting = false;
                console.log('a websocket error happened');
                this.reconnect();
            }
            this.websocket.onopen = (event) => {
                this.reconnectAttempts = 0;
                console.log('the websocket is ready');
            }
            this.websocket.onclose = (event) => {
                this.connecting = false;
                console.log('the websocket closed');
                this.reconnect();
            }
        };
    };

    reconnect(){
        this.reconnectAttempts ++;
        var timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts);
        console.log(`try to reconnect in: ${timeout}`);
        setTimeout(()=>this.connect(),timeout);
    };

    middleware(store) {
        return next => action => {
            console.log(`forwarding action: ${action}`);
            return next(action);
        }
    }

};
