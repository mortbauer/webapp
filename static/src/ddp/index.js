import reducer from './reducer';
import createMiddleware from './middleware';
import WSClient from './websocket';

export default { WSClient, createMiddleware, reducer };
