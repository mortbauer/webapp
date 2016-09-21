import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/transactions';
import TextField from 'material-ui/TextField';
import Transaction from './Transaction';
import { getVisibleTransactions } from '../selectors';
import Infinite from 'react-infinite';

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
export default class TransactionView extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.fetchTransactions();
    }


    fetchTransactions() {
        this.props.loadTransactions(this.props.token);
    }

    editIdValue(id,event){
        this.props.editIdValue(id,'amount',event.target.value);
    }

    renderTransactions(){
        return this.props.transactions.map(t => <Transaction key={t.get('id')} onChange={(e)=>this.editIdValue(t.get('id'),e)} data={t}/>)
    }

    render() {
        return (
                <div>
                    <h1>Transactions</h1>
                    <TextField
                        id="filter_comment"
                        hintText="Filter Comment"
                        floatingLabelText="Filter Comment"
                        onChange={(e) =>this.props.setFilter('comment',e.target.value)}
                        defaultValue={this.props.filter.comment}
                    />
                    <TextField
                        id="filter_amount"
                        hintText="Filter Amount"
                        floatingLabelText="Filter Amount"
                        onChange={(e) =>this.props.setFilter('amount',e.target.value)}
                        defaultValue={this.props.filter.amount}
                    />
                    <TextField
                        id="filter_date"
                        hintText="Filter Date"
                        floatingLabelText="Filter Date"
                        onChange={(e) =>this.props.setFilter('date',e.target.value)}
                        defaultValue={this.props.filter.date}
                    />
                    <Infinite containerHeight={800} elementHeight={20}>
                        {this.renderTransactions()}
                    </Infinite>
                </div>
        );
    }
}
