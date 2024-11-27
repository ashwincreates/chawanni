import {User} from 'firebase/auth';
import {createContext} from 'react';
import { Email } from 'react-native-camera';

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string, isNewUser?: boolean) => Promise<void>;
  loading: boolean;
  logout: () => void;
}
const AuthContext = createContext<AuthContextProps | null>(null);

export default AuthContext;
