import {db} from '../../firebase';
import {collection, doc, DocumentData, getDoc, getDocs, orderBy, query, where} from 'firebase/firestore';
import {Payment} from '../interfaces/models/payment';
import { getAccount } from './account';
import { getBudgetCollection, getCategory } from './category';

const paymentCollection = collection(db, 'payments');

export const getPayments = async () =>
  getDocs(query(paymentCollection, orderBy('created_on', 'desc'))).then(result => {
    const paymentDocs: any[] = result.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    return Promise.all(paymentDocs.map(async p => {
      let payment = p
      payment.account = (await getDoc(p.account)).data()
      if (payment.category) payment.category = (await getDoc(p.category)).data()
      payment.created_on = new Date(p.created_on.seconds * 1000)
      return payment as WithId<Payment>
    }))
  });

export const getPaymentCollection = () => paymentCollection

export const getPaymentsById = (budgetId: string) => query(paymentCollection, where('category', '==', doc(getBudgetCollection(), budgetId)))
