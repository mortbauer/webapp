
export default class WSClient{
    constructor(url,reconnectDecay=1.5,reconnectInterval=2000,from_server_handler=null){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connect();
        this.connected = false;
        this.store = null;
        this.from_server_handler = from_server_handler;
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
    reconnect(){
        var timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts);
        console.log(`try to reconnect in: ${timeout}`);
        setTimeout(()=>this.connect(),timeout);
        this.reconnectAttempts ++;
    }
    handleIncomming(msg){
        try{
            var data = JSON.parse(msg);
        }catch(err){
            console.log(`could not parse to json ${msg}`);
        }
        if (!!data){
            console.log(`should go to store ${msg}`);
            this.from_server_handler(data);
            
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
            ws.websocket.send(msg);
        } 
    }
    setFromServerHandler(from_server_handler){
        this.from_server_handler = from_server_handler;
    }
};
