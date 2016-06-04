require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'style.scss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import * as ActionTypes from './constants/index';
import WS from './utils/Socket';

injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)

render(
    <MuiThemeProvider>
        <Root store={store} history={history}/>
    </MuiThemeProvider>,
    document.getElementById('root')
);

const sock = {
  ws: null,
  URL: 'localhost:5000',

  wsDipatcher: (data) => {
      console.log('got data',data);
      return store.dispatch({type:ActionTypes.TEST,payload:data});
  },

  wsListener: () => {
    const { auth, lastAction } = store.getState();
    switch (lastAction.type) {
      case ActionTypes.LOGIN_USER_SUCCESS:{
        return sock.startWS(auth.token);
      }

      default:
        return;
    }
  },
  startWS: (token) => {
    if(!!sock.ws){
        sock.ws.close();
    }

    if(token){
        console.log('starting WS ######');
        sock.ws = new WS(sock.URL, token, sock.wsDipatcher)
    }
  }
};

store.subscribe(() => sock.wsListener());
