import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import PostScreen from "../../Screens/Posts/PostScreen";
import PostScreenSearch from "../../Screens/Posts/PostScreenSearch";
import PostScreenShares from "../../Screens/Posts/PostScreenShares";
import Bookmarks from "../../Screens/Posts/Bookmarks";

const Stack = createStackNavigator();

const PostStack = () => {

  const [routes] = useState([
    { name: "PostScreen", screen: PostScreen },
    { name: "PostScreenSearch", screen: PostScreenSearch },
    { name: "PostScreenShares", screen: PostScreenShares },
    { name: "Bookmarks", screen: Bookmarks },
  ])

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
          routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }} />)
        }
      </Stack.Navigator>
  );
};

export default PostStack;
