import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/transactions';
import {Table, Column, Cell} from 'fixed-data-table';

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

const TextCell = ({rowIndex, data, columnKey, ...props}) => (
  <Cell {...props}>
    {data.getObjectAt(rowIndex)[columnKey]}
  </Cell>
);

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
                        <Table 
                            height={40+((this.props.data.length+1) * 30)}
                            width={1150}
                            rowsCount={this.props.data.length}
                            rowHeight={30}
                            headerHeight={30}
                            rowGetter={(rowIndex)=>{return this.props.data[rowIndex]; }}>
                            <Column 
                                columnKey="id" 
                                header={<Cell> Id</Cell>}
                                cell={<TextCell data={this.props.data}/>}
                                width={50} 
                            />
                            <Column 
                                columnKey="amount" 
                                header={<Cell> Amount</Cell>}
                                cell={<TextCell data={this.props.data}/>}
                                width={50} 
                            />
                        </Table>
                    </div>
                }
            </div>
        );
    }
}




