import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

function NavigationOptions(props: {options: Partial<{}>}) {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions(props.options);
  }, []);
  return null;
}

export default NavigationOptions;
