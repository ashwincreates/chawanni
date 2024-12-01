import {db} from '../../firebase';
import {collection, doc, getDoc, getDocs} from 'firebase/firestore';
import {Account} from '../interfaces/models/account';
import useAuth from '../hooks/useAuth';

export const useAccount = () => {
  const {user} = useAuth()

  if (user === null) {
    throw new Error('You are not logged in');
  }
  const accountCollection = collection(db, 'users', user?.uid, 'accounts');

  const getAccount = async (id: string) => {
    const accountDoc = await getDoc(doc(accountCollection, id));
    return {...(accountDoc.data() as Account), id: accountDoc.id};
  };

  const getAccounts = async () => {
    const result = await getDocs(accountCollection);
    return result.docs.map(doc => ({
      ...(doc.data() as Account),
      id: doc.id,
    })) as WithId<Account>[];
  };

  return {getAccount, getAccounts, accountCollection};
};
