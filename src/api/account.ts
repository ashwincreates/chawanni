import {db} from '../../firebase';
import {collection, doc, getDoc, getDocs} from 'firebase/firestore';
import {Account} from '../interfaces/models/account';

const accountCollection = collection(db, 'accounts');

export const getAccount = (id: string) => doc(accountCollection, id)

export const getAccounts = () => getDocs(accountCollection).then(
  result =>
    result.docs.map(doc => ({
      ...(doc.data() as Account),
      id: doc.id,
    })) as WithId<Account>[],
);
