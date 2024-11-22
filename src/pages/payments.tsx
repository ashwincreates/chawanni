import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {Formik} from 'formik';
import {ScrollView, View} from 'react-native';
import {
  Button,
  Chip,
  Icon,
  MD3Colors,
  RadioButton,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import {useQueries} from 'react-query';
import {db} from '../../firebase';
import {getAccount, getAccounts} from '../api/account';
import {getBudgets, getCategory} from '../api/category';
import NavigationOptions from '../components/utils/NavigationOptions';
import {Payment, PaymentEnum} from '../interfaces/models/payment';
import {RouteParamList} from '../interfaces/routes';

function Payments({route}: {route: RouteProp<RouteParamList, 'Payment'>}) {
  const params = route.params;
  const navigation = useNavigation();
  const paymentCollection = collection(db, 'payments');

  const [budget, accounts] = useQueries([
    {queryKey: 'budgets', queryFn: () => getBudgets()},
    {queryKey: 'accounts', queryFn: () => getAccounts()},
  ]);

  const EditMode = !!params;

  const addPayment = async (payment: Partial<Payment>) => {
    if (payment.account && payment.category) {
      const accountRef = getAccount(payment.account.id);
      const categoryRef = getCategory(payment.category.id);
      if (!EditMode) {
        await addDoc(paymentCollection, {
          ...payment,
          created_on: serverTimestamp(),
          account: accountRef,
          category: categoryRef,
        });
      } else {
        await updateDoc(await doc(paymentCollection, params.payment.id), {
          ...payment,
          created_on: serverTimestamp(),
          account: accountRef,
          category: categoryRef,
        });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{padding: 16, gap: 18}}>
      <Formik
        onSubmit={addPayment}
        initialValues={{
          amount: 0,
          type: PaymentEnum.Expense,
          ...params?.payment,
        }}>
        {({handleSubmit, handleReset, values, setFieldValue}) => (
          <>
            <NavigationOptions
              options={{
                headerTitle: EditMode ? 'Edit Payment' : 'New Payment',
                headerShadowVisible: false,
                headerRight: () => (
                  <Button
                    icon="check"
                    onPressIn={() => {
                      handleSubmit();
                      handleReset();
                      navigation.goBack();
                    }}>
                    Submit
                  </Button>
                ),
              }}
            />
            <TextInput
              value={(values.amount ?? 0).toString()}
              keyboardType="number-pad"
              mode="outlined"
              left={
                <TextInput.Icon
                  icon={() => <Text style={{fontSize: 24}}>₹</Text>}
                />
              }
              style={{backgroundColor: MD3Colors.neutral90}}
              outlineStyle={{borderWidth: 0}}
              contentStyle={{fontSize: 28}}
              onChangeText={text =>
                setFieldValue('amount', parseInt(text === '' ? '0' : text))
              }
            />
            <TextInput
              value={values.description}
              onChangeText={text => setFieldValue('description', text)}
              mode="outlined"
              style={{backgroundColor: MD3Colors.neutral90}}
              outlineStyle={{borderWidth: 0}}
              placeholder="description"
            />
            <SegmentedButtons
              value={values.type ?? PaymentEnum.Expense}
              onValueChange={v => setFieldValue('type', v)}
              buttons={[
                {
                  value: PaymentEnum.Expense,
                  label: 'Expense',
                },
                {
                  value: PaymentEnum.Income,
                  label: 'Income',
                },
              ]}
            />
            <Text variant="titleMedium">Account</Text>
            <RadioButton.Group
              value={values.account?.id ?? ''}
              onValueChange={id => {
                setFieldValue(
                  'account',
                  accounts.data?.find(a => a.id === id),
                );
              }}>
              {accounts.data?.map(a => {
                return (
                  <RadioButton.Item
                    key={a.id}
                    mode="ios"
                    value={a.id}
                    label={a.name}
                  />
                );
              })}
            </RadioButton.Group>
            {values.type === PaymentEnum.Expense && (
              <>
                <Text variant="titleMedium">Category</Text>
                <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
                  {budget.data?.map(b => {
                    const isSelected =
                      values.category && values.category.id === b.id;
                    return (
                      <Chip
                        showSelectedCheck
                        selected={isSelected}
                        key={b.id}
                        icon={
                          !isSelected ? () => <Text>{b.icon}</Text> : undefined
                        }
                        onPress={() => setFieldValue('category', b)}>
                        {b.name}
                      </Chip>
                    );
                  })}
                </View>
              </>
            )}
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

export default Payments;
