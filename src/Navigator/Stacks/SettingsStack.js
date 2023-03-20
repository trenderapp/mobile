import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { NavigationProvider } from "../../Components/Container";
import HomeSettingsScreen from "../../Screens/Settings/HomeSettingsScreen";
import LanguageThemeScreen from "../../Screens/Settings/LanguageThemeScreen";
import BlockedScreen from "../../Screens/Settings/BlockedScreen";
import SecurityScreen from "../../Screens/Settings/SecurityScreen";
import SessionScreen from "../../Screens/Settings/SessionScreen";
import AffiliationScreen from "../../Screens/Settings/AffiliationScreen";
import SubscriptionValidationScreen from "../../Screens/Settings/SubscriptionValidationScreen";
import SubscriptionScreen from "../../Screens/Settings/SubscriptionScreen";

const Stack = createStackNavigator();

const SettingsStack = ({ navigation }) => {

    return (
      <NavigationProvider value={navigation}>
        <Stack.Navigator initialRouteName="HomeSettingsScreen">
            <Stack.Screen name="HomeSettingsScreen" component={HomeSettingsScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }}/>
            <Stack.Screen name="LanguageThemeScreen" component={LanguageThemeScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }}/>
          <Stack.Screen name="BlockedScreen" component={BlockedScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }}/>
          <Stack.Screen name="SecurityScreen" component={SecurityScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }}/>
          <Stack.Screen name="SessionScreen" component={SessionScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }}/>
          <Stack.Screen name="AffiliationScreen" component={AffiliationScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }}/>
          <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }}/>
          <Stack.Screen name="SubscriptionValidationScreen" component={SubscriptionValidationScreen}  options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }}/>
        </Stack.Navigator>
      </NavigationProvider>
    );
};

export default SettingsStack;
