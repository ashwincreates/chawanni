import {db} from '../../firebase';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {Budget, Limit} from '../interfaces/models/budget';
import {format} from 'date-fns';
import useAuth from '../hooks/useAuth';
import {usePayment} from './payment';

export const getCategoryCollection = (userId: string) =>
  collection(db, 'users', userId, 'budgets');

export const useCategory = () => {
  const {user} = useAuth();
  const {getPaymentsById} = usePayment();
  if (user === null) {
    throw new Error('You are not logged in');
  }
  const categoryCollection = getCategoryCollection(user.uid);

  const getCategory = (id: string) => doc(categoryCollection, id);

  const getBudgets = async () => {
    const result = await getDocs(categoryCollection);
    return await Promise.all(
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
        const paymentTotal = (await getDocs(getPaymentsById(_doc.id))).docs
          .flatMap(d => d.data().amount)
          .reduce((p, c) => p + c, 0);
        return {
          ...(_doc.data() as Budget),
          limit: limit ? {...limit.data(), id: limit.id} : undefined,
          id: _doc.id,
          expense: limit ? paymentTotal : undefined,
        } as WithId<Budget> & {expense: number};
      }),
    );
  };

  const getBudgetCollection = () => categoryCollection;

  const addLimit = async (budgetId: string, limit: Limit) => {
    const limitCollection = doc(getBudgetCollection(), budgetId);
    await addDoc(collection(limitCollection, 'limit'), {
      ...limit,
      month: format(new Date(), 'MMM yy'),
    });
  };

  return {
    getCategory,
    getBudgets,
    getBudgetCollection,
    addLimit,
  };
};
