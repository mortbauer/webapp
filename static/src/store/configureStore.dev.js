import { createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import createLogger from 'redux-logger';
import { persistState} from 'redux-devtools';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import WSClient from '../middleware/websocket';

const axiosClient = axios.create({
    baseURL: 'api',
    responseType: 'json'
});

const wsclient = new WSClient('ws://localhost:5000');

const debugMiddleware = [
    createLogger({
        collapsed: true
    })
];

    //applyMiddleware(thunkMiddleware,axiosMiddleware(axiosClient), ...debugMiddleware),
const enhancer = compose(
    applyMiddleware(thunkMiddleware,axiosMiddleware(axiosClient),wsclient.middleware),
    DevTools.instrument(),
    persistState(
      window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    )
);

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        enhancer,
    );

    wsclient.setStore(store);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
