import {StyleSheet, View, ScrollView} from 'react-native';
import {
  Button,
  Card,
  IconButton,
  MD3Colors,
  Modal,
  Portal,
  Text,
} from 'react-native-paper';
import {Account} from '../interfaces/models/account';
import {db} from '../../firebase';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {deleteDoc, doc} from 'firebase/firestore';
import {useCallback, useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import {RouteParamList} from '../interfaces/routes';
import {useAccount} from '../api/account';

export default function Accounts() {
  const {getAccounts} = useAccount();
  const {data, refetch} = useQuery<WithId<Account>[]>({
    queryKey: 'accounts',
    queryFn: () => getAccounts(),
  });

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const revisit = useCallback(() => {
    refetch();
  }, []);

  useFocusEffect(revisit);

  const navigation =
    useNavigation<NativeStackNavigationProp<RouteParamList, 'Account'>>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button icon={'plus'} onPress={() => navigation.navigate('Account')}>
          Add Account
        </Button>
      ),
    });
  }, []);

  const deleteAccount = async (id: string) => {
    await deleteDoc(doc(db, 'accounts', id));
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.pageContainer}>
        {data?.map((account, index) => (
          <Card
            key={index}
            mode="contained"
            style={styles.accountCard}
            contentStyle={styles.accountCardContent}>
            <Card.Content style={styles.accountCardContent}>
              <Text
                style={{fontWeight: 700, color: 'white'}}
                variant="titleLarge">
                {account.name}
              </Text>
            </Card.Content>
            <Card.Actions style={styles.accountCardActions}>
              <View style={{flex: 1}}>
                <Text style={{color: 'white'}}>balance</Text>
                <Text
                  style={{fontWeight: 700, color: 'white'}}
                  variant="headlineMedium">
                  10,000
                </Text>
              </View>
              <IconButton
                icon="delete"
                onPress={() => setSelectedAccount(account.id)}
              />
            </Card.Actions>
          </Card>
        ))}
        <Portal>
          <Modal
            visible={selectedAccount !== null}
            onDismiss={() => setSelectedAccount(null)}
            style={{padding: 16}}>
            <Card>
              <Card.Title
                titleVariant="titleMedium"
                title={'Are you sure to delete this account?'}
              />
              <Card.Actions>
                <Button
                  onPress={() => {
                    if (selectedAccount) {
                      deleteAccount(selectedAccount).then(() => refetch());
                      setSelectedAccount(null);
                    }
                  }}>
                  Delete
                </Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  accountCard: {
    backgroundColor: MD3Colors.primary50,
    height: 220,
    position: 'relative',
    padding: 8,
    borderRadius: 24,
  },
  accountCardContent: {
    flex: 1,
  },
  accountCardActions: {},
});
