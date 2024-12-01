import {useCallback} from 'react';
import {db} from '../../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {Payment} from '../interfaces/models/payment';
import {getCategoryCollection, useCategory} from './category';
import useAuth from '../hooks/useAuth';

export const getPaymentCollection = (userId: string) =>
  collection(db, 'users', userId, 'payments');

export const usePayment = () => {
  const {user} = useAuth();
  if (user === null) {
    throw new Error('You are not logged in');
  }
  const paymentCollection = getPaymentCollection(user.uid);
  const budgetCollection = getCategoryCollection(user.uid)

  const getPayments = async () => {
    const result = await getDocs(
      query(paymentCollection, orderBy('created_on', 'desc')),
    );
    const paymentDocs = result.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as any[];

    return Promise.all(
      paymentDocs.map(async p => {
        let payment = p;
        payment.account = (await getDoc(p.account)).data();
        if (payment.category)
          payment.category = (await getDoc(p.category)).data();
        payment.created_on = new Date(p.created_on.seconds * 1000);
        return payment as WithId<Payment>;
      }),
    );
  };

  const getPaymentsById = useCallback((budgetId: string) => {
    return query(
      paymentCollection,
      where('category', '==', doc(budgetCollection, budgetId)),
    );
  }, []);

  return {getPayments, getPaymentsById, paymentCollection};
};
