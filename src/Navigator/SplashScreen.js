import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { full_height, full_width } from '../Style/style';
import { Loader } from '../Other';
import { useTheme } from '../Components/Container';
import { deviceInfo } from '../Services';

const SplashScreen = () => {

  const { colors } = useTheme();
  const [appInfo, setAppInfo] = useState(undefined);

  const getInfo = async () => {
    setAppInfo(await deviceInfo())
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <View style={{
      width: full_width,
      height: full_height,
      position: "absolute",
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg_primary
    }}>
      <Image source={ require('../Components/Elements/Assets/Images/logo.png') } style={{ width: '70%', resizeMode: 'contain', margin: 40 }} />
      <Loader />
      { appInfo && <Text variant='bodyLarge' style={{ position: "absolute", bottom: 20 }}>{appInfo.version} ({appInfo.build_number})</Text> }
    </View>
  );
};

export default SplashScreen;

