export default class WS {
  constructor(url, token, dispatcher) {
    this.websocket = new WebSocket(`ws://${url}`);

    this.websocket.onmessage = function(event) {
        console.log('a websocket got ',event.data);
        try{
            var obj = JSON.parse(event.data);
            dispatcher(obj);
        }catch(err){
            console.log('could not parse to json');
        }
    }
    this.websocket.onerror = function(event) {
        console.log('a websocket error happened');
    }
    this.websocket.onopen = function(event) {
        console.log('the websocket is ready');
    }

  }

  emit(obj) {
    this.websocket.send(
      JSON.stringify(obj)
    );
  }

  close() {
    this.websocket.close();
  }

}
