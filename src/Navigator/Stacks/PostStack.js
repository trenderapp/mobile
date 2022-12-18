import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import { NavigationProvider } from "../../Components/Container";
import PostScreen from "../../Screens/Posts/PostScreen";

const Stack = createStackNavigator();

const PostStack = ({ navigation }) => {

    return (
      <NavigationProvider value={navigation}>
          <Stack.Navigator initialRouteName="ProfileScreen">
            <Stack.Screen name="PostScreen" component={PostScreen} options={{
              headerShown: false
            }}/>
            </Stack.Navigator>
      </NavigationProvider>
    );
};

export default PostStack;
