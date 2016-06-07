
export default class WSClient{
    constructor(url,reconnectDecay=1.5,reconnectInterval=2000){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connect();
        this.connected = false;
        this.store = null;
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
            this.websocket.send('im ready now');
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
        }catch(err){
            console.log(`could not parse to json ${data}`);
        }
        if (!!msg){
            if (!!msg.action){
                if (!!this.store){ 
                    //validate that propper action
                    console.log(`${Date.now()} dispatching action ${msg.action.type}`);
                    this.store.dispatch(msg.action);
                }else{
                    console.log(`${Date.now()} got action: ${msg.action.type} wich should be dispatched here, but no reference to store`);
                }
            } else {
                console.log('got message without action');
            }
        }
    }

    reconnect(){
        var timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts);
        console.log(`try to reconnect in: ${timeout}`);
        setTimeout(()=>this.connect(),timeout);
        this.reconnectAttempts ++;
    }

    setStore(store){ 
        this.store = store;
    }

    middleware(store) {
        return next => action => {
            console.log(`forwarding action: ${action.type}`);
            return next(action);
        }
    }

};
