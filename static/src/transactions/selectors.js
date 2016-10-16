import { createSelector } from 'reselect'

const getComment = (state, props) => state.getIn(['transactions','filter','comment'])

const getDate = (state, props) => state.getIn(['transactions','filter','date'])

const getAmount = (state, props) => state.getIn(['transactions','filter','amount'])

export const getTransactions = (state) => state.getIn(['transactions','data'])

export const getTransactionsFilteredByDate = createSelector(
  [ getDate, getTransactions ],
  (date, transactions) => {
      if (date == null){
          return transactions
      }
      else{
          return transactions.filter(t => t.get('date') > date )
      }
  }
)

export const getTransactionsFilteredByAmount = createSelector(
  [ getAmount, getTransactionsFilteredByDate ],
  (amount, transactions) => {
      if (amount == null){
          return transactions
      }
      else{
          return transactions.filter(t => t.get('amount') > amount )
      }
  }
)

export const getVisibleTransactions = createSelector(
  [ getComment, getTransactionsFilteredByAmount ],
  (comment, transactions) => {
      if (comment.length > 0){
          return transactions.filter(t => t.get('comment').indexOf(comment) != -1 )
      }
      else{
          return transactions
      }
  }
)
