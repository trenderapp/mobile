import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import ProfileEditScreen from "../../Components/Profile/Edit/ProfileEditComponent";
import ProfileScreen from "../../Screens/Profile/ProfileScreen";
import FollowScreen from "../../Screens/Profile/FollowScreen";
import { NavigationProvider } from "../../Components/Container";
import { ProfileContextProvider } from "../../Context/AppContext";

const Stack = createStackNavigator();

const ProfileStack = ({ navigation }) => {

  const [profile, setProfile] = useState(undefined);

  return (
    <NavigationProvider value={navigation}>
      <ProfileContextProvider value={{ profile, setProfile }}>
        <Stack.Navigator initialRouteName="ProfileScreen">
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerShown: false
          }} />
          <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerShown: false
          }} />
          <Stack.Screen name="ProfileFollower" component={FollowScreen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerShown: false
          }} />
        </Stack.Navigator>
      </ProfileContextProvider>
    </NavigationProvider>
  );
};

export default ProfileStack;
