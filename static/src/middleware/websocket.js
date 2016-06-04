
export default class WSClient{
    constructor(url,reconnectDecay=1.5,reconnectInterval=2000){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connect();
        this.connected = false;
    };
    connect(){
        console.log(`connecting to: ${this.url}`);

        this.websocket = new WebSocket(this.url);

        this.websocket.onmessage = (event) => {
            this.handleIncomming(event.data);
        }

        this.websocket.onerror = (event) => {
            console.log('websocket error');
        }

        this.websocket.onopen = (event) => {
            console.log('websocket open');
            this.reconnectAttempts = 0;
        }

        this.websocket.onclose = (event) => {
            console.log('websocket closed');
            this.reconnect()
        }
    }

    handleIncomming(data){
        try{
            var msg = JSON.parse(data);
            if (!!msg.action){
                console.log(`got action: ${msg.action} wich should be dispatched here`);
            } else {
                console.log('got message without action');
            }
        }catch(err){
            console.log('could not parse to json');
        }
    }

    reconnect(){
        var timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts);
        console.log(`try to reconnect in: ${timeout}`);
        setTimeout(()=>this.connect(),timeout);
        this.reconnectAttempts ++;
    };

    middleware(store) {
        return next => action => {
            console.log(`forwarding action: ${action}`);
            return next(action);
        }
    }

};
