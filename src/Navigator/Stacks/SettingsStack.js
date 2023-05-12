import React, { useState } from "react";
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
import SubscriptionDashboardScreen from "../../Screens/Settings/SubscriptionDashboardScreen";

const Stack = createStackNavigator();

const SettingsStack = () => {

  const [routes] = useState([
    { name: "HomeSettingsScreen", screen: HomeSettingsScreen },
    { name: "LanguageThemeScreen", screen: LanguageThemeScreen },
    { name: "BlockedScreen", screen: BlockedScreen },
    { name: "AffiliationScreen", screen: AffiliationScreen },
    { name: "SecurityScreen", screen: SecurityScreen },
    { name: "SessionScreen", screen: SessionScreen },
    { name: "SubscriptionScreen", screen: SubscriptionScreen },
    { name: "SubscriptionValidationScreen", screen: SubscriptionValidationScreen },
    { name: "SubscriptionDashboardScreen", screen: SubscriptionDashboardScreen }
  ])

  return (
    <Stack.Navigator initialRouteName="HomeSettingsScreen" screenOptions={{ headerShown: false }}>
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }} />)
      }
    </Stack.Navigator>
  );
};

export default SettingsStack;
