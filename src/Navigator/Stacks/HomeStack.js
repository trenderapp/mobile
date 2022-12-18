import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from "../../Screens/Home/HomeScreen";

const Stack = createStackNavigator();

const HomeScreenStack = () => {

    return (
        <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" options={{ 
              headerShown: false
            }} component={HomeScreen} />
        </Stack.Navigator>
    );
};

export default HomeScreenStack;
