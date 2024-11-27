import {Formik} from 'formik';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import useAuth from '../hooks/useAuth';
import NavigationOptions from '../components/utils/NavigationOptions';
import { Link } from '@react-navigation/native';

function Register() {
  const {login} = useAuth();
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
        <Text variant="headlineSmall">Register</Text>
        <Text>Hi, create an account to save your money</Text>
      </View>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={values => login(values.email, values.password, true)}>
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
            <Link screen="Login">Existing User? Login here</Link>
            <Button
              icon={'account'}
              mode="contained"
              onPress={() => handleSubmit()}>
              Register
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
}

export default Register;
