import {db} from '../../firebase';
import {
  addDoc,
  collection,
  count,
  doc,
  getAggregateFromServer,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  sum,
  where,
} from 'firebase/firestore';
import {Budget, Limit} from '../interfaces/models/budget';
import {format} from 'date-fns';
import {getPaymentsById} from './payment';

const categoryCollection = collection(db, 'budgets');

export const getCategory = (id: string) => doc(categoryCollection, id);

export const getBudgets = () =>
  getDocs(categoryCollection).then(
    async result =>
      (await Promise.all(
        result.docs.map(async _doc => {
          const limitCollection = collection(
            doc(categoryCollection, _doc.id),
            'limit',
          );
          const limit = (
            await getDocs(
              query(
                limitCollection,
                where('month', '==', format(new Date(), 'MMM yy')),
              ),
            )
          ).docs.at(0);
          const paymentTotal = (await getDocs(getPaymentsById(_doc.id))).docs.flatMap(d => d.data().amount).reduce((p, c) => p + c, 0)
          return {
            ...(_doc.data() as Budget),
            limit: limit ? {...limit.data(), id: limit.id} : undefined,
            id: _doc.id,
            expense: limit ? paymentTotal: undefined
          };
        }),
      )) as (WithId<Budget> & {expense?: number})[],
  );

export const getBudgetCollection = () => categoryCollection;

export const addLimit = async (budgetId: string, limit: Limit) => {
  const limitCollection = doc(categoryCollection, budgetId);
  await addDoc(collection(limitCollection, 'limit'), {
    ...limit,
    month: format(new Date(), 'MMM yy'),
  });
};
