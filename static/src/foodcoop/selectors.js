import { createSelector } from 'reselect'

const getComment = (state, props) => state.getIn(['foodcoop','transactions_view','filter','comment'])

const getDate = (state, props) => state.getIn(['foodcoop','transactions_view','filter','date'])

const getSortField = (state, props) => state.getIn(['foodcoop','transactions_view','sort_by'])

const getAmount = (state, props) => state.getIn(['foodcoop','transactions_view','filter','amount'])

export const getOrderGroups = (state, props) => state.getIn(['foodcoop','order_groups'])

export const getTransactions = (state) => state.getIn(['foodcoop','transactions'])



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


export const getSortedTransactions = createSelector(
    [ getSortField, getVisibleTransactions ],
  (sorted_by, transactions) => {
      return transactions.sortBy(t => t.get(sorted_by))
  }
)

export const getDenormalizedTransactions = createSelector(
    [getSortedTransactions,getOrderGroups],
    (transactions,order_groups) => {
        return transactions.withMutations(result => {
            return transactions.entrySeq().forEach(([key,data]) => {
                let order_group = order_groups.getIn([data.get('order_group_id'),'name'])
                result.set(key,data.set('order_group',order_group))
            })
        })
    }
)
