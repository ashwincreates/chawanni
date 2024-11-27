import {
  DocumentData,
  getAggregateFromServer,
  getDocs,
  Query,
  query,
  sum,
  where,
} from 'firebase/firestore';
import {getPaymentCollection, getPayments} from './payment';
import {Payment, PaymentEnum} from '../interfaces/models/payment';
import {Analytics} from '../interfaces/models/dashboard';
import {format} from 'date-fns';

export const getAnalytics = async () => {
  const expenseQuery = query(
    getPaymentCollection(),
    where('type', '==', PaymentEnum.Expense),
  );
  const incomeQuery = query(
    getPaymentCollection(),
    where('type', '==', PaymentEnum.Income),
  );
  const getTotalSum = (query: Query<DocumentData>) =>
    getAggregateFromServer(query, {
      value: sum('amount'),
    });

  const expense = (await getTotalSum(expenseQuery)).data().value;
  const income = (await getTotalSum(incomeQuery)).data().value;

  return {
    [Analytics.Expense]: expense,
    [Analytics.Income]: income,
    [Analytics.Saving]: income - expense,
  };
};

export const getPaymentAnalytics = async () => {
  const expenses = (
    await getDocs(
      query(getPaymentCollection(), where('type', '==', PaymentEnum.Expense)),
    )
  ).docs;
  const incomes = (
    await getDocs(
      query(getPaymentCollection(), where('type', '==', PaymentEnum.Income)),
    )
  ).docs;

  const getPaymentsPerTime = (fmt: string) =>
    Object.entries(
      expenses.reduce((p, c) => {
        const data = c.data()
        const payment = {...data, created_on: new Date(data.created_on * 1000)} as Payment;
        const label = format(payment.created_on, fmt);
        if (!p[label]) p[label] = [];
        p[label].push(payment);
        return p;
      }, {} as {[key: string]: Payment[]}),
    ).map(([label, payments]) => ({
      label,
      value: payments.reduce((p, c) => p + c.amount, 0),
    }));

  return {
    [Analytics.Expense]: getPaymentsPerTime('dd-MM'),
    [Analytics.Income]: getPaymentsPerTime('dd-MM')
  };
};
