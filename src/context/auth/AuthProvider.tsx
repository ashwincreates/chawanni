import {PropsWithChildren, useEffect, useState} from 'react';
import AuthContext from './AuthContext';
import {
  createUserWithEmailAndPassword,
  inMemoryPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import {auth} from '../../../firebase';
import { addUser } from '../../api/users';

function AuthProvider(props: PropsWithChildren) {
  const {children} = props;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    username: string,
    password: string,
    isNewUser = false,
  ) => {
    setLoading(true);
    if (isNewUser) {
      await createUserWithEmailAndPassword(auth, username, password)
        .then(async userCredential => {
          const user = userCredential.user;
          await addUser(user);
          setUser(user);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      await setPersistence(auth, inMemoryPersistence).then(() => {
        signInWithEmailAndPassword(auth, username, password)
          .then(userCredential => {
            const user = userCredential.user;
            setUser(user);
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, login, loading, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
