import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './pages/home';
import {MD3LightTheme, PaperProvider} from 'react-native-paper';
import {StatusBar} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import Category from './pages/category';
import {RouteParamList} from './interfaces/routes';
import Account from './pages/account';
import Payments from './pages/payments';
import QRScanner from './pages/qrscanner';
import UpiPayment from './pages/upi';
import AuthProvider from './context/auth/AuthProvider';
import Login from './pages/login';
import ProtectedScreen from './components/ProtectedScreen';
import Register from './pages/register';

const Stack = createNativeStackNavigator<RouteParamList>();

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <AuthProvider>
        <QueryClientProvider client={new QueryClient()}>
          <NavigationContainer>
            <StatusBar backgroundColor={'white'} barStyle="dark-content" />
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShadowVisible: false,
                contentStyle: {backgroundColor: 'white'},
              }}>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Category" component={Category} />
              <Stack.Screen name="Account" component={Account} />
              <Stack.Screen name="Payment" component={Payments} />
              <Stack.Screen name="QR" component={QRScanner} />
              <Stack.Screen name="UPI" component={UpiPayment} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default App;
