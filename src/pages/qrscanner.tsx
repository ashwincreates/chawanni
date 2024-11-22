import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import NavigationOptions from '../components/utils/NavigationOptions';
import {useState} from 'react';
import queryString from 'query-string';
import {StackNavigationState, useNavigation} from '@react-navigation/native';
import {RouteParamList} from '../interfaces/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface Frame {
  height: number;
  width: number;
  x: number;
  y: number;
}

function QRScanner() {
  const device = useCameraDevice('back');
  const navigation = useNavigation<NativeStackNavigationProp<RouteParamList>>();
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: qr => {
      const qrScanned = qr[0];
      if (qrScanned.value?.startsWith('upi://pay')) {
        navigation.navigate('UPI', {uri: qrScanned.value});
      }
    },
  });

  if (!device)
    return (
      <View>
        <Text>No Camera Found</Text>
      </View>
    );

  return (
    <View style={{flex: 1}}>
      <NavigationOptions options={{headerTitle: 'Scan QR'}} />
      <Camera
        style={{flex: 1}}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    </View>
  );
}

export default QRScanner;
