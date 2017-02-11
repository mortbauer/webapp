import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'style.scss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from './configureStore';
import Root from './containers/Root';
import * as ActionTypes from './constants/index';

injectTapEventPlugin();

const createSelectLocationState = () => {
  let prevRoutingState, prevRoutingStateJS;
  return (state) => {
    const routingState = state.get('router'); // or state.routing 
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }
    return prevRoutingStateJS;
  };
};

const store = configureStore();
window.store = store;

const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: createSelectLocationState()
});

render(
    <MuiThemeProvider>
        <Root store={store} history={history}/>
    </MuiThemeProvider>,
    document.getElementById('root')
);

