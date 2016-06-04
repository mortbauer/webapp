
export default class WSClient{
    constructor(url,reconnectDecay=1.5,reconnectInterval=2000){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connect();
    };
    connect(){
        var promise = new Promise((resolve,reject) => {
            console.log(`connecting to: ${this.url}`);
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
                console.log('a websocket error happened');
                reject(Error('a websocket error happened'));
            }
            this.websocket.onopen = (event) => {
                this.reconnectAttempts = 0;
                console.log('the websocket is ready');
            }
            this.websocket.onclose = (event) => {
                console.log('the websocket closed');
                reject(Error('a websocket error happened'));
            }
        });
        promise.then(()=>{
            console.log('the websocket is listening');
        },()=>{
            console.log('the websocket needs a reconnect');
            this.reconnect()
        });
    }

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
