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
    constructor(to_sync=[]){
        this.to_sync = to_sync;
        this.enable_actor = true;
        this.state = null;
        this.store = null;
        this.incoming = [];
        this.pending = new Map();
    }
    
    enable_backsync(){
        this.enable_actor = true;
    }

    disable_backsync(){
        this.enable_actor = false;
    }

    subscribe(store){
        this.store = store;
        this.state = store.getState();
        this.store.subscribe(this.actor);
    }

    actor = () => {
        const state = this.store.getState();
        if (this.enable_actor){
            //console.log('syncActor',this.enable_actor,state.get('lastAction'));
            this.enable_actor = false;
            if (!Immutable.is(state,this.state)){
                this.to_sync.forEach(spec => {
                    let prev = this.state.getIn(spec.collection)
                    let cur = state.getIn(spec.collection)
                    let changed = diffMap(prev,cur)
                    if (changed.length){
                        console.log('need backsync',spec.collection,changed);
                    }
                })
            }
            this.enable_actor = true;
        }
        this.state = state
    }

    merge = debounce(function(){
        this.store.dispatch({type:'MERGE_FROM_SERVER',msgs:[...this.incoming]})
        this.incoming.length=0
    },200)

    send_to_redux = (data) => {
        this.disable_backsync();
        switch (data.msg){
            case 'added':
                this.incoming.push(data);
                this.merge();
                break;
            case 'result':
                const status = data.hasOwnProperty('result') ? 'SUCESS' : 'FAILED'
                const {msg,id,...action} = data 
                action.type = `${this.pending[data.id]}_${status}`
                this.store.dispatch(action)
                break;
            case 'ready':
                this.store.dispatch({
                    type:'SUBS_READY',
                    ids:data.subs,
                })
                break;
        }
        this.enable_backsync();
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
