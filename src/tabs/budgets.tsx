import {collection, getDocs} from 'firebase/firestore';
import {Budget} from '../interfaces/models/budget';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Card, MD3Colors, ProgressBar, Text} from 'react-native-paper';
import {db} from '../../firebase';
import {useQuery} from 'react-query';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {RouteParamList} from '../interfaces/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCategory} from '../api/category';

export default function Budgets() {
  const {getBudgets} = useCategory();
  const {data, refetch} = useQuery<(WithId<Budget> & {expense?: number})[]>({
    queryKey: 'budgets',
    queryFn: () => getBudgets(),
  });

  const revisit = useCallback(() => {
    refetch();
  }, []);

  useFocusEffect(revisit);

  const navigation =
    useNavigation<NativeStackNavigationProp<RouteParamList, 'Category'>>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button icon={'plus'} onPress={() => navigation.navigate('Category')}>
          Add Category
        </Button>
      ),
    });
  }, []);

  return (
    <>
      <FlatList
        style={styles.pageContainer}
        data={data}
        contentContainerStyle={{gap: 16}}
        columnWrapperStyle={{gap: 16}}
        numColumns={2}
        renderItem={({item}) => {
          return (
            <Card
              mode="contained"
              style={styles.budgetCard}
              contentStyle={{flex: 1}}
              onPress={() => {
                navigation.navigate('Category', {item});
              }}>
              <Card.Content style={styles.budgetCardContent}>
                <Text style={{fontSize: 36}}>{item.icon}</Text>
                <View style={{gap: 8}}>
                  <Text variant="titleLarge">{item.name}</Text>
                  {item.limit && (
                    <Text
                      style={{
                        color:
                          (item.expense ?? 0) < item.limit.amount
                            ? 'green'
                            : 'red',
                      }}>
                      ₹{item.expense ?? 0} / {item.limit?.amount}
                    </Text>
                  )}
                  {item.limit && (
                    <ProgressBar
                      progress={
                        parseFloat((Math.min(item.expense ?? 0, item.limit.amount) /
                        item.limit.amount).toPrecision(2))
                      }
                    />
                  )}
                </View>
              </Card.Content>
            </Card>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    padding: 16,
    gap: 16,
  },
  budgetCard: {
    flex: 0.5,
  },
  budgetCardContent: {
    height: 200,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
