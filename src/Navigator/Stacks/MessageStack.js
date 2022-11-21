import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import CreateGuildScreen from "../../Screens/Messages/CreateGuildScreen";
import MessageScreen from "../../Screens/Messages/MessageScreen";
import { DmMessagesListContextProvider } from "../../Context/DmMessages";
import { NavigationProvider } from "../../Components/Container";

const Stack = createStackNavigator();

const MessageStack = ({ navigation }) => {

    return (
      <NavigationProvider value={navigation}>
        <DmMessagesListContextProvider>
          <Stack.Navigator initialRouteName="MessageScreen">
            <Stack.Screen name="MessageScreen" component={MessageScreen} options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
              headerShown: false
            }}/>
            <Stack.Screen name="CreateGroupScreen" component={CreateGuildScreen} options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
              headerShown: false
            }} />
          </Stack.Navigator>
        </DmMessagesListContextProvider>
      </NavigationProvider>
    );
};

export default MessageStack;
