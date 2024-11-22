import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {PermissionsAndroid, ScrollView, View} from 'react-native';
import {FAB} from 'react-native-paper';
import {RouteParamList} from '../interfaces/routes';

export default function Dashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RouteParamList, 'QR'>>();
  return (
    <>
      <ScrollView></ScrollView>
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
          if (granted === PermissionsAndroid.RESULTS.GRANTED) navigation.navigate('QR');
        }}
        style={{position: 'absolute', bottom: 16, right: 16}}
        label="Make a payment"
      />
    </>
  );
}
