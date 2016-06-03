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

injectTapEventPlugin();
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)

var socket = new WebSocket("ws://localhost:5000")

render(
    <MuiThemeProvider>
        <Root store={store} history={history}/>
    </MuiThemeProvider>,
    document.getElementById('root')
);
