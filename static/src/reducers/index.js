import { combineReducers } from 'redux-immutable';
import auth from './auth'
import {data} from './data'
import {transactions} from './transactions'
import router from './router'
 
function lastAction(state = null, action) {
  return action;
}

const rootReducer = combineReducers({
    router,
    auth,
    data,
    transactions,
    lastAction,
});

export default rootReducer;
