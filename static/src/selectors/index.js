import { createSelector } from 'reselect'

const getComment = (state, props) => state.transactions.filter.comment

const getDate = (state, props) => state.transactions.filter.date

const getTransactions = (state) => state.transactions.data.slice(0,-1)

export const getTransactionsFilteredByDate = createSelector(
  [ getDate, getTransactions ],
  (date, transactions) => {
      return transactions.filter(t => t.date > date )
  }
)

export const getVisibleTransactions = createSelector(
  [ getComment, getTransactionsFilteredByDate ],
  (comment, transactions) => {
      return transactions.filter(t => t.comment.indexOf(comment) != -1 )
  }
)
