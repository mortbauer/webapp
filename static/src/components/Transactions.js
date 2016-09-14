import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/transactions';
import TextField from 'material-ui/TextField';
import Transaction from './Transaction';
import { getVisibleTransactions } from '../selectors';
import Infinite from 'react-infinite';
import PureRenderMixin from 'react-addons-pure-render-mixin';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        filter: state.transactions.filter,
        isFetching: state.transactions.isFetching,
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

    updateCommentFilter(value) {
        if (value.length >= 3){
            this.props.setCommentFilter(value)
        }
        else {
            this.props.setCommentFilter('')
        }

    }

    render() {
        return (
                <div>
                    <h1>Transactions</h1>
                    <TextField
                        id="filter_comment"
                        hintText="Filter Comment"
                        floatingLabelText="Filter Comment"
                        onChange={(e) =>this.updateCommentFilter(e.target.value)}
                        defaultValue={this.props.filter.comment}
                    />
                    <TextField
                        id="filter_date"
                        hintText="Filter Date"
                        floatingLabelText="Filter Date"
                        onChange={(e) =>this.props.setDateFilter(e.target.value)}
                        defaultValue={this.props.filter.date}
                    />
                    <TransactionList transactions={this.props.transactions}/>
                </div>
        );
    }
}

class TransactionList extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  
  renderTransactions(){
      return this.props.transactions.map(t => <Transaction key={t.id} transaction={t}/>)
  }

  render() {
    return (
        <Infinite containerHeight={800} elementHeight={20}>
            {this.renderTransactions()}
        </Infinite>
    )
  }
}

                   

