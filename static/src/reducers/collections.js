import Immutable from 'immutable';
import {createReducer} from '../utils/misc';

const initialState = Immutable.Map({
    users: Immutable.Map(),
    order_groupds: Immutable.Map(),
    transactions: Immutable.Map(),
});

export default createReducer(initialState, {
});

