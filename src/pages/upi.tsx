import {RouteProp} from '@react-navigation/native';
import {NativeModules, View} from 'react-native';
import {RouteParamList} from '../interfaces/routes';
import {Button, MD3Colors, Text} from 'react-native-paper';
// @ts-ignore

function UpiPayment({route}: {route: RouteProp<RouteParamList, 'UPI'>}) {
  const onPay = async () => {
    const {UpiLauncher} = NativeModules
    try {
      const result = await (UpiLauncher.openActivity(route.params.uri.replace('upi', 'phonepe') + '&mc=1234&tr=01234') as Promise<any>)
      console.log(result)
    } catch(e) {
      console.log(e)
    }
  };

  return (
    <View style={{padding: 16}}>
      <Text>{JSON.stringify(route.params.uri.replace('upi', 'phonepe'))}</Text>
      <Button
        mode="contained"
        contentStyle={{backgroundColor: MD3Colors.primary50}}
        onPress={onPay}>
        Pay
      </Button>
    </View>
  );
}

export default UpiPayment;
