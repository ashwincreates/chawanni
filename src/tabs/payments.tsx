import { FlatList, View} from 'react-native';
import {Button, Icon, List, Text} from 'react-native-paper';
import NavigationOptions from '../components/utils/NavigationOptions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteParamList} from '../interfaces/routes';
import {useQuery} from 'react-query';
import {Payment, PaymentEnum} from '../interfaces/models/payment';
import {useCallback} from 'react';
import {format} from 'date-fns';
import {usePayment} from '../api/payment';

export default function Payments() {
  const {getPayments} = usePayment();
  const {data, refetch} = useQuery<WithId<Payment>[]>({
    queryKey: 'payments',
    queryFn: () => getPayments(),
  });

  const revisit = useCallback(() => {
    refetch();
  }, []);

  useFocusEffect(revisit);

  const navigate =
    useNavigation<NativeStackNavigationProp<RouteParamList, 'Payment'>>();

  const dateGroups = data?.reduce((prev, curr) => {
    const date = format(curr.created_on, 'yy-MM-dd');
    if (!prev[date]) prev[date] = [];
    prev[date].push(curr);
    return prev;
  }, {} as {[key: string]: WithId<Payment>[]});

  return (
    <>
      <NavigationOptions
        options={{
          headerRight: () => (
            <Button onPress={() => navigate.navigate('Payment')} icon={'plus'}>
              Add Payment
            </Button>
          ),
        }}
      />
      <FlatList
        data={Object.keys(dateGroups ?? {})}
        renderItem={({item}) => {
          return (
            <>
              <Text style={{paddingHorizontal: 16}}>
                {format(item, 'dd MMM')}
              </Text>
              <FlatList
                data={dateGroups?.[item] ?? []}
                renderItem={({item}) => {
                  const isExpense = item.type === PaymentEnum.Expense;
                  return (
                    <List.Item
                      left={({style}) => (
                        <Text style={{...style, fontSize: 24}}>
                          {isExpense ? item.category?.icon : '💵'}
                        </Text>
                      )}
                      title={
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: isExpense ? undefined : 'green',
                          }}>
                          <Icon
                            size={18}
                            source={
                              isExpense
                                ? 'arrow-top-right'
                                : 'arrow-bottom-left'
                            }
                            color="inherit"
                          />
                          {item.amount}
                        </Text>
                      }
                      description={item.description ?? 'payment'}
                      right={({color, style}) => (
                        <View style={{alignItems: 'flex-end'}}>
                          <Text style={{fontWeight: 'bold'}}>
                            {item.account.name}
                          </Text>
                          <Text style={{...style, color: color}}>
                            {format(item.created_on, 'hh:mm aaa, dd MMM')}
                          </Text>
                        </View>
                      )}
                    />
                  );
                }}
              />
            </>
          );
        }}
      />
    </>
  );
}
