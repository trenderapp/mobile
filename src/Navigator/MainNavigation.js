import { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { NavigationProvider } from "../Components/Container";
import { BottomNavigation } from ".";
import { PostStack, ProfileStack, CreateStack, MessageStack, SettingsStack } from "./Stacks";
import { NotificationScreen } from "../Screens/Notifications";

const Stack = createStackNavigator();

export default function MainNavigation({ navigation }) {

  const [routes] = useState([
    { name: "BottomNavigation", screen: BottomNavigation },
    { name: "ProfileStack", screen: ProfileStack },
    { name: "CreateStack", screen: CreateStack },
    { name: "PostStack", screen: PostStack },
    { name: "SettingsStack", screen: SettingsStack },
    { name: "MessagesStack", screen: MessageStack },
    { name: "NotificationScreen", screen: NotificationScreen }
  ])

  return (
    <NavigationProvider value={navigation}>
      <Stack.Navigator initialRouteName="BottomNavigation" screenOptions={{ headerShown: false }}>
        {
          routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }} />)
        }
      </Stack.Navigator>
    </NavigationProvider>
  );
};
