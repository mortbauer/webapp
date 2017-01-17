
export default class WSClient{
    constructor(url,reconnectDecay=1.5,reconnectInterval=2000,from_server_handler=null){
        this.url = url;
        this.reconnectInterval = reconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.reconnectAttempts = 0;
        this.connected = false;
        this.websocket = null;
        this.from_server_handler = from_server_handler;
        this.unsent = [];
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
                console.log('websocket open',this.unsent.length);
                this.reconnectAttempts = 0;
                this.websocket.send(JSON.stringify({
                    'method':'identify',
                    'kwargs':{
                        'token':token,
                    }
                }));
                while (this.unsent.length){
                    let msg = this.unsent.shift();
                    console.log(`sending ${msg}`);
                    this.websocket.send(msg);
                }
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
        if (!!data && !!this.from_server_handler){
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
            if (ws.websocket.readyState){
                ws.websocket.send(msg);
            }
            else {
                console.log('websocket not ready yet');
                ws.unsent.push(msg);
            }
        } 
    }
    setFromServerHandler(from_server_handler){
        this.from_server_handler = from_server_handler;
    }
};
