import {RouteProp, useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RouteParamList} from '../interfaces/routes';
import {Formik} from 'formik';
import {Budget} from '../interfaces/models/budget';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {db} from '../../firebase';
import NavigationOptions from '../components/utils/NavigationOptions';
import {useCategory} from '../api/category';

function Category({route}: {route: RouteProp<RouteParamList, 'Category'>}) {
  const params = route.params;
  const navigation = useNavigation();
  const {addLimit, getBudgetCollection} = useCategory();
  const budgetCollection = getBudgetCollection()

  const EditMode = !!params;

  const addBudget = async (budget: Budget) => {
    if (!EditMode) {
      await addDoc(budgetCollection, budget);
    } else {
      let limitRef;
      if (budget.limit) {
        if (budget.limit.id) {
          limitRef = doc(
            collection(doc(getBudgetCollection(), params.item.id), 'limit'),
            budget.limit.id,
          );
          await updateDoc(limitRef, {...budget.limit});
        } else {
          limitRef = await addLimit(params.item.id, budget.limit);
        }
      }
      await updateDoc(await doc(budgetCollection, params.item.id), {
        ...budget,
        limit: limitRef,
      });
    }
  };

  return (
    <View style={{padding: 16, gap: 18}}>
      <Formik
        onSubmit={addBudget}
        initialValues={{name: '', icon: '', ...params?.item}}>
        {({handleSubmit, handleReset, values, setFieldValue}) => (
          <>
            <NavigationOptions
              options={{
                headerTitle: EditMode ? 'Edit Category' : 'Add Category',
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
              value={values.name}
              onChangeText={text => setFieldValue('name', text)}
              label={'Name'}
            />
            <TextInput
              value={values.icon}
              onChangeText={text => setFieldValue('icon', text)}
              label={'Icon'}
            />
            {values.limit ? (
              <TextInput
                keyboardType="number-pad"
                value={(values.limit?.amount ?? 0).toString()}
                onChangeText={text =>
                  setFieldValue(
                    'limit.amount',
                    parseInt(text === '' ? '0' : text),
                  )
                }
                label={'limit'}
              />
            ) : (
              <>
                {params?.item.id && (
                  <Button
                    onPress={() =>
                      setFieldValue('limit', {
                        amount: 0,
                        month: serverTimestamp(),
                      })
                    }>
                    Set Limit
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </Formik>
    </View>
  );
}

export default Category;
