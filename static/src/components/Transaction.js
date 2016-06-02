import React, { PropTypes } from 'react';

export default class Transaction extends React.Component {

  static propTypes = {
      transaction: PropTypes.object.isRequired
  }

  render() {
    const { id, amount, comment, iban_knr, date} = this.props.transaction;
    return (
      <div className="row list-group-item">
        <div className="col-md-1">{id}</div>
        <div className="col-md-1">{date}</div>
        <div className="col-md-1">{amount}</div>
        <div className="col-md-1">{iban_knr}</div>
        <div className="col-md-12">{comment}</div>
      </div>
    );
  }
}
