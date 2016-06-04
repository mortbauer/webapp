import { combineReducers } from 'redux';
import auth from './auth'
import {data} from './data'
import {transactions} from './transactions'
import { routerReducer } from 'react-router-redux'

function lastAction(state = null, action) {
  return action;
}

const rootReducer = combineReducers({
    routing: routerReducer,
    /* your reducers */
    auth,
    data,
    transactions,
    lastAction,
});

export default rootReducer;
