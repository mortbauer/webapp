import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const Transaction = ({onChange,data}) => (
    <div className="mycontainer">
        <input type="text" style={{width:'2em'}} placeholder="test" value='t' onChange={onChange}/>
        <div className="myitem" style={{width:'5em'}}>{data.get('id')}</div>
        <div className="myitem" style={{width:'7em'}}>{data.get('date')}</div>
        <div className="myitem" style={{width:'5em'}}>{data.get('amount')}</div>
        <div className="myitem" style={{width:'14em'}}>{data.get('iban_knr')}</div>
        <div className="myitem" >{data.get('comment')}</div>
    </div>
)

Transaction.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}

export default Transaction
