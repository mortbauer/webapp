import { createSelector } from 'reselect'

const getComment = (state, props) => state.transactions.filter.comment

const getDate = (state, props) => state.transactions.filter.date

const getAmount = (state, props) => state.transactions.filter.amount

const getTransactions = (state) => state.transactions.data.slice(0,-1)

export const getTransactionsFilteredByDate = createSelector(
  [ getDate, getTransactions ],
  (date, transactions) => {
      return transactions.filter(t => t.date > date )
  }
)

export const getTransactionsFilteredByAmount = createSelector(
  [ getAmount, getTransactionsFilteredByDate ],
  (amount, transactions) => {
      return transactions.filter(t => t.amount > amount )
  }
)

export const getVisibleTransactions = createSelector(
  [ getComment, getTransactionsFilteredByAmount ],
  (comment, transactions) => {
      return transactions.filter(t => t.comment.indexOf(comment) != -1 )
  }
)
