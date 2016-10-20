import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Infinite from 'react-infinite';

import * as actionCreators from '../actions';
import { getVisibleTransactions } from '../selectors';

import { Transaction, EditTransaction} from './Transaction';
import DebouncedInput from './DebouncedInput';

function mapStateToProps(state) {
    return {
        token: state.getIn(['auth','token']),
        filter: state.getIn(['transactions','filter']),
        isFetching: state.getIn(['transactions','isFetching']),
        transactions: getVisibleTransactions(state),
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
        this.fetchTransactions();
    }


    fetchTransactions() {
        this.props.loadTransactions(this.props.token);
    }

    editOrderGroup(id,value){
        this.props.editOrderGroup(id,value);
    }

    toggleEditing(event){
        this.setState({'is_editing':!this.state.is_editing});
    }

    renderTransactions(){
        if (!this.state.is_editing){
            return this.props.transactions.map(
                t => <Transaction key={t.get('id')} data={t}/>).toArray()
        }
        else {
            return this.props.transactions.map(
                t => <EditTransaction key={t.get('id')} onChange={(v)=>this.editOrderGroup(t.get('id'),v)} data={t}/>).toArray()
        }
    }

    render() {
        return (
                <div>
                    <h1>Transactions</h1>
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
