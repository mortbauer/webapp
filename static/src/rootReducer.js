import { combineReducers } from 'redux-immutable';
import reduceReducers from 'reduce-reducers';
import auth from './reducers/auth'
import router from './reducers/router'
import transactions from './transactions'
import ddp from './ddp'
 
function lastAction(state = null, action) {
  return action;
}


const rootReducer = reduceReducers(ddp.reducer,combineReducers({
    router,
    auth,
    [transactions.constants.NAME]: transactions.reducer,
    lastAction,
}));

export default rootReducer;

