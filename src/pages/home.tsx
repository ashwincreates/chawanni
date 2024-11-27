import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from '../tabs/dashboard';
import Payments from '../tabs/payments';
import Accounts from '../tabs/accounts';
import Budgets from '../tabs/budgets';
import {BottomNavigation, FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CommonActions} from '@react-navigation/native';
import withProtection from '../components/ProtectedScreen';
import {forwardRef} from 'react';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <>
      <Tab.Navigator
        tabBar={({navigation, state, descriptors, insets}) => (
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({route, preventDefault}) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({route, focused, color}) => {
              const {options} = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({focused, color, size: 24});
              }

              return null;
            }}
            getLabelText={({route}) => {
              const {options} = descriptors[route.key];
              return options.title || route.name;
            }}
          />
        )}
        screenOptions={{
          headerShadowVisible: false,
          sceneStyle: {backgroundColor: 'white'},
        }}
        initialRouteName="dashboard">
        <Tab.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({color, size}) => {
              return <Icon name="home" size={size} color={color} />;
            },
          }}
          component={Dashboard}
        />
        <Tab.Screen
          name="payments"
          options={{
            title: 'Payments',
            tabBarIcon: ({color, size}) => {
              return <Icon name="view-list" size={size} color={color} />;
            },
          }}
          component={Payments}
        />
        <Tab.Screen
          name="accounts"
          options={{
            title: 'Accounts',
            tabBarIcon: ({color, size}) => {
              return <Icon name="bank" size={size} color={color} />;
            },
          }}
          component={Accounts}
        />
        <Tab.Screen
          name="budgets"
          options={{
            title: 'Budgets',
            tabBarIcon: ({color, size}) => {
              return <Icon name="tag" size={size} color={color} />;
            },
          }}
          component={Budgets}
        />
      </Tab.Navigator>
    </>
  );
}

export default forwardRef((props, _) => withProtection(<HomeScreen {...props} />));
