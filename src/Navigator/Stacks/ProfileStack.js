import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import ProfileEditScreen from "../../Components/Profile/Edit/ProfileEditComponent";
import ProfileScreen from "../../Screens/Profile/ProfileScreen";
import FollowScreen from "../../Screens/Profile/FollowScreen";
import { NavigationProvider } from "../../Components/Container";
import { ProfilePostsListContextProvider } from "../../Components/Profile/ProfileContext";

const Stack = createStackNavigator();

const ProfileStack = ({ navigation }) => {

  return (
    <NavigationProvider value={navigation}>
      <ProfilePostsListContextProvider>
        <Stack.Navigator initialRouteName="ProfileScreen">

          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }} />

          <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }} />

          <Stack.Screen name="ProfileFollower" component={FollowScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }} />

        </Stack.Navigator>
      </ProfilePostsListContextProvider>
    </NavigationProvider>
  );
};

export default ProfileStack;
