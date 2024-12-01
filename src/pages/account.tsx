import {RouteProp, useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RouteParamList} from '../interfaces/routes';
import {Formik} from 'formik';
import {addDoc, collection} from 'firebase/firestore';
import {db} from '../../firebase';
import NavigationOptions from '../components/utils/NavigationOptions';
import {Account} from '../interfaces/models/account';
import {useAccount} from '../api/account';

function _Account({route}: {route: RouteProp<RouteParamList, 'Account'>}) {
  const params = route.params;
  const navigation = useNavigation();
  const {accountCollection} = useAccount();

  const EditMode = !!params;

  const addAcount = async (budget: Account) => {
    await addDoc(accountCollection, budget);
  };

  return (
    <View style={{padding: 16, gap: 18}}>
      <Formik
        onSubmit={addAcount}
        initialValues={{name: '', ...params?.account}}>
        {({handleSubmit, handleReset, values, setFieldValue}) => (
          <>
            <NavigationOptions
              options={{
                headerTitle: EditMode ? 'Edit Account' : 'Add Account',
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
          </>
        )}
      </Formik>
    </View>
  );
}

export default _Account;
