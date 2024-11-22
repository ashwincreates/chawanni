import {Account} from './models/account';
import {Budget} from './models/budget';
import {Payment} from './models/payment';

export type RouteParamList = {
  Home: any;
  Category: {item: WithId<Budget>} | undefined;
  Account: {account: WithId<Account>} | undefined;
  Payment: {payment: WithId<Payment>} | undefined;
  QR: any;
  UPI: {uri: string};
};
