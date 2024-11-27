import {
  forwardRef,
  FunctionComponent,
  ReactElement,
  ReactNode,
  useEffect,
} from 'react';
import useAuth from '../hooks/useAuth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteParamList} from '../interfaces/routes';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

function withProtection(component: ReactNode): ReactNode {
  const {user, loading} = useAuth();
  const navigate = useNavigation<NativeStackNavigationProp<RouteParamList>>();

  useEffect(() => {
    if (!user && !loading) {
      navigate.navigate('Login');
    }
  });

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return component;
}

export default withProtection;
