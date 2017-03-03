import { combineReducers } from 'redux-immutable';
import reduceReducers from 'reduce-reducers';
import auth from './reducers/auth'
import router from './reducers/router'
import foodcoop from './foodcoop'
import ddp from './ddp'
 
function lastAction(state = null, action) {
  return action;
}

const rootReducer = reduceReducers(ddp.reducer,combineReducers({
    router,
    auth,
    [foodcoop.constants.NAME]: foodcoop.reducer,
    lastAction,
}));

export default rootReducer;

