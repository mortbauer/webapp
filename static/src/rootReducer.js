import { combineReducers } from 'redux-immutable';
import auth from './reducers/auth'
import router from './reducers/router'
import transactions from './transactions'
import { rpcReducerEnhancer } from './middleware/syncer'
 
function lastAction(state = null, action) {
  return action;
}

const rootReducer = combineReducers({
    router,
    auth,
    [transactions.constants.NAME]: transactions.reducer,
    lastAction,
});

export default rootReducer;

