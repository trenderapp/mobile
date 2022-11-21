import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import { NavigationProvider } from "../../Components/Container";
import PostScreen from "../../Screens/Posts/PostScreen";
import { PostsCommentsContextListContextProvider } from "../../Context/PostsCommentsContext";

const Stack = createStackNavigator();

const PostStack = ({ navigation }) => {

    return (
      <NavigationProvider value={navigation}>
        <PostsCommentsContextListContextProvider>
          <Stack.Navigator initialRouteName="ProfileScreen">

            <Stack.Screen name="PostScreen" component={PostScreen} options={{
              headerShown: false
            }}/>

            </Stack.Navigator>
        </PostsCommentsContextListContextProvider>
      </NavigationProvider>
    );
};

export default PostStack;
