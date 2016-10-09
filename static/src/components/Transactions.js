import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/transactions';
import TextField from 'material-ui/TextField';
import Transaction from './Transaction';
import { getVisibleTransactions } from '../selectors';
import Infinite from 'react-infinite';
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
        return this.props.transactions.map(
            t => <Transaction key={t.get('id')} onChange={(e)=>this.editIdValue(t.get('id'),e)} data={t}/>)
    }

    render() {
        return (
                <div>
                    <h1>Transactions</h1>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div>
                            <label style={{fontSize:'10'}}>Filter Comment</label>
                            <DebouncedInput
                                id="filter_comment"
                                placeholder="Filter Comment"
                                onChange={(value) =>this.props.setFilter('comment',value)}
                                value={this.props.filter.get('comment')}
                            />
                        </div>
                        <div>
                            <label style={{fontSize:'10'}}>Filter Amount</label>
                            <DebouncedInput
                                id="filter_amount"
                                placeholder="Filter Amount"
                                hintText="Filter Amount"
                                floatingLabelText="Filter Amount"
                                onChange={(value) =>this.props.setFilter('amount',value)}
                                value={this.props.filter.get('amount')}
                            />
                        </div>
                        <div>
                            <label style={{fontSize:'10'}}>Filter Date</label>
                            <DebouncedInput
                                id="filter_date"
                                placeholder="Filter Date"
                                hintText="Filter Date"
                                floatingLabelText="Filter Date"
                                onChange={(value) =>this.props.setFilter('date',value)}
                                value={this.props.filter.get('date')}
                            />
                        </div>
                    </div>
                    <Infinite containerHeight={800} elementHeight={20}>
                        {this.renderTransactions()}
                    </Infinite>
                </div>
        );
    }
}
