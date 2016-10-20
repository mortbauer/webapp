import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import DebouncedInput from './DebouncedInput';

const Transaction = ({data}) => (
    <div className="mycontainer">
        <div className="myitem" style={{width:'5em'}}>{data.get('order_group_id')?data.get('order_group_id'):''}</div>
        <div className="myitem" style={{width:'5em'}}>{data.get('id')}</div>
        <div className="myitem" style={{width:'7em'}}>{data.get('date')}</div>
        <div className="myitem" style={{width:'5em'}}>{data.get('amount')}</div>
        <div className="myitem" style={{width:'14em'}}>{data.get('iban_knr')}</div>
        <div className="myitem" >{data.get('comment')}</div>
    </div>
)

Transaction.propTypes = {
  data: PropTypes.object.isRequired
}

const EditTransaction = ({onChange,data}) => (
    <div className="mycontainer">
        <DebouncedInput style={{width:'5em'}} value={data.get('order_group_id')?data.get('order_group_id'):''} onChange={onChange}/>
        <div className="myitem" style={{width:'5em'}}>{data.get('id')}</div>
        <div className="myitem" style={{width:'7em'}}>{data.get('date')}</div>
        <div className="myitem" style={{width:'5em'}}>{data.get('amount')}</div>
        <div className="myitem" style={{width:'14em'}}>{data.get('iban_knr')}</div>
        <div className="myitem" >{data.get('comment')}</div>
    </div>
)

EditTransaction.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}
export { Transaction, EditTransaction}
