import {MERGE,BACKSYNC} from './actionTypes';
import debounce from 'debounce';
import Immutable from 'immutable';

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

export default class BackSyncer{
    constructor(rootKey=null,to_sync=[]){
        this.rootKey = rootKey;
        this.state = null;
        this.to_sync = to_sync;
        this.store = null;
        this.incoming = [];
        this.pending = new Map();
    }
    
    subscribe(store){
        this.store = store;
        if (this.rootKey !== null){
            this.state = store.getState().get(this.rootKey);
        } else {
            this.state = store.getState();
        }
        this.store.subscribe(this.actor);
    }

    actor = () => {
        var state = this.store.getState();
        const disable_backsync = state.get('lastAction')['disable_backsync']; 
        if (this.rootKey !== null){
            state = state.get(this.rootKey)
        }
        if (!disable_backsync){
            if (!Immutable.is(state,this.state)){
                this.to_sync.forEach(key => {
                    let prev = this.state.get(key)
                    let cur = state.get(key)
                    let changed = diffMap(prev,cur)
                    if (changed.length){
                        this.store.dispatch({
                            disable_backsync:true,
                            type:BACKSYNC,
                            collection:key,
                            changed:changed,
                        });
                    }
                })
            }
        }
        this.state = state
    }

    dispatch_merge = debounce(function(){
        this.store.dispatch({type:MERGE,disable_backsync:true,msgs:[...this.incoming]})
        this.incoming.length=0
    },200)

    send_to_redux = (data) => {
        switch (data.msg){
            case 'added':
                this.incoming.push(data);
                this.dispatch_merge();
                break;
            case 'result':
                const status = data.hasOwnProperty('result') ? 'SUCESS' : 'FAILED'
                const {msg,id,...action} = data 
                action.disable_backsync = true
                action.type = `${this.pending[data.id]}_${status}`
                this.store.dispatch(action)
                break;
            case 'ready':
                this.store.dispatch({
                    type:'SUBS_READY',
                    ids:data.subs,
                    disable_backsync:true,
                })
                break;
        }
    }

    createMiddleware(send_to_backend){
        let counter = 0
        return store => next => action => {
            if ((action.type == 'SUBSCRIBE')){
                let id = (counter++).toString()
                let msg = {msg: 'sub',name: action.name,id: id};
                //if (action.ddp.msg == 'method'){
                    //pending.set(id,action.type)
                //}
                send_to_backend(msg);
            }
            return next(action);
        }
    }


};
