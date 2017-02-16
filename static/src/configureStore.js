import { createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
//import { persistState} from 'redux-devtools';
import {persistStore, autoRehydrate} from 'redux-persist-immutable'
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import rootReducer from './rootReducer';
import DevTools from './containers/DevTools';
import ddp from './ddp';


const axiosClient = axios.create({
    baseURL: process.env.API_URL,
    responseType: 'json'
});

//handling of ws and store should be just fine, see: http://stackoverflow.com/questions/31970675/where-do-long-running-processes-live-in-a-react-redux-application
const wsclient = new ddp.WSClient('ws://localhost:5000/api/ws');

// add `autoRehydrate` as an enhancer to your store (note: `autoRehydrate` is not a middleware)
const storeEnhancers = [
    applyMiddleware(
        thunkMiddleware.withExtraArgument(wsclient),
        axiosMiddleware(axiosClient),
        ddp.createMiddleware(wsclient.createToServerHandler())
    ),
    autoRehydrate({log:true})
];

if ((process.env.NODE_ENV !== 'production')) {
    console.log('development mode');
    storeEnhancers.push(DevTools.instrument());
    //storeEnhancers.push(
        //persistState(
          //window.location.href.match(/[?&]debug_session=([^&]+)\b/)
        //));
};

const enhancer = compose(...storeEnhancers);

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        enhancer,
    );

    // begin periodically persisting the store
    persistStore(store,{
        blacklist:['router','lastAction']
    });

    wsclient.setStore(store);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./transactions/reducer', () => {
            const nextRootReducer = require('./rootReducer').default;
            store.replaceReducer(nextRootReducer);
        });
        module.hot.accept('./ddp', () => {
            const nextRootReducer = require('./rootReducer').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
