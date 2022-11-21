import React from 'react';
import { View, Image } from 'react-native';
import { full_height, full_width } from '../Style/style';
import { Loader } from '../Other';
import { useTheme } from '../Components/Container';

const SplashScreen = () => {

  const { colors } = useTheme();

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
    </View>
  );
};

export default SplashScreen;

