import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/transactions';
import Transaction from './Transaction';
import Infinite from 'react-infinite';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        loaded: state.transactions.loaded,
        isFetching: state.transactions.isFetching,
        data: state.transactions.data,
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
        this.fetchData();
    }


    fetchData() {
        let token = this.props.token;
        this.props.loadTransactions(token);
    }

    render() {
        return (
            <div>

                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>Transactions</h1>
                        <Infinite containerHeight={600} elementHeight={60}>
                            {this.props.data.map((transaction) => {
                            return (
                                <Transaction key={transaction.id}
                                    transaction={transaction}
                                />
                            );
                            })}
                        </Infinite>
                    </div>
                }
            </div>
        );
    }
}




