import Immutable from 'immutable';

//merges data from the backend into the state as a store enhancer, inspired by
//the store enhancer of autoRehydrate from the redux-persist package
//https://github.com/rt2zz/redux-persist

//redux store enhancer, not a middleware
export default function mergeFromServer (config = {}) {
  const merger = config.merger || defaultMerger

  return (next) => (reducer, initialState, enhancer) => {
    let store = next(liftReducer(reducer), initialState, enhancer)
    return {
      ...store,
      replaceReducer: (reducer) => {
        return store.replaceReducer(liftReducer(reducer))
      }
    }
  }

  function liftReducer (reducer) {
    return (state, action) => {
      if (action.type !== 'MERGE_FROM_SERVER') {
        return reducer(state, action)
      } else {
        return merger(state, action.msgs, config.log)
      }
    }
  }
}

function diffMap(a,b){
    // diffs two immutables 
    let changed = []
    if (!Immutable.is(a,b)){
        a.keySeq().forEach(k => {
            if (!b.has(k)){
                changed.push({op:'removed','id':k})
            }
        })
        b.keySeq().forEach(k => {
            if (!a.has(k)){
                changed.push({op:'added','id':k})
            } else {
                let val_a = a.get(k)
                let val_b = b.get(k)
                if (!Immutable.is(val_a,val_b)){
                    changed.push({op:'changed','id':k})
                }
            }
        })
    }
    return changed
}

function defaultMerger(state,msgs,log){
    let incoming_unmerged = Immutable.List();
    return msgs.reduce((state,msg)=>{
        let new_data = Immutable.fromJS(msg.fields)
        if (!state.hasIn(['foodcoop',msg.collection,msg.id])){
            return state.setIn(['foodcoop',msg.collection,msg.id],new_data)
        } else
        {
            let cur_data = state.getIn(['foodcoop',msg.collection,msg.id])
            if (cur_data.hashCode() != new_data.hashCode()){
                return state.set(
                    'incoming_unmerged',state.get(
                        'incoming_unmerged',incoming_unmerged).push(
                            [msg.collection,msg.id,new_data]))
            } else {
                return state
            }
        }
    },state)
}
