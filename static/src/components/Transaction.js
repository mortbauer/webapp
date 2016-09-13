import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

export default class Transaction extends React.Component {

  static propTypes = {
      transaction: PropTypes.object.isRequired
  }

  render() {
    const { id, amount, comment, iban_knr, date} = this.props.transaction;
    return (
        <div className="mycontainer">
            <input type="text" style={{width:'2em'}} placeholder="test"/>
            <div className="myitem" style={{width:'5em'}}>{id}</div>
            <div className="myitem" style={{width:'7em'}}>{date}</div>
            <div className="myitem" style={{width:'5em'}}>{amount}</div>
            <div className="myitem" style={{width:'14em'}}>{iban_knr}</div>
            <div className="myitem" >{comment}</div>
        </div>
    );
  }
}
