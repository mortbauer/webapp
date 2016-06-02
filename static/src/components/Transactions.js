import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/transactions';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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
                        <BootstrapTable data={this.props.data}>
                          <TableHeaderColumn dataField="id" isKey={true}>ID</TableHeaderColumn>
                          <TableHeaderColumn dataField="iban_knr">IBAN</TableHeaderColumn>
                          <TableHeaderColumn dataField="amount">Amount</TableHeaderColumn>
                          <TableHeaderColumn dataField="comment">Comment</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                }
            </div>
        );
    }
}




