import React from 'react';

import {View, Text, SafeAreaView} from 'react-native';

const NotificationScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight:'700' }}>Notification Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;