import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Infinite from 'react-infinite';
import Immutable from 'immutable';

import * as actionCreators from '../actions';
import { getDenormalizedTransactions } from '../selectors';

import { Transaction, EditTransaction} from './Transaction';
import DebouncedInput from './DebouncedInput';

function mapStateToProps(state) {
    return {
        token: state.getIn(['auth','token']),
        filter: state.getIn(['foodcoop','transactions_view','filter']),
        isFetching: state.getIn(['foodcoop','transactions_view','isFetching']),
        transactions: getDenormalizedTransactions(state),
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}


@connect(mapStateToProps, mapDispatchToProps)
export default class Transactions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_editing: false
        };
    }

    componentDidMount() {
        this.props.loadTransactions();
        this.props.loadOrderGroups();
    }


    editOrderGroup(id,value){
        this.props.setOrderGroup(id,value);
    }

    toggleEditing(event){
        this.setState({'is_editing':!this.state.is_editing});
    }

    renderTransactions(){
        if (!this.state.is_editing){
            return this.props.transactions.valueSeq().map((t)=> {
                return <Transaction key={t.get('id')} data={t}/>
            })
        }
        else {
            return this.props.transactions.valueSeq().map((t)=>{
                return <EditTransaction key={t.get('id')} onChange={(v)=>this.editOrderGroup(t.get('id'),v)} data={t}/>
            })
        }
    }

    render() {
        return (
                <div>
                    <h1>Transactions New</h1>
                     <RaisedButton 
                        type="button" 
                        onClick={this.toggleEditing.bind(this)}
                        style={{"marginTop": 50}} 
                        label={this.state.is_editing ? "Stop Editing" : "Edit"}
                    />
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div>
                            <label style={{fontSize:'10px'}}>Filter Comment</label>
                            <DebouncedInput
                                id="filter_comment"
                                placeholder="Filter Comment"
                                onChange={(value) =>this.props.setFilter('comment',value)}
                                value={this.props.filter.get('comment')}
                            />
                        </div>
                        <div>
                            <label style={{fontSize:'10px'}}>Filter Amount</label>
                            <DebouncedInput
                                id="filter_amount"
                                placeholder="Filter Amount"
                                onChange={(value) =>this.props.setFilter('amount',value)}
                                value={this.props.filter.get('amount')}
                            />
                        </div>
                        <div>
                            <label style={{fontSize:'10px'}}>Filter Date</label>
                            <DebouncedInput
                                id="filter_date"
                                placeholder="Filter Date"
                                onChange={(value) =>this.props.setFilter('date',value)}
                                value={this.props.filter.get('date')}
                            />
                        </div>
                    </div>
                    <div className="mycontainer">
                        <div className="myitem" style={{width:'5em'}}>group</div>
                        <div className="myitem" style={{width:'5em'}}>id</div>
                        <div className="myitem" style={{width:'7em'}}>date</div>
                        <div className="myitem" style={{width:'5em'}}>amount</div>
                        <div className="myitem" style={{width:'14em'}}>iban_knr</div>
                        <div className="myitem" >comment</div>
                    </div>
                    <Infinite containerHeight={800} elementHeight={20}>
                        { this.renderTransactions() }
                    </Infinite>
                </div>
        );
    }
}
