import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import SearchScreen from "../../Screens/Search/SearchScreen";
import SearchModal from "../../Components/Search/SearchModal";

const Stack = createStackNavigator();

const SearchStack = () => {

    return (
        <Stack.Navigator initialRouteName="SearchScreen">

          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{
            headerShown: false
          }}/>
          <Stack.Screen name="SearchModal" component={SearchModal} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
            headerShown: false
          }} />

        </Stack.Navigator>
    );
};

export default SearchStack;
