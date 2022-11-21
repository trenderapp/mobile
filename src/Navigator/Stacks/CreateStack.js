import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { NavigationProvider } from "../../Components/Container";
import { CameraScreen } from "../../Screens/CreatePost/CameraScreen";
import { CreatePostContextProvider } from "../../Context/AppContext";
import { DisplayRenderScreen } from "../../Screens/CreatePost/DisplayRenderScreen";
import PostCreatorScreenStack from "../../Screens/CreatePost/PostCreatorScreenStack";

const Stack = createStackNavigator();

const CreateStack = ({ navigation }) => {

  const [file, setFile] = useState(null);

  return (
    <NavigationProvider value={navigation}>
      <CreatePostContextProvider value={{file, setFile}}>
        <Stack.Navigator initialRouteName="PostCreatorScreen">
              <Stack.Screen name="CameraScreen" options={{
                  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
                  headerShown: false
                }} component={CameraScreen} />
                <Stack.Screen name="DisplayRenderScreen" options={{
                  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
                  headerShown: false
                }} component={DisplayRenderScreen} />
                <Stack.Screen name="PostCreatorScreen" options={{
                  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
                  headerShown: false
                }} component={PostCreatorScreenStack} />
        </Stack.Navigator>
      </CreatePostContextProvider>
    </NavigationProvider>
  );
};

export default CreateStack;
