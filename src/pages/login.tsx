import {Formik} from 'formik';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import useAuth from '../hooks/useAuth';
import NavigationOptions from '../components/utils/NavigationOptions';
import {
  Link,
  StackNavigationState,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteParamList} from '../interfaces/routes';

function Login() {
  const {login} = useAuth();
  const navigate = useNavigation<NativeStackNavigationProp<RouteParamList>>();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        flexGrow: 1,
        paddingTop: 64,
        gap: 8,
      }}>
      <NavigationOptions options={{headerShown: false}} />
      <View style={{marginBottom: 32}}>
        <Text variant="headlineSmall">Login</Text>
        <Text>Hi Welcome, login to your account to save your money</Text>
      </View>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={values =>
          login(values.email, values.password).then(() =>
            navigate.navigate('Home'),
          )
        }>
        {({handleChange, handleBlur, handleSubmit}) => (
          <>
            <TextInput
              label="Email"
              mode="outlined"
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <TextInput
              label="Password"
              mode="outlined"
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            <Link screen="Register">New User? Register here</Link>
            <Button
              icon="login"
              mode="contained"
              onPress={() => handleSubmit()}>
              Login
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
}

export default Login;
