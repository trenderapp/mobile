import React, { useEffect, useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import notifee from "@notifee/react-native";

import { NavigationProvider, useClient } from "../Components/Container";
import { BottomNavigation } from ".";
import { PostStack, ProfileStack, CreateStack, MessageStack, SettingsStack, SearchStack } from "./Stacks";
import { NotificationScreen } from "../Screens/Notifications";
import { NavigationContextI } from "../Components/Container/Navigation/NavigationContext";
import { Linking } from "react-native";
import { parseURL } from "../Services";

const Stack = createStackNavigator();

export default function MainNavigation({ navigation }: { navigation: NavigationContextI }) {

  const { client } = useClient();

  const [routes] = useState([
    { name: "BottomNavigation", screen: BottomNavigation },
    { name: "ProfileStack", screen: ProfileStack },
    { name: "CreateStack", screen: CreateStack },
    { name: "PostStack", screen: PostStack },
    { name: "SettingsStack", screen: SettingsStack },
    { name: "MessagesStack", screen: MessageStack },
    { name: "NotificationScreen", screen: NotificationScreen },
    { name: "SearchStack", screen: SearchStack }
  ])

  const regex = new RegExp(/^\/[a-zA-Z0-9]+$/);

  const navigateToPost = (post_id: string) => {
    if (navigation) return navigation.navigate("PostStack", { screen: "PostScreen", params: { post_id: post_id } })
  }

  const navigateToProfile = (nickname: string) => {
    if (navigation) return navigation.navigate("ProfileStack", { screen: "ProfileScreen", params: { nickname: nickname } })
  }

  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification && navigation) {
      const pressActionID = initialNotification.pressAction.id;
      const post_id = initialNotification.notification.data ? initialNotification.notification.data.post_id : undefined;
      const notification_id = initialNotification.notification.data ? initialNotification.notification.data.notification_id as string : "0";
      await client.notification.readOne(notification_id);
      if (pressActionID === "display-post" && typeof post_id === "string") return navigateToPost(post_id)
    }
  }

  const redirectLink = (url: string | false) => {
    if (typeof url !== "string") return;
    if (url.startsWith("/trends")) return navigateToPost(url.split("/trends").slice(1)[0].replace("/", ""));
    if (regex.test(url)) return navigateToProfile(url.replace("/", ""));
    return;
}

  const getUrlAsync = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (!initialUrl) return;
    const param = parseURL(initialUrl);
    return redirectLink(param);
  };

  useEffect(() => {
    bootstrap();
    getUrlAsync();
    Linking.addEventListener("url", ({ url }) =>  redirectLink(parseURL(url)));
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
