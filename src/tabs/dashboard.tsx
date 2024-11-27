import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Dimensions,
  FlatList,
  PermissionsAndroid,
  ScrollView,
  View,
} from 'react-native';
import {Card, FAB, Icon, MD3Colors, Text} from 'react-native-paper';
import {RouteParamList} from '../interfaces/routes';
import {useQueries} from 'react-query';
import {getAnalytics, getPaymentAnalytics} from '../api/dashboard';
import {Analytics} from '../interfaces/models/dashboard';
import {LineChart} from 'react-native-chart-kit';
import useAuth from '../hooks/useAuth';
import NavigationOptions from '../components/utils/NavigationOptions';

export default function Dashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RouteParamList, 'QR'>>();
    const {user} = useAuth();

  const [cards, lines] = useQueries([
    {
      queryFn: () => getAnalytics(),
      queryKey: 'dashboard-cards',
    },
    {
      queryFn: () => getPaymentAnalytics(),
      queryKey: 'dashboard-lines',
    },
  ]);

  const icons = {
    [Analytics.Expense]: 'arrow-down',
    [Analytics.Income]: 'arrow-up',
    [Analytics.Saving]: 'bank',
  };

  return (
    <>
      <NavigationOptions options={{headerRight: () => <Text>{user?.email}</Text>}} />
      <FlatList
        data={Object.entries(cards.data ?? {})}
        numColumns={2}
        style={{flex: 1}}
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        columnWrapperStyle={{gap: 12}}
        renderItem={({item: [entry, value]}) => (
          <Card key={entry} style={{flex: 0.5}}>
            <Card.Content style={{flexDirection: 'row', gap: 8}}>
              <Icon source={icons[entry as Analytics]} size={24} />
              <View>
                <Text style={{textTransform: 'capitalize'}}>{entry}</Text>
                <Text variant="headlineSmall" style={{fontWeight: 700}}>
                  {value}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
        ListFooterComponent={
          <ScrollView>
            {lines.data && (
              <LineChart
                data={{
                  labels: lines.data?.expense.map(e => e.label),
                  datasets: [
                    {
                      data: lines.data?.expense.map(e => e.value),
                    },
                  ],
                }}
                width={Dimensions.get('window').width} // from react-native
                height={220}
                chartConfig={{
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  color: () => MD3Colors.primary50,
                  propsForLabels: {
                    scale: 0,
                  },
                }}
                withHorizontalLabels={false}
                withInnerLines={false}
                withOuterLines={false}
                bezier
                style={{marginTop: 16}}
              />
            )}
          </ScrollView>
        }
      />
      <FAB
        icon={'contactless-payment'}
        mode="flat"
        onPress={async () => {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Cool Photo App Camera Permission',
              message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED)
            navigation.navigate('QR');
        }}
        style={{position: 'absolute', bottom: 16, right: 16}}
        label="Make a payment"
      />
    </>
  );
}
