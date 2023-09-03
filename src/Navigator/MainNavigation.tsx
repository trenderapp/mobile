import React, { useEffect, useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import notifee from "@notifee/react-native";

import { NavigationProvider } from "../Components/Container";
import { BottomNavigation } from ".";
import { PostStack, ProfileStack, CreateStack, MessageStack, SettingsStack } from "./Stacks";
import { NotificationScreen } from "../Screens/Notifications";
import { NavigationContextI } from "../Components/Container/Navigation/NavigationContext";

const Stack = createStackNavigator();

export default function MainNavigation({ navigation }: { navigation: NavigationContextI }) {

  const [routes] = useState([
    { name: "BottomNavigation", screen: BottomNavigation },
    { name: "ProfileStack", screen: ProfileStack },
    { name: "CreateStack", screen: CreateStack },
    { name: "PostStack", screen: PostStack },
    { name: "SettingsStack", screen: SettingsStack },
    { name: "MessagesStack", screen: MessageStack },
    { name: "NotificationScreen", screen: NotificationScreen }
  ])


  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification && navigation) {
      const pressActionID = initialNotification.pressAction.id;      
      const post_id = initialNotification.notification.data ? initialNotification.notification.data.post_id : undefined;
      if (pressActionID === "display-post" && typeof post_id === "string") return navigation.navigate("PostStack", {
        screen: "PostScreen",
        params: {
          post_id: post_id
        }
      })
    }
  }

  useEffect(() => {
    bootstrap()
  }, [])

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
