import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/transactions';
import TextField from 'material-ui/TextField';
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
        this.state = {
            filter_comment:'',
        };
    }

    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        let token = this.props.token;
        this.props.loadTransactions(token);
    }

   changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state)
    }


    render() {
        var rows = [];
        if (this.props.loaded == true){
            this.props.data.forEach((transaction) => {
                if (transaction.comment.indexOf(this.state.filter_comment) === -1) {
                    return;
                }
                rows.push(<Transaction key={transaction.id} transaction={transaction}/>)
            });
        };
        return (
            <div>

                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>Transactions</h1>
                        <TextField
                            id="filter_comment"
                            hintText="Filter Comment"
                            floatingLabelText="Filter Comment"
                            onChange={(e) =>this.changeValue(e, 'filter_comment')}
                        />
                        <Infinite containerHeight={600} elementHeight={60}>
                            {rows}
                        </Infinite>
                    </div>
                }
            </div>
        );
    }
}




