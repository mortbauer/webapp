import { createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistState} from 'redux-devtools';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

//import WSClient from './websocket';
import rootReducer from './rootReducer';
import DevTools from './containers/DevTools';


const axiosClient = axios.create({
    baseURL: process.env.API_URL,
    responseType: 'json'
});

//handling of ws and store should be just fine, see: http://stackoverflow.com/questions/31970675/where-do-long-running-processes-live-in-a-react-redux-application
//const wsclient = new WSClient('ws://localhost:5000/api/ws');

const storeEnhancers = [
    applyMiddleware(thunkMiddleware,axiosMiddleware(axiosClient))
];

if (process.env.NODE_ENV !== 'production') {
    storeEnhancers.push(DevTools.instrument());
    storeEnhancers.push(
        persistState(
          window.location.href.match(/[?&]debug_session=([^&]+)\b/)
        ));
};

const enhancer = compose(...storeEnhancers);

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        enhancer,
    );

    //wsclient.setStore(store);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./transactions/reducer', () => {
            const nextRootReducer = require('./rootReducer').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
