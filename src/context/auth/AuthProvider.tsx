import {PropsWithChildren, useState} from 'react';
import AuthContext from './AuthContext';
import useAuth from '@/src/hooks/useAuth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import {is} from 'date-fns/locale';
import {create} from 'react-test-renderer';

function AuthProvider(props: PropsWithChildren) {
  const {children} = props;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string, isNewUser = false) => {
    const auth = getAuth();
    setLoading(true);
    if (isNewUser) {
      await createUserWithEmailAndPassword(auth, username, password)
        .then(userCredential => {
          const user = userCredential.user;
          setUser(user);
        })
        .catch(error => {console.log(error)})
        .finally(() => {
          setLoading(false);
        });
    } else {
      await signInWithEmailAndPassword(auth, username, password)
        .then(userCredential => {
          const user = userCredential.user;
          setUser(user);
        })
        .catch(error => {console.log(error)})
        .finally(() => {
          setLoading(false);
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
