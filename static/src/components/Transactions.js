import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/transactions';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { VirtualScroll, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

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
        var list = [
            'hallo',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'hallo',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'hallo',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'hallo',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin',
            'hallo',
            'martin'
            ];
        return (
            <div>

                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>Transactions</h1>
                            <AutoSizer disableHeight>
                            {({ width }) => (
                                <VirtualScroll 
                                    width={700}
                                    height={500}
                                    rowCount={list.length}
                                    rowHeight={20}
                                    rowRenderer={
                                        ({index, isScrolling})=>list[index]
                                    }
                                />
                            )}
                            </AutoSizer>
                    </div>
                }
            </div>
        );
    }
}




